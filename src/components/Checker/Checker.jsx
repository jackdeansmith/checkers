import React from 'react';
import { FaCrown } from 'react-icons/fa';
import './Checker.css';
import { COLOR_DARK, COLOR_LIGHT, RANK_KING, RANK_MAN } from '../../constants/constants';

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

    return (
        <div
            className='Checker-Checker'
            style={{background: colorHex}}
            onClick={onClick}
        >
        {rank === RANK_KING ? <FaCrown className="Checker-Icon"/> : null}
        </div>
    );
}

export default Checker;
