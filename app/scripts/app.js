'use strict';

angular.module('dashSupervisorFrontApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/server', {
        templateUrl: 'views/serverlist.html',
        controller: 'ServerCtrl'
      })
      .when('/server/:id', {
        templateUrl: 'views/server.html',
        controller: 'ServerCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
