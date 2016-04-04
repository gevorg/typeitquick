// IO service for TypeItQuick app.
angular.module('TypeItQuick')
    .factory('ioService', ['$window', function($window) {
        // Client socket.
        var socket;

        // Return service object.
        return {
            setup: function(id) {
                // Setup socket.
                socket = io($window.siteUrl + id);
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