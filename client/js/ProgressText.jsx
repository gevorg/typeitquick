'use strict';

import React, { PropTypes } from 'react';

const ProgressText = ({ startTime, contest }) => {
    let text = '';
    let time = startTime;
    let hurryUp = '';

    if ('guest' === contest) {
        hurryUp = <strong>Hurry Up! </strong>
    }

    if ('waiting' === contest || 'guest' === contest) {
        text = `Contest starts ${time > 1 ? 'from ' + time + ' seconds' : 'now'}!`
    } else if ('playing' === contest) {
        text = `Contest ends ${time > 1 ? 'in ' + time + ' seconds' : 'now'}!`;
    }

    return (
        <span>
            {hurryUp}
            {text}
        </span>
    );
};

// Define property types.
ProgressText.propTypes = {
    startTime: PropTypes.number.isRequired,
    contest: PropTypes.string.isRequired
};


export default ProgressText;