(function (){

    var app = angular.module("cloudstats", ["authModule", "serverModule", "ngRoute"]);

    app.config(function($routeProvider, $locationProvider){
        $routeProvider
            .when('/', {
              templateUrl: STATIC_URL + 'partials/login.html',
              controller: 'AuthController',
              controllerAs: 'auth'
            })
            .when("/servers", {
              templateUrl: STATIC_URL + 'partials/servers.html',
              controller: 'ServersController',
              controllerAs: 'serverCtrl'
            });

        /* Remove a /#/ das URLs */
        //$locationProvider.html5Mode(true);
    });


})();