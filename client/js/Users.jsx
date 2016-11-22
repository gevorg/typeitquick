'use strict';

// Global imports.
import React from 'react';

// Local imports.
import {calcWPM} from './Utils.jsx'

// User list component.
const Users = (props) => {
    // User list.
    const userList = props.users.map((user) => {
        let time = props.duration - props.startTime;
        let playerClass = 'user-box';
        let player = 'guest';

        if (user.id === props.userId) {
            playerClass += ' you';
            player = 'you';
        }

        let playerImg = '/img/' + player + '.png';
        let wpm = calcWPM(user.progress, time, props.words);
        let progress = Math.floor(user.progress * 100 / props.words.length);

        return (
            <div className={playerClass} key={user.id}>
                <div className='user-progress' style={{width: progress + '%'}}></div>
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

export default Users;