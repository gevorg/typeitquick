// Start controller for TypeItQuick app.
angular.module('TypeItQuick').
    controller('StartCtrl', ['$scope', '$http', '$location', '$window', 'contestService', 'captchaService',
        function($scope, $http, $location, $window, contestService, captchaService) {
            // Init.
            $scope.words = '';
            $scope.user = '';
            $scope.processing = false;
            $scope.errorMsg = '';

            // Load captcha.
            captchaService.load('g-recaptcha');

            // Start contest.
            $scope.start = function() {
                // Processing starts.
                $scope.processing = true;
                $scope.errorMsg = '';

                // Validation.
                if (contestService.words($scope.words).length < 10) {
                    $scope.errorMsg = "Contest text should have at least 10 words!";
                } else if (!$scope.user) {
                    $scope.errorMsg = "You need to provide your name to start contest!";
                } else if (!$('#g-recaptcha-response').val()) {
                    $scope.errorMsg = "Please check the checkmark above!";
                }

                // Ready to start.
                if (!$scope.errorMsg) {
                    $http.post('/start', {
                        words: $scope.words,
                        user: $scope.user,
                        captcha: $('#g-recaptcha-response').val()
                    }).success(function(contestId) {
                        captchaService.destroy();

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