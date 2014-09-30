(function (){

    var app = angular.module("cloudstats", ["ngRoute", "ngResource", "authModule", "serverModule", "TokenModule", "ServerModule", "ngCookies"]);

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

    app.factory("ProcessFactory", function(){
        return function(process_data){
                return {
                    _data: process_data,
                    running: function(){
                        return this._data.statename === 'RUNNING';
                    },

                    name: process_data.name,
                    group: process_data.group,
                    description: process_data.description,
                    statename : process_data.statename
                };
        };
    });

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('sessionInjector');
    }]);

})();