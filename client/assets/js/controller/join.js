// Join controller for TypeItQuick app.
angular.module('TypeItQuick').
    controller('JoinCtrl', ['$scope', '$http', '$location', '$window', 'contestService', '$routeParams', 'captchaService',
        function($scope, $http, $location, $window, contestService, $routeParams, captchaService) {
            // UI.
            $scope.processing = false;
            $scope.errorMsg = '';

            // Load captcha.
            captchaService.load('g-recaptcha');

            // Focus input.
            $('input').focus();

            // Join contest.
            $scope.join = function() {
                // Processing starts.
                $scope.processing = true;
                $scope.errorMsg = '';

                // Validation.
                if (!$scope.user) {
                    $scope.errorMsg = "You need to provide your name to join contest!";
                } else if (!$('#g-recaptcha-response').val()) {
                    $scope.errorMsg = "Please check the checkmark above!";
                }

                // Ready to start.
                if (!$scope.errorMsg) {
                    $http.post('/join', {
                        id: $routeParams.contestId,
                        user: $scope.user,
                        captcha: $('#g-recaptcha-response').val()
                    }).success(function() {
                        captchaService.destroy();

                        // To contest page.
                        $location.path('/c/' + $routeParams.contestId);
                    }).error(function(message, status) {
                        if (status == 404) {
                            captchaService.destroy('g-recaptcha');

                            $location.path('/');
                        } else {
                            // Assign error message.
                            $scope.errorMsg = message;

                            // Processing ends.
                            $scope.processing = false;
                        }
                    });
                } else {
                    // Processing ends.
                    $scope.processing = false;
                }
            };
        }
    ]);