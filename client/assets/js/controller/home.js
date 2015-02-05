// Home controller for TypeItQuick app.
angular.module('TypeItQuick').
    controller('HomeCtrl', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
        console.log('CHAKA!!!');
        // Render captcha.
        $($window).on('recaptchaLoaded', function() {
            console.log('CAPTCHA LOADED!!!');
            console.log(grecaptcha.render);
            grecaptcha.render('g-recaptcha', {
                'sitekey': $window.captchaKey
            });
        });
    }]);