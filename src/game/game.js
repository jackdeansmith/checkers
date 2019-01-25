// This file exists to codify the rules of the game and ensure that all moves are valid
import clone from 'clone';
import {COLOR_DARK, COLOR_LIGHT, RANK_MAN, RANK_KING} from '../constants/constants';
import {even, odd} from '../util/even';

export function isDarkSquare(row, col){
    return (even(row) && odd(col)) || (odd(row) && even(col));
}

// Function which constructs the initial positions of the game
export function constructInitialPositions(rowAscendingColor) {
    let positions = [];

    for (let row=0; row<8; row++){
        positions.push([]);
        for (let col=0; col<8; col++){

            // Either the dark or the light checkers could be ascending the row indicies
            let inDarkCheckerStartRows;
            let inLightCheckerStartRows;
            if(rowAscendingColor === COLOR_DARK){
                inDarkCheckerStartRows = 0 <= row && row <= 1;
                inLightCheckerStartRows = 6 <= row && row <= 7;
            }
            else {
                inLightCheckerStartRows = 0 <= row && row <= 1;
                inDarkCheckerStartRows = 6 <= row && row <= 7;
            }
            const inDarkSquare = isDarkSquare(row, col);

            let checker;
            if(inDarkSquare && inDarkCheckerStartRows){
                checker = {color: COLOR_DARK, rank: RANK_MAN}
            }
            else if(inDarkSquare && inLightCheckerStartRows){
                checker = {color: COLOR_LIGHT, rank: RANK_MAN}
            }
            else{
                checker = null;
            }

            positions[row][col] = checker;
        }
    }

    return positions;
}


// Construct the full initial game state
export function constructInitialGameState(rowAscendingColor){
    return {
        rowAscendingColor,
        positions: constructInitialPositions(rowAscendingColor),
        nextMoveBelongsTo: COLOR_DARK, // Part of the rules of checkers, dark makes the first move
    }
}

// Iterate over the checkers in the board, returns {row: x, col: y, checker: z}
export function* makeCheckersIterator(positions){
    for (let row=0; row<8; row++){
        for (let col=0; col<8; col++){
            const checker = positions[row][col];
            if(checker){
                yield {pos: {row, col}, checker};
            }
        }
    }
}

function inBounds({row, col}){
    return 0 <= row && row <= 7 && 0<= col && col <= 7;
}

// Get all the possible moves for a particular checker, other rules may exclude these moves
export function getPossibleMoves(gameState, fromPos){
    const fromChecker = gameState.positions[fromPos.row][fromPos.col];

    // Must be a checker to move
    if(!fromChecker){
        return [];
    }

    // Determine the row directions we are allowed to move
    let rowDirectionUnits = allRowDirectionUnits(fromChecker, gameState.rowAscendingColor);

    // Determine if there are valid capture moves
    let captureMoves = [];
    for (let rowUnit of rowDirectionUnits){
        for (let colUnit of [-1, 1]){
            const opponentPos = {row: fromPos.row+rowUnit, col: fromPos.col+colUnit};
            const landingPos = {row: fromPos.row+2*rowUnit, col: fromPos.col+2*colUnit};
            if(!inBounds(opponentPos) || !inBounds(landingPos)){
                continue;
            }

            const opponentChecker = gameState.positions[opponentPos.row][opponentPos.col];
            const landingChecker = gameState.positions[landingPos.row][landingPos.col];

            // if the oponent position is occupied by an opponent and the landing position is unocupied, valid capture
            if(opponentChecker && opponentChecker.color !== fromChecker.color && !landingChecker){
                captureMoves.push({...landingPos, isCapture: true});
            }
        }
    }

    // If a capture move is available, it must be taken, even if other moves are available.
    if(captureMoves.length){
        return captureMoves;
    }

    // Determine if there are valid non-capture moves
    let nonCaptureMoves=[];
    for (let rowUnit of rowDirectionUnits){
        for (let colUnit of [-1, 1]){
            const landingPos = {row: fromPos.row+rowUnit, col: fromPos.col+colUnit};

            if(!inBounds(landingPos)){
                continue;
            }

            const landingChecker = gameState.positions[landingPos.row][landingPos.col];

            // Must not land on top of another checker
            if(!landingChecker){
                nonCaptureMoves.push({...landingPos, isCapture: false});
            }
        }
    }
    return nonCaptureMoves;
}

