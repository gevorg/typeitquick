// Contest controller for TypeItQuick app.
angular.module('TypeItQuick').
    controller('ContestCtrl', ['$scope', '$http', '$location', '$window', 'contestService', '$routeParams', 'captchaService',
        function($scope, $http, $location, $window, contestService, $routeParams, captchaService) {
            // UI.
            $scope.processing = false;
            $scope.errorMsg = '';
            $scope.messages = [ { text: 'You can send messages to other players using text box above.' } ];
            $scope.state = 'Waiting';

            // Connection socket.
            var socket;

            // Init contest data.
            function initData(result) {
                // Get data.
                var contest = result[0];

                // Fetch user.
                $scope.user = contest.users[result[1]];

                // Extract words.
                $scope.words = contestService.words(contest.words);

                // Set users.
                $scope.users = contest.users;

                // Not join mode.
                $scope.joinMode = false;

                // Setup socket.
                socket = io($window.siteUrl + result[0].id);

                // Message handler.
                socket.on('msg', function(message) {
                    $scope.$apply(function () {
                        $scope.messages.unshift(message);
                    });
                });

                // Join handler.
                socket.on('join', function(user) {
                    $scope.$apply(function () {
                        $scope.messages.unshift({ user: user.name, text: 'joined contest' });
                        $scope.users.push(user);
                    });
                });
            }

            // Join contest.
            $http.post('/contest/join', { id: $routeParams.contestId }).success(function(result) {
                // Init contest.
                initData(result);
            }).error(function(result, status) {
                if (status == 401) {
                    // Load captcha.
                    captchaService.loadCaptcha('g-recaptcha');

                    $scope.joinMode = true;
                } else {
                    $location.path('/');
                }
            });

            // Send chat message.
            $scope.sendMsg = function($event) {
                // Not empty msg and enter key.
                if ($scope.msgInput && $scope.msgInput.trim().length && $event.which === 13) {
                    socket.emit('msg', { user: $scope.user.name, text: $scope.msgInput.trim() });
                    $scope.msgInput = '';
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
                return Math.floor(user.progress * 100 / $scope.words.length) + '%';
            };

            // Join contest.
            $scope.join = function() {
                // Processing starts.
                $scope.processing = true;
                $scope.errorMsg = '';

                // Validation.
                if (!$scope.newUser) {
                    $scope.errorMsg = "You need to provide your name to join contest!";
                } else if (!$('#g-recaptcha-response').val()) {
                    $scope.errorMsg = "Please check the checkmark above!";
                }

                // Ready to start.
                if (!$scope.errorMsg) {
                    $http.put('/contest/join', {
                        id: $routeParams.contestId,
                        user: $scope.newUser,
                        captcha: $('#g-recaptcha-response').val()
                    }).success(function(result) {
                        // Init contest.
                        initData(result);

                        // Processing ends.
                        $scope.processing = false;
                    }).error(function(message) {
                        // Assign error message.
                        $scope.errorMsg = message;

                        // Processing ends.
                        $scope.processing = false;
                    });
                } else {
                    // Processing ends.
                    $scope.processing = false;
                }
            };
        }
    ]);