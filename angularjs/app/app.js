(function (){

    var app = angular.module("cloudstats", ["ngRoute", "ngResource", "authModule", "serverModule", "ProcessModule", "TokenModule", "ServerModule", "ngCookies"]);

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

    app.factory('sessionInjector', ['$rootScope', '$cookieStore', function($rootScope, $cookieStore) {
        var sessionInjector = {
            request: function(config) {
                if ($cookieStore.get("auth_token")) {
                    config.headers['Authorization'] = "Token " + $cookieStore.get("auth_token");
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