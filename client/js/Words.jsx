'use strict';

import React, { PropTypes } from 'react';

const Words = ({words, contest, progress}) => {
    // If no words loaded.
    if (!words.length) return <div className='word-box word-loading'>Loading...</div>;

    // Hidden layer.
    let layer = 'guest' === contest ? <div className='word-layer' /> : '';

    // Words.
    const wordList = words.map((word, index) => {
        let className = '';

        if (index < progress) {
            className = 'word-done';
        } else if (index === progress) {
            className = 'word-now';
        }

        return <span key={index} className={className}><span>{word}</span> </span>
    });

    return (
        <div className='word-box'>
            {layer}
            <div className='un-selectable words'>{wordList}</div>
        </div>
    );
};

// Define property types.
Words.propTypes = {
    words: PropTypes.array.isRequired,
    contest: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired
};

export default Words;