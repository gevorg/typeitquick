// Contest service for TypeItQuick app.
angular.module('TypeItQuick')
    .factory('contestService', [function() {
        // Return service object.
        return {
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