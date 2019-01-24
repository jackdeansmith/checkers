import React from 'react';
import Checker from '../Checker/Checker';
import {even, odd} from '../../util/even';
import './Board.css';

function Board({positions, onSquareClick}){
    let squares = [];

    for (let row=0; row<8; row++){
        for (let col=0; col<8; col++){

            let squareIsDark = (even(row) && odd(col)) || (odd(row) && even(col));
            let style = squareIsDark ? {backgroundColor: "black"} : {};
            let checker = positions[row][col];

            squares.push((
                <div
                    className={"Board-Square"}
                    key={`${row}${col}`}
                    style={style}
                    onClick={() => onSquareClick(row, col)}
                >
                    {checker ? <Checker onClick={()=>console.log(`Checker at (${row}, ${col}) clicked!`)} {...checker}/> : null}
                </div>
            ));
        }
    }

    return (
        <div className='Board-PlayArea'>
            {squares}
        </div>
    );
}

export default Board;
