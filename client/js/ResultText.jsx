'use strict';

import React from 'react';
import { PropTypes } from 'prop-types'; 

import {calcWPM} from './Utils.jsx'

const ResultText = ({ contest, duration, startTime, progress, words, playAgain, winner, userId}) => {
    let text = '';

    if ('done' === contest) {
        let time = duration - startTime;
        let wpm = calcWPM(progress, time, words);

        let wordsText = 1 === wpm ? 'word' : 'words';
        let playAgainLink = <span>, <a href='#' onClick={playAgain}>play again!</a></span>;

        if (userId !== winner) {
            text = <span>Your result is <b>{wpm}</b> {wordsText} per minute{playAgainLink}</span>
        } else {
            text = <span>Your are <b>the winner</b> with <b>{wpm}</b> {wordsText} per minute{playAgainLink}</span>
        }
    }

    return <span>{text}</span>
};

// Define property types.
ResultText.propTypes = {
    contest: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    startTime: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
    words: PropTypes.array.isRequired,
    playAgain: PropTypes.func.isRequired,
    winner: PropTypes.string,
    userId: PropTypes.string.isRequired
};

export default ResultText;