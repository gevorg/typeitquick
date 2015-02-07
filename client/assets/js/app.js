// TypeItQuick module.
angular.module('TypeItQuick', ['ui.bootstrap', 'ngRoute']).config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeCtrl',
            templateUrl: 'home'
        })
        .when('/c/:contestId', {
            controller: 'ContestCtrl',
            templateUrl: 'contest'
        })
        .otherwise({
            redirectTo: '/'
        });
}).factory('captchaService', ['$window', function($window) {
    return {
        loadCaptcha: function(id) {
            // Add captcha script.
            $('head').append($('<script src="https://www.google.com/recaptcha/api.js?onload=recaptchaLoaded&render=explicit" async defer></script>'));

            // Render captcha.
            $($window).one('recaptchaLoaded', function() {
                grecaptcha.render(id, {
                    'sitekey': $window.captchaKey
                });
            });
        }
    }
}]);