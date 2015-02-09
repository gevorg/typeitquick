// Typing controller for TypeItQuick app.
angular.module('TypeItQuick').
    controller('TypeCtrl', ['$scope', '$http', '$location', '$window', 'contestService', '$routeParams', 'ioService',
        function($scope, $http, $location, $window, contestService, $routeParams, ioService) {
            // Init word.
            $scope.word = '';

            // Done.
            $scope.winner = '';

            // Init contest data.
            function initData(result) {
                // Fetch index.
                $scope.userId = result.user;

                // Fetch user.
                $scope.user = result.users[result.user];

                // Set users.
                $scope.users = result.users;

                // Set winner.
                $scope.winner = result.winner;

                // Extract words.
                $scope.words = contestService.words(result.words);

                // Setup socket.
                ioService.setup();

                // Disable copy paste.
                $('#the-input').bind("cut copy paste",function(e) {
                    e.preventDefault();
                    this.focus();
                });

                // Setup progress handlers.
                ioService.on('word', function(data) {
                    $scope.$apply(function () {
                        // User progress.
                        $scope.users[data.user].progress = data.progress;
                    });
                });

                // Setup done handler.
                ioService.on('done', function(data) {
                    $scope.$apply(function () {
                        $scope.winner = data.winner;
                    });
                });
            }

            // Join typing.
            $http.post('/type', { id: $routeParams.contestId }).success(function(result) {
                // Init contest.
                initData(result);
            }).error(function(result, status) {
                if (status == 401) {
                    $location.path('/j/' + $routeParams.contestId);
                } else {
                    $location.path('/');
                }
            });

            // Word class function.
            $scope.wordClass = function(index) {
                var wordIndex = $scope.user.progress;

                if (index < wordIndex) {
                    return 'word-done';
                } else if (index === wordIndex) {
                    return 'word-now';
                } else {
                    return '';
                }
            };

            // Typing completed.
            $scope.wordsDone = function() {
                return $scope.winner.length;
            };

            // Check word.
            $scope.checkWord = function($event) {
                if ($scope.user && $scope.user.progress !== $scope.words.length &&
                    ($event.which === 13 || $event.which === 32)) {
                    if (contestService.wordDone($scope.user.progress, $scope.words, $scope.word)) {
                        // Clear input.
                        $scope.word = contestService.clearWord($scope.word);

                        // To next input.
                        $scope.user.progress ++;

                        // Word done.
                        ioService.emit('word', { user: $scope.userId, progress: $scope.user.progress });

                        // Done.
                        if ($scope.user.progress === $scope.words.length) {
                            $scope.winner = $scope.user.name;
                            ioService.emit('done', { winner: $scope.user.name } );
                        }
                    }
                }
            };

            // Input class.
            $scope.inputClass = function() {
                // If word is wrong.
                if ($scope.user && $scope.user.progress !== $scope.words.length &&
                    !contestService.checkWord($scope.user.progress, $scope.words, $scope.word)) {
                    return 'wrong-word';
                } else {
                    return '';
                }
            };

            // Progress info.
            $scope.progress = function(user) {
                return Math.floor(user.progress * 100 / $scope.words.length) + '%';
            };
        }
    ]);