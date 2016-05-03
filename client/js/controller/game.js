// Join controller for TypeItQuick app.
angular.module('TypeItQuick').controller(
    'GameCtrl', ['$scope', '$http', '$window', '$timeout', 'captchaService', 'contestService', 'ioService',
    function ($scope, $http, $window, $timeout, captchaService, contestService, ioService) {
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
                    $scope.wordDone(data);
                });
            });
        }

        // Start timer.
        function startTimer() {
            if ($scope.state == 'done') return;

            $scope.startTime --;
            if ($scope.startTime < 1) {
                if ($scope.state == 'guest') {
                    $scope.loadContest();
                } else {
                    if ($scope.state == 'waiting') {
                        $scope.state = 'playing';
                        $scope.startTime = $scope.duration;

                        // Focus.
                        $timeout(function () {
                            $('#theInput').focus();
                        }, 10);

                        // Timer again.
                        $timeout(startTimer, 1000);
                    } else {
                        // Finish game.
                        $scope.state = 'done';
                        $scope.word = '';
                    }
                }
            } else {
                $timeout(startTimer, 1000);
            }
        }

        // Load contest.
        $scope.loadContest = function () {
            // States 'guest', 'playing', 'waiting', 'done'.
            $scope.state = 'guest';

            // Set 0 progress.
            $scope.user = { progress: 0 };

            // Set word to empty.
            $scope.word = '';

            // Set empty winner.
            $scope.winner = null;

            // Users.
            $scope.users = [];

            $http.get("/current").then(function (result) {
                // Contest.
                var contest = JSON.parse(result.data.contest);

                // Extract contest data.
                $scope.id = contest.id;
                $scope.words = contestService.words(contest.words);
                $scope.startTime = result.data.remaining;

                // Extract users.
                $scope.users = contest.users;
                $scope.user.id = result.data.userId;

                // Check if user is playing.
                angular.forEach($scope.users, function(user) {
                    if (user.id == $scope.user.id) {
                        $scope.state = 'waiting';
                    }
                });

                // Socket.
                setupSocket();

                // Start timer.
                $timeout(startTimer, 1000);
            });
        };

        // Word done
        $scope.wordDone = function (data) {
            angular.forEach($scope.users, function(user) {
                if (user.id == data.user) {
                    user.progress = data.progress;

                    // Check for winner.
                    if (user.progress == $scope.words.length) {
                        $scope.winner = user.id;
                        $scope.state = 'done';
                        $scope.word = '';
                    }
                }
            });
        };

        // Get progress text.
        $scope.progressText = function () {
            var text = '';
            var time = $scope.startTime;

            if ($scope.state == 'guest') {
                text = '<strong>Hurry Up!</strong> ';
            }

            if ($scope.state == 'waiting' || $scope.state == 'guest') {
                text += 'Contest starts ' + (time > 1 ? "from " + time + " seconds" : "now") + "!";
            } else if ($scope.state == 'playing') {
                text = 'Contest ends ' + (time > 1 ? "in " + time + " seconds" : "now") + '!';
            }
            
            return text;
        };

        // Result text.
        $scope.resultsText = function () {
            var text = '';

            if ($scope.state == 'done') {
                var wpm = $scope.wpm($scope.user);
                var words = wpm == 1 ? 'word' : 'words';

                if ($scope.user.id != $scope.winner) {
                    text = 'Your result is <b>' + wpm + '</b> ' + words + ' per minute';
                } else {
                    text = 'You are <b>the winner</b> with <b>' + wpm + '</b> ' + words + ' per minute';
                }

                text += ", <a href='/'>play again!</a>";
            }

            return text;
        };

        // Check word.
        $scope.checkWord = function($event) {
            if ($scope.state == 'playing' && ($event.which === 13 || $event.which === 32)) {
                if (contestService.wordDone($scope.user.progress, $scope.word)) {
                    // Clear input.
                    $scope.word = contestService.clearWord($scope.word);

                    // To next input.
                    $scope.user.progress ++;

                    // Event data.
                    var data = {user: $scope.user.id, progress: $scope.user.progress};

                    // Word done.
                    $scope.wordDone(data);

                    // Word done.
                    ioService.emit('word', data);
                }
            }
        };

        // Input class.
        $scope.inputClass = function() {
            // If word is wrong.
            if ($scope.state == 'playing' && !contestService.checkWord($scope.user.progress, $('#theInput').val())) {
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

        // Get player.
        $scope.getPlayer = function (u) {
            return u.id == $scope.user.id ? 'you' : 'guest';
        };

        // Words per minute.
        $scope.wpm = function (u) {
            var time = $scope.duration - $scope.startTime;
            return contestService.wpm(u.progress, time);
        };

        // Load contest.
        $scope.loadContest();

        // Load captcha.
        captchaService.load('captcha', function (response) {
            $scope.state = 'waiting';

            $http.post("/join", {'captcha': response, 'id': $scope.id}).then(function (response) {
                captchaService.destroy();

                $scope.user.id = response.data.id;
                $scope.duration = response.data.duration;
            });
        });
    }
]);