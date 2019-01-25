import React from 'react';
import Checker from '../Checker/Checker';
import {even, odd} from '../../util/even';
import './Board.css';

function Board({positions, onSquareClick, selected, hilighted}){
    let squares = [];

    for (let row=0; row<8; row++){
        for (let col=0; col<8; col++){

            const squareIsDark = (even(row) && odd(col)) || (odd(row) && even(col));
            const shadingStyle = squareIsDark ? {backgroundColor: "black"} : {};

            const isSelected = selected && selected.row === row && selected.col === col;
            const isHilighted = hilighted.filter((pos) => pos.row === row && pos.col === col).length;


            let borderStyle = {}
            if(isSelected){
                borderStyle = {border: "solid yellow 2px"};
            }
            else if(isHilighted){
                borderStyle = {border: "solid hotpink 2px"};
            }

            const style = {...shadingStyle, ...borderStyle};

            const checker = positions[row][col];

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
