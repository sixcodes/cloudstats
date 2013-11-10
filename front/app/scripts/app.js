'use strict';

angular.module('dashSupervisorFrontApp', ["ui.bootstrap"])
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
      .when('/server/add', {
        templateUrl: 'views/serveredit.html',
        controller: 'ServeraddCtrl'
      })
      .when('/server/edit/:id', {
        templateUrl: 'views/serveredit.html',
        controller: 'ServereditCtrl'
      })
      .when('/server/:id/process', {
        templateUrl: 'views/serverdetail.html',
        controller: 'ServerdetailCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
