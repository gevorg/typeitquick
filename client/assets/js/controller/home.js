// Home controller for TypeItQuick app.
angular.module('TypeItQuick').
    controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
        // Init captcha.
        $scope.initCaptcha = function() {
            runCaptcha('home-captcha');
        };
    }]);