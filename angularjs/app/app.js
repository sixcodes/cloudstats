(function (){

    var app = angular.module("cloudstats", ["ngRoute", "ngResource", "authModule", "serverModule", "TokenModule"]);

    app.config(function($routeProvider, $locationProvider){
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


})();