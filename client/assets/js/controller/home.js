// Home controller for TypeItQuick app.
angular.module('TypeItQuick').
    controller('HomeCtrl', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
        // Add captcha script.
        $('head').append($('<script src="https://www.google.com/recaptcha/api.js?onload=recaptchaLoaded&render=explicit" async defer></script>'));

        // Render captcha.
        $($window).on('recaptchaLoaded', function() {
            grecaptcha.render('g-recaptcha', {
                'sitekey': $window.captchaKey
            });
        });
    }]);