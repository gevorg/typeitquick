// Captcha service for TypeItQuick app.
angular.module('TypeItQuick')
    .factory('captchaService', ['$window', function($window) {
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