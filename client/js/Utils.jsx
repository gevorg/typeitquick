'use strict';

// Used to calculate WPM.
export function calcWPM(progress, time, words) {
    let textLength = 0;

    for (let i = 0; i < progress; ++i) {
        textLength += words[i].length + 1;
    }

    return parseInt(textLength * 60 / 5 / time) || 0;
}