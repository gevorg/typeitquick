'use strict';

import React from 'react';

const ProgressText = (props) => {
    let text = '';
    let time = props.startTime;
    let hurryUp = '';

    if ('guest' === props.contest) {
        hurryUp = <strong>Hurry Up! </strong>
    }

    if ('waiting' === props.contest || 'guest' === props.contest) {
        text = `Contest starts ${time > 1 ? 'from ' + time + ' seconds' : 'now'}!`
    } else if ('playing' === props.contest) {
        text = `Contest ends ${time > 1 ? 'in ' + time + ' seconds' : 'now'}!`;
    }

    return (
        <span>
            {hurryUp}
            {text}
        </span>
    );
};

export default ProgressText;