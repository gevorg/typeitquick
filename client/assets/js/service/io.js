// IO service for TypeItQuick app.
angular.module('TypeItQuick')
    .factory('ioService', ['$window', '$routeParams', function($window, $routeParams) {
        // Client socket.
        var socket;

        // Return service object.
        return {
            setup: function() {
                if (!socket) { // If there is no connection.
                    // Setup socket.
                    socket = io($window.siteUrl + $routeParams.contestId);
                }
            },
            on: function(event, handler) {
                // Setup handler.
                socket.on(event, handler);
            },
            emit: function(event, data) {
                // Emit event.
                socket.emit(event, data);
            }
        }
    }]);