// Home controller for TypeItQuick app.
angular.module('TypeItQuick').
    controller('HomeCtrl', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
        // Render captcha.
        $($window).on('recaptchaLoaded', function() {
            grecaptcha.render('g-recaptcha', {
                'sitekey': $window.captchaKey
            });
        });
    }]);