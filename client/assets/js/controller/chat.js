// Chat controller for TypeItQuick app.
angular.module('TypeItQuick').
    controller('ChatCtrl', ['$scope', '$http', '$location', '$window', '$routeParams', 'ioService',
        function($scope, $http, $location, $window, $routeParams, ioService) {
            // UI.
            $scope.processing = false;
            $scope.errorMsg = '';
            $scope.chatMessages = [ { text: 'You can send messages to other players using text box above.' } ];

            // Init contest data.
            function initData(result) {
                // Fetch user.
                $scope.user = result.users[result.user];

                // Set users.
                $scope.users = result.users;

                // Setup socket.
                ioService.setup();

                // Focus input.
                $('input').focus();

                // Message handler.
                ioService.on('msg', function(message) {
                    $scope.$apply(function () {
                        $scope.chatMessages.unshift(message);
                    });
                });

                // Join handler.
                ioService.on('join', function(user) {
                    $scope.$apply(function () {
                        $scope.chatMessages.unshift({ user: user.name, text: 'joined contest' });
                        $scope.users.push(user);
                    });
                });

                // Type handler.
                ioService.on('type', function() {
                    $scope.$apply(function () {
                        $location.path('/t/' + $routeParams.contestId);
                    });
                })
            }

            // Join chat.
            $http.post('/chat', { id: $routeParams.contestId }).success(function(result) {
                // Init contest.
                initData(result);
            }).error(function(result, status) {
                if (status == 401) {
                    $location.path('/j/' + $routeParams.contestId);
                } else if (status == 410) {
                    $location.path('/t/' + $routeParams.contestId);
                } else {
                    $location.path('/');
                }
            });

            // Send chat message.
            $scope.sendMsg = function($event) {
                // Not empty msg and enter key.
                if ($scope.msgInput && $scope.msgInput.trim().length && $event.which === 13) {
                    ioService.emit('msg', { user: $scope.user.name, text: $scope.msgInput.trim() });
                    $scope.msgInput = '';
                }
            };

            // Start typing.
            $scope.start = function() {
                ioService.emit('type', { date: Date.now() });
            };
        }
    ]);