// Consumes the game state and gives the set of all possible next moves in the game.
export function allPossibleMoves(gameState){
    // Basic rules for possible moves:
    //  If the player just captured(constrained checker), and the capturing piece has another capture available, those are the only options
    //  If there is some capture available on the board, those are the only moves available.
    //  If there are diagonals open in the direction of travel, those are the available moves.

    let moves = [];
    for (let {pos, checker} of makeCheckersIterator(gameState.positions)){
        const fromPos = pos;

        if(checker.color !== gameState.nextMoveBelongsTo){
            continue;
        }

        const possibleMoves = getPossibleMoves(gameState, fromPos).map((toPos) => ({fromPos, toPos, isCapture: toPos.isCapture}));

        // If we find that a checker is in a capture sequence, then all other moves are not allowed
        if (checker.inCaptureSequence){
            return possibleMoves.filter((move) => move.isCapture);
        }

        moves.push(...possibleMoves);
    }

    // If any of the moves are capture moves, then the only alloable moves are capture moves
    const captureMoves = moves.filter((move) => move.isCapture);
    if(captureMoves.length){
        return captureMoves;
    }
    return moves;
}

// Accepts a game state, a from position, and a too position. Returns the new game state or null if move is not legal
export function makeMove(oldState, fromPos, toPos){
    const gameState = clone(oldState);

    // Must be a checker of the correct color in the fromPosition
    if(!inBounds(fromPos) || !gameState.positions[fromPos.row][fromPos.col] || gameState.positions[fromPos.row][fromPos.col].color !== gameState.nextMoveBelongsTo){
        return null;
    }

    // Get the possible moves of the fromPos checker
    const possibleMoves = allPossibleMoves(gameState);

    // The toPos must be one of those
    if(!possibleMoves.filter((m) => (
        m.fromPos.row === fromPos.row && m.fromPos.col === fromPos.col &&
        m.toPos.row === toPos.row && m.toPos.col === toPos.col
    ).length)){
        return null;
    }

    // Move the checker
    let checker = gameState.positions[fromPos.row][fromPos.col];
    gameState.positions[fromPos.row][fromPos.col] = null;
    gameState.positions[toPos.row][toPos.col] = checker;

    // If the move is a capture...
    const isCapture = Math.abs(toPos.row - fromPos.row) > 1;
    if(isCapture){
        // Remove the opponent piece
        const rowDirection = (toPos.row - fromPos.row)/2;
        const colDirection = (toPos.col - fromPos.col)/2;
        gameState.positions[fromPos.row + rowDirection][fromPos.col + colDirection] = null;
    }

    // If we are in a capture sequence
    if(isCapture && getPossibleMoves(gameState, toPos).filter((x) => x.isCapture).length){
        checker.inCaptureSequence = true;
    }
    else{
        checker.inCaptureSequence = false;
        gameState.nextMoveBelongsTo = otherColor(gameState.nextMoveBelongsTo);
    }

    // Crown the checker
    const crownRow = gameState.rowAscendingColor === checker.color ? 7 : 0;
    if(toPos.row === crownRow){
        checker.rank = RANK_KING;
    }

    return gameState;
}


function otherColor(color){
    return color === COLOR_DARK ? COLOR_LIGHT : COLOR_DARK;
}

function forwardDirectionUnit(color, rowAscendingColor){
    return color === rowAscendingColor ? 1 : -1;
}

function allRowDirectionUnits(checker, rowAscendingColor){
    let rowDirectionUnits = [forwardDirectionUnit(checker.color, rowAscendingColor)];
    if (checker.rank === RANK_KING){
        rowDirectionUnits.push(-1 * rowDirectionUnits[0]); // Kings can go backwards
    }
    return rowDirectionUnits;
}

// Returns the game winner if there is one, null if nobody has won yet
export function winner(positions){
    let winner = null;
    for (let {checker} of makeCheckersIterator(positions)){
        if(!winner){
            winner = checker.color;
        }
        else if(winner !== checker.color){
            winner = null;
            break;
        }
    }
    return winner;
}
