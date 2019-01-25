import React, { Component } from 'react';
import './App.css';
import Board from './components/Board/Board';
import { getPossibleMoves, constructInitialGameState, allPossibleMoves, makeMove} from './game/game';
import { COLOR_DARK } from './constants/constants';


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      gameState: constructInitialGameState(COLOR_DARK),
      selected: null,
    }
  }

  render() {
    const gameState = this.state.gameState;

    let hilighted = [];
    if(this.state.selected){
      hilighted = allPossibleMoves(gameState)
          .filter(({fromPos, toPos}) =>
            fromPos.row === this.state.selected.row &&
            fromPos.col === this.state.selected.col)
          .map(({fromPos, toPos}) => toPos);
    }

    return (
      <div className="App">
        <Board
          selected={this.state.selected}
          hilighted={hilighted}
          onSquareClick={this.onSquareClick}
          positions={gameState.positions}
        ></Board>
        <button
          onClick={() => {
            console.log(JSON.stringify(allPossibleMoves(gameState)));
          }}
        >
        {"Display all possible next moves"}
        </button>
      </div>
    );
  }

  onSquareClick = (row, col) => {
    console.log(`Click action on (${row}, ${col})`);
    this.setState((prevState, props) => {

      const clickedChecker = prevState.gameState.positions[row][col];

      // If nothing is selected, and a checker that can be moved is clicked on, select it
      if(!prevState.selected){
        if(clickedChecker && clickedChecker.color === prevState.gameState.nextMoveBelongsTo){
          return {
            ...prevState,
            selected: {row, col},
          };
        }
        else{
          return prevState;
        }
      }

      // Deselect on double click
      if(prevState.selected.row === row && prevState.selected.col === col){
        return {
          ...prevState,
          selected: null,
        };
      }

      // Attempt to make a move
      const fromPos = {row: prevState.selected.row, col: prevState.selected.col};
      const toPos = {row, col};
      const result = makeMove(prevState.gameState, fromPos, toPos);
      if(result){
        return {
          gameState: result,
          selected: null,
        }
      }
    });
  }
}

export default App;
