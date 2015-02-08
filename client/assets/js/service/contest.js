// Contest service for TypeItQuick app.
angular.module('TypeItQuick')
    .factory('contestService', [function() {
        // Return service object.
        return {
            // Word done.
            wordDone: function(progress, words, word) {
                // Comparison part.
                var todoWord = words[progress];
                todoWord = todoWord.toLowerCase();

                // Typing part.
                word = word.trim().toLowerCase();

                // Is it correct!
                return todoWord == word;
            },
            // Checking word.
            checkWord: function(progress, words, word) {
                // Comparison part.
                var todoWord = words[progress];
                todoWord = todoWord.toLowerCase();

                // Typing part.
                word = word.trim().toLowerCase();

                // Is it correct!
                return todoWord.indexOf(word) === 0;
            },
            // Extracting words from text.
            'words': function(text) {
                // Prepare word array.
                var words = text.trim().replace(/\t/g, ' ').replace(/\n/g, ' ').split(' ');
                var result = [];

                // Filter empty words.
                angular.forEach(words, function(word) {
                    // Skipping bad words.
                    if (word.trim().length) {
                        result.push(word);
                    }
                });

                // Return words.
                return result;
            }
        }
    }]);