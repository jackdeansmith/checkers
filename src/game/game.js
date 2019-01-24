// This file exists to codify the rules of the game and ensure that all moves are valid
import {COLOR_DARK, COLOR_LIGHT, RANK_MAN} from '../constants/constants';
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
