'use strict';

import React from 'react';

import {calcWPM} from './Utils.jsx'

const ResultText = (props) => {
    let text = '';

    if ('done' === props.contest) {
        let time = props.duration - props.startTime;
        let wpm = calcWPM(props.progress, time, props.words);

        let words = 1 === wpm ? 'word' : 'words';
        let playAgain = <span>, <a href='#' onClick={props.playAgain}>play again!</a></span>;

        if (props.userId !== props.winner) {
            text = <span>Your result is <b>{wpm}</b> {words} per minute{playAgain}</span>
        } else {
            text = <span>Your are <b>the winner</b> with <b>{wpm}</b> {words} per minute{playAgain}</span>
        }
    }

    return <span>{text}</span>
};

export default ResultText;