// Typing controller for TypeItQuick app.
angular.module('TypeItQuick').
    controller('TypeCtrl', ['$scope', '$http', '$location', '$window', 'contestService', '$routeParams',
        function($scope, $http, $location, $window, contestService, $routeParams) {
            // Init contest data.
            function initData(result) {
                // Fetch user.
                $scope.user = result.users[result.user];

                // Set users.
                $scope.users = result.users;

                // Extract words.
                $scope.words = contestService.words(result.words);
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

            // Progress info.
            $scope.progress = function(user) {
                return Math.floor(user.progress * 100 / $scope.words.length) + '%';
            };
        }
    ]);