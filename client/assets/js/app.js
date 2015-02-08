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
});