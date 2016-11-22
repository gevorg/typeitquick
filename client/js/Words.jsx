'use strict';

import React from 'react';

const Words = (props) => {
    // If no words loaded.
    if (!props.words.length) return <div className='word-box word-loading'>Loading...</div>;

    // Hidden layer.
    let layer = 'guest' === props.contest ? <div className='word-layer' /> : '';

    // Words.
    const words = props.words.map((word, index) => {
        let className = '';

        if (index < props.progress) {
            className = 'word-done';
        } else if (index === props.progress) {
            className = 'word-now';
        }

        return <span key={index} className={className}><span>{word}</span> </span>
    });

    return (
        <div className='word-box'>
            {layer}
            <div className='un-selectable words'>{words}</div>
        </div>
    );
};

export default Words;