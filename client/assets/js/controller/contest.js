// Contest controller for TypeItQuick app.
angular.module('TypeItQuick').
    controller('ContestCtrl', ['$scope', '$http', '$location', '$window', 'contestService', '$routeParams', 'captchaService',
        function($scope, $http, $location, $window, contestService, $routeParams, captchaService) {
            // UI.
            $scope.processing = false;
            $scope.errorMsg = '';

            // Init contest data.
            function initData(result) {
                // Get data.
                $scope.contest = result[0];
                $scope.user = result[1];

                // Extract words.
                $scope.words = contestService.words($scope.contest.words);

                // Set users.
                $scope.users = $scope.contest.users;

                // Not join mode.
                $scope.joinMode = false;
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

            // Word class function.
            $scope.wordClass = function(index) {
                var wordIndex = $scope.users[$scope.user].progress;

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