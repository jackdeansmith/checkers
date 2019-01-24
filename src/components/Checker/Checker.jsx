import React from 'react';
import './Checker.css'

export const CHECKER_LIGHT_COLOR = 0;
export const CHECKER_DARK_COLOR = 1;

const LIGHT = "#ffffff";
const DARK = "#ff1f05";

function Checker({color, king, onClick}){
    let colorHex = 0;
    switch (color){
        case CHECKER_LIGHT_COLOR:
            colorHex = LIGHT;
            break;
        case CHECKER_DARK_COLOR:
            colorHex = DARK;
            break;
        default:
            throw new Error("Expected a color parameter for checker");
    }

    return (
        <div
            className='Checker-Checker'
            style={{background: colorHex, border: king ? "2px black solid" : ""}}
        >
        </div>
    );
}

export default Checker;
