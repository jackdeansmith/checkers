import React, { Component } from 'react';
import './App.css';
import {even, odd} from './util/even';
import {CHECKER_DARK_COLOR, CHECKER_LIGHT_COLOR} from './components/Checker/Checker';
import Board from './components/Board/Board';

let checkers = {};
for (let row=0; row<8; row++){
    for (let col=0; col<8; col++){

        const darkSquare = ((even(row) && odd(col)) || (odd(row) && even(col)));
        const darkCheckerStartZone = 0 <= row && row <= 1;
        const lightCheckerStartZone = 6 <= row && row <= 7;

        if(darkSquare && darkCheckerStartZone){
          checkers[`${row} ${col}`] = {color: CHECKER_DARK_COLOR};
        }
        if(darkSquare && lightCheckerStartZone){
          checkers[`${row} ${col}`] = {color: CHECKER_LIGHT_COLOR};
        }
    }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Board
          onSquareClick={(row, col) => console.log(`Click at (${row}, ${col})`)}
          checkers={checkers}
        ></Board>
      </div>
    );
  }
}

export default App;
