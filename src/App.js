import React, { Component } from 'react';
import './App.css';
import Board from './components/Board/Board';
import { constructInitialPositions } from './game/game';
import { COLOR_DARK } from './constants/constants';

let positions = constructInitialPositions(COLOR_DARK);

class App extends Component {
  render() {
    return (
      <div className="App">
        <Board
          onSquareClick={(row, col) => console.log(`Click at (${row}, ${col})`)}
          positions={positions}
        ></Board>
      </div>
    );
  }
}

export default App;
