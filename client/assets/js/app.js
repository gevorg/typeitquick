// TypeItQuick module.
angular.module('TypeItQuick', ['ui.bootstrap', 'ngRoute']).config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'StartCtrl',
            templateUrl: 'start'
        })
        .when('/c/:contestId', {
            controller: 'ChatCtrl',
            templateUrl: 'chat'
        })
        .when('/j/:contestId', {
            controller: 'JoinCtrl',
            templateUrl: 'join'
        })
        .when('/t/:contestId', {
            controller: 'TypeCtrl',
            templateUrl: 'type'
        })
        .otherwise({
            redirectTo: '/'
        });
}).factory('captchaService', ['$window', function($window) {
    return {
        destroy: function() {
            angular.element(document.querySelectorAll('.pls-container')).remove();
            grecaptcha.reset();
        },
        load: function(id) {
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