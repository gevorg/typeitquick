// Home controller for TypeItQuick app.
angular.module('TypeItQuick').
    controller('HomeCtrl', ['$scope', '$http', '$location', '$window', 'contestService',
        function($scope, $http, $location, $window, contestService) {
            // Init.
            $scope.words = '';
            $scope.user = '';
            $scope.processing = false;
            $scope.errorMsg = '';

            // Add captcha script.
            $('head').append($('<script src="https://www.google.com/recaptcha/api.js?onload=recaptchaLoaded&render=explicit" async defer></script>'));

            // Render captcha.
            $($window).on('recaptchaLoaded', function() {
                grecaptcha.render('g-recaptcha', {
                    'sitekey': $window.captchaKey
                });
            });

            // Start contest.
            $scope.start = function() {
                // Processing starts.
                $scope.processing = true;
                $scope.errorMsg = '';

                // Validation.
                if (contestService.words($scope.words).length < 3) {
                    $scope.errorMsg = "Contest text should have at least 3 words!";
                } else if (!$scope.user) {
                    $scope.errorMsg = "You need to provide your name to start contest!";
                } else if (!$('#g-recaptcha-response').val()) {
                    $scope.errorMsg = "Please check the checkmark above!";
                }

                // Ready to start.
                if (!$scope.errorMsg) {
                    $http.post('/contest/start', {
                        words: $scope.words,
                        user: $scope.user,
                        captcha: $('#g-recaptcha-response').val()
                    }).success(function(contestId) {
                        // Go to contest.
                        $location.path('/c/' + contestId);

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