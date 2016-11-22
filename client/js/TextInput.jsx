'use strict';

import React from 'react';

class TextInput extends React.Component {
    constructor() {
        super();

        this.state = {
            wrongWord: false
        };
    }

    clearWord(target) {
        // Tokenize.
        let tokens = target.value.trim().split(' ');
        if (tokens.length > 1) {
            tokens.splice(0, 1);

            // New string.
            target.value = tokens.join(' ');
        } else {
            // Empty.
            target.value = '';
        }
    }

    checkWord(e) {
        let word = e.target.value;

        // Comparison part.
        let todoWord = this.props.words[this.props.progress];
        todoWord = todoWord.toLowerCase();

        // Typing part.
        word = word.toLowerCase();

        // It is correct!
        if (todoWord.indexOf(word) === 0 || word.indexOf(todoWord + ' ') === 0) {
            this.setState({...this.state, wrongWord: false});

            // Enter or space.
            if (e.which === 13 || e.which === 32) {
                if (todoWord == word || word.indexOf(todoWord) === 0) {
                    // Clear input.
                    this.clearWord(e.target);

                    // Word done.
                    this.props.wordDone();
                }
            }
        } else {
            this.setState({...this.state, wrongWord: true});
        }
    }

    render() {
        let className = 'input-text';
        let disabled = 'playing' !== this.props.contest;

        if (this.state.wrongWord) {
            className += ' wrong-word';
        }

        return (
            <div className='input-box'>
                <input type='text' ref={input => input && input.focus()} className={className} placeholder='Type words here...'
                       onKeyUp={this.checkWord.bind(this)} disabled={disabled}/>
            </div>
        );
    }
}

export default TextInput;