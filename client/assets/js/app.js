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
});
