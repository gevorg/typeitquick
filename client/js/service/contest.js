// Contest service for TypeItQuick app.
angular.module('TypeItQuick')
    .factory('contestService', [function() {
        // Words of contents.
        var words = [];

        // Return service object.
        return {
            // Word done.
            wordDone: function(progress, word) {
                // Comparison part.
                var todoWord = words[progress];
                todoWord = todoWord.toLowerCase();

                // Typing part.
                word = word.trim().toLowerCase();

                // Is it correct!
                return todoWord == word || word.indexOf(todoWord) === 0;
            },

            // Checking word.
            checkWord: function(progress, word) {
                // Comparison part.
                var todoWord = words[progress];
                todoWord = todoWord.toLowerCase();

                // Typing part.
                word = word.toLowerCase();

                // Is it correct!
                return todoWord.indexOf(word) === 0 || word.indexOf(todoWord + ' ') === 0;
            },

            // Clear word.
            clearWord: function(input) {
                // Tokenize.
                var tokens = input.trim().split(' ');

                if ( tokens.length > 1 ) {
                    tokens.splice(0, 1);

                    // New string.
                    return tokens.join(' ');
                } else {
                    return '';
                }
            },

            // Set words.
            words: function(input) {
                if (input) {
                    words = input;
                }

                return words;
            },

            // WPM calculation.
            wpm: function (progress, time) {
                var textLength = 0;

                for (var i = 0; i < progress; ++i) {
                    textLength += words[i].length + 1;
                }

                return parseInt(textLength * 60 / 5 / time) || 0;
            }
        }
    }]);