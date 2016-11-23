'use strict';

// Global imports.
import React from 'react';
import ReactDOM from 'react-dom';
import Recaptcha from 'react-recaptcha'

// Local imports.
import Users from './Users.jsx'
import Words from './Words.jsx'
import TextInput from './TextInput.jsx'
import ProgressText from './ProgressText.jsx'
import ResultText from './ResultText.jsx'


// Initial state.
const START = {
    // States 'loading', 'guest', 'waiting', 'playing', 'done'.
    contest: 'loading',
    id: -1,
    words: [],
    users: [],
    userId: '',
    progress: 0,
    winner: null,
    startTime: 0,
    duration: 0,
    captchaKey: null
};

// The main component.
class App extends React.Component {
    constructor() {
        super();

        this.state = START;
    }

    captchaLoaded() {
        console.log('CAPTCHA LOADED!');
    }

    captchaDone(captcha) {
        let self = this;

        fetch('/join', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ captcha: captcha, id: self.state.id })
        }).then(() => {
            // Update state.
            self.setState({...self.state, contest: 'waiting'});
        });
    }

    setupSocket(id) {
        let socket = io(document.location.href + id);
        let self = this;

        socket.on('join', (data) => {
            // Add user.
            let users = self.state.users.slice();
            users.push(data);

            // Set state.
            self.setState({...self.state, users: users});
        });

        socket.on('word', (data) => {
            self.updateProgress(data);
        });

        return socket;
    }

    loadContest() {
        let self = this;

        fetch('/current', {
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then((json) => {
            let c = json.contest;
            let contest = 'guest';

            // If user already joined.
            c.users.some((user) => {
                if (user.id === json.userId) {
                    contest = 'waiting';
                    return true;
                }
            });

            this.socket = self.setupSocket(c.id);

            // Update state.
            self.setState({...self.state, contest: contest, startTime: json.remaining, duration: json.duration,
                            captchaKey: json.captchaKey,  userId: json.userId, id: c.id, words: c.words,
                            users: c.users});

            // Starting timer.
            self.startTimer();
        });
    }

    timerLoop() {
        let startTime = --this.state.startTime;
        let updates = {startTime: startTime};

        if (startTime < 1) {
            if ('guest' === this.state.contest) {
                this.stopTimer();
                this.loadContest();

                return;
            } else if ('waiting' === this.state.contest) {
                updates = {...updates, contest: 'playing', startTime: this.state.duration};
            } else if ('playing' === this.state.contest) {
                this.stopTimer();
                this.refs.input.reset();

                updates = {...updates, contest: 'done'};
            }
        }

        this.setState(...this.state, updates);
        this.refs.input.focus();
    }

    startTimer() {
        this.timer = setInterval(this.timerLoop.bind(this), 1000)
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    componentDidMount() {
        this.loadContest();
    }

    resetState(e) {
        e.preventDefault();
        e.stopPropagation();

        this.setState(START);
        this.loadContest();
    }

    updateProgress(data) {
        let progress = this.state.progress;
        let winner = null;
        let contest = this.state.contest;

        if (data.id === this.state.userId) {
            progress = data.progress;
        }

        let users = this.state.users.slice();
        users.some((user) => {
            if (user.id === data.id) {
                user.progress = data.progress;

                // Won the contest.
                if (user.progress === this.state.words.length) {
                    winner = data.id;
                    contest = 'done';

                    this.stopTimer();
                    this.refs.input.reset();
                }

                return true;
            }
        });

        this.setState({...this.state, users: users, winner: winner, contest: contest, progress: progress});
    }

    wordDone() {
        let data = {id: this.state.userId, progress: ++this.state.progress};
        this.updateProgress(data);
        this.socket.emit('word', data);
    }


    render() {
        let captcha = '';

        // Render timer.
        if ('guest' === this.state.contest) {
            captcha = <Recaptcha sitekey={this.state.captchaKey} render='explicit'
                               onloadCallback={this.captchaLoaded}
                               verifyCallback={this.captchaDone.bind(this)} />
        } else if ('loading' === this.state.contest) {
            captcha = <span>Loading...</span>
        }

        // Return the result.
        return (
            <div>
                <Users users={this.state.users} userId={this.state.userId} words={this.state.words}
                       startTime={this.state.startTime} duration={this.state.duration}/>
                <div className='info-box'>
                    <ProgressText startTime={this.state.startTime} contest={this.state.contest} />
                    <ResultText userId={this.state.userId} winner={this.state.winner}
                                words={this.state.words} contest={this.state.contest}
                                duration={this.state.duration} startTime={this.state.startTime}
                                progress={this.state.progress} playAgain={this.resetState.bind(this)} />
                    {captcha}
                </div>
                <Words words={this.state.words} contest={this.state.contest}
                       progress={this.state.progress} />
                <TextInput ref='input' words={this.state.words} progress={this.state.progress}
                           contest={this.state.contest} wordDone={this.wordDone.bind(this)}/>
            </div>
        )
    }
}

// Render app.
ReactDOM.render(<App/>, document.getElementById('root'));