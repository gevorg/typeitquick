// Join controller for TypeItQuick app.
angular.module('TypeItQuick').controller(
    'GameCtrl', ['$scope', '$http', '$window', '$timeout', 'captchaService', 'contestService', 'ioService',
    function ($scope, $http, $window, $timeout, captchaService, contestService, ioService) {
        // Set 0 progress.
        $scope.user = { progress: 0 };

        // Set word to empty.
        $scope.word = '';

        // Set empty winner.
        $scope.winner = null;

        // Set joined and started.
        $scope.joined = false;
        $scope.started = false;
        $scope.ended = false;

        // Users.
        $scope.users = [];

        // Setup socket.
        function setupSocket() {
            // Setup IO.
            ioService.setup($scope.id);

            // Setup progress handlers.
            ioService.on('join', function(data) {
                $scope.$apply(function () {
                    $scope.users.push(data);
                });
            });

            // Setup progress handlers.
            ioService.on('word', function(data) {
                $scope.$apply(function () {
                    angular.forEach($scope.users, function(user) {
                        if (user.id == data.user) {
                            user.progress = data.progress;
                        }
                    });
                });
            });

            // Setup done handler.
            ioService.on('done', function(data) {
                $scope.$apply(function () {
                    $scope.winner = data.winner;
                    $scope.ended = true;
                    $scope.word = '';
                });
            });
        }

        // Load contest.
        function loadContest() {
            $http.get("/current").then(function (result) {
                // Contest.
                var contest = JSON.parse(result.data.contest);

                // Extract contest data.
                $scope.id = contest.id;
                $scope.words = contestService.words(contest.text);
                $scope.remaining = result.data.remaining;

                // Extract users.
                $scope.users = contest.users;

                // Socket.
                setupSocket();

                // Start timer.
                function startTimer() {
                    if ($scope.ended) return;

                    $scope.remaining --;
                    if ($scope.remaining < 1) {
                        if (!$scope.joined) {
                            loadContest();
                        } else {
                            if (!$scope.started) {
                                $scope.started = true;
                                $scope.remaining = $scope.duration;

                                // Focus.
                                $timeout(function () {
                                    $('#theInput').focus();
                                }, 10);

                                // Timer again.
                                $timeout(startTimer, 1000);
                            } else {
                                // Finish game.
                                $scope.ended = true;
                                $scope.word = '';
                            }
                        }
                    } else {
                        $timeout(startTimer, 1000);
                    }
                }
                $timeout(startTimer, 1000);
            });
        }
        loadContest();

        // Load captcha.
        captchaService.load('captcha', function(response) {
            $scope.joined = true;
            $http.post("/join", {'captcha': response, 'id': $scope.id}).then(function(response) {
                captchaService.destroy();

                $scope.user.id = response.data.id;
                $scope.duration = response.data.duration;
            });
        });

        // Typing completed.
        $scope.wordsDone = function() {
            return $scope.winner != null;
        };

        // Check word.
        $scope.checkWord = function($event) {
            if ($scope.joined && $scope.user.progress !== $scope.words.length &&
                ($event.which === 13 || $event.which === 32)) {
                if (contestService.wordDone($scope.user.progress, $scope.words, $scope.word)) {
                    // Clear input.
                    $scope.word = contestService.clearWord($scope.word);

                    // To next input.
                    $scope.user.progress ++;

                    // Word done.
                    ioService.emit('word', { user: $scope.user.id, progress: $scope.user.progress });

                    // Done.
                    if ($scope.user.progress === $scope.words.length) {
                        $scope.winner = $scope.user.id;
                        $scope.ended = true;
                        ioService.emit('done', { winner: $scope.user.id } );
                    }
                }
            }
        };

        // Input class.
        $scope.inputClass = function() {
            // If word is wrong.
            if ($scope.joined && $scope.user.progress !== $scope.words.length &&
                !contestService.checkWord($scope.user.progress, $scope.words, $('#theInput').val())) {
                return 'wrong-word';
            } else {
                return '';
            }
        };

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

        // Progress info.
        $scope.progress = function(user) {
            return Math.floor(user.progress * 100 / $scope.words.length);
        };
    }
]);