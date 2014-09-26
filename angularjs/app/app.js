(function (){

    var app = angular.module("cloudstats", ["ngRoute", "ngResource", "authModule", "serverModule", "TokenModule", "ServerModule"]);

    app.config(function($routeProvider){
        $routeProvider
            .when('/', {
              templateUrl: '/static/collect/partials/login.html',
              controller: 'AuthController',
              controllerAs: 'auth'
            })
            .when("/servers", {
              templateUrl: '/static/collect/partials/servers.html',
              controller: 'ServersController',
              controllerAs: 'serverCtrl'
            });
    });

    app.factory('sessionInjector', ['$rootScope', function($rootScope) {
        var sessionInjector = {
            request: function(config) {
                if ($rootScope.auth_token) {
                    config.headers['Authorization'] = "Token " + $rootScope.auth_token;
                }
                return config;
            }
        };
        return sessionInjector;
    }]);

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('sessionInjector');
    }]);

})();