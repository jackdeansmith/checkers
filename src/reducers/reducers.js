// Main reducers file

import {PLAYER_USER, PLAYER_AI} from '../constants'
import { COLOR_DARK } from '../constants/constants';

const initialState = {
    // The state of the game only, where the checkers are, what rank the checkers are, and who gets the current turn
    gameState: {
        positions: null,
        rowAscendingColor: null,
    },
    uiState: {
        selected: {row: 1, col: 2},
    }
}

export function checkersApp(state = initialState, action){
    return state;
}
