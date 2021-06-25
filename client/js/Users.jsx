'use strict';

// Global imports.
import React from 'react';
import { PropTypes } from 'prop-types'; 

// Local imports.
import {calcWPM} from './Utils.jsx'

// User list component.
const Users = ({users, userId, duration, startTime, words}) => {
    // User list.
    const userList = users.map((user) => {
        let playerClass = 'user-box';
        let player = 'guest';

        if (user.id === userId) {
            playerClass += ' you';
            player = 'you';
        }

        let playerImg = `/img/${player}.png`;
        let wpm = calcWPM(user.progress, duration - startTime, words);
        let progressPercent = Math.floor(user.progress * 100 / words.length);

        return (
            <div className={playerClass} key={user.id}>
                <div className='user-progress' style={{ width: `${progressPercent}%` }}></div>
                <div className='user-wpm'>{wpm} wpm</div>
                <div className='user-player'>
                    <img src={playerImg} title={player} />
                </div>
            </div>
        );
    });

    return (
        <span>{userList}</span>
    );
};

// Define property types.
Users.propTypes = {
    users: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    startTime: PropTypes.number.isRequired,
    words: PropTypes.array.isRequired
};

export default Users;