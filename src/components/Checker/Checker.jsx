import React from 'react';
import './Checker.css'
import { COLOR_DARK, COLOR_LIGHT } from '../../constants/constants';

const LIGHT = "#ffffff";
const DARK = "#ff1f05";

function Checker({color, rank, onClick}){
    let colorHex = 0;
    switch (color){
        case COLOR_LIGHT:
            colorHex = LIGHT;
            break;
        case COLOR_DARK:
            colorHex = DARK;
            break;
        default:
            throw new Error("Expected a color parameter for checker");
    }

    // TODO check the rank of the checker

    return (
        <div
            className='Checker-Checker'
            style={{background: colorHex}}
            onClick={onClick}
        >
        </div>
    );
}

export default Checker;
