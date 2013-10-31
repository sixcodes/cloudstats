'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('ServerCtrl', function ($scope, $rootScope, $http) {
    $rootScope.activate("Servidores");

    $http({method: "GET", url:"http://localhost:3000/server"}).
        success(function (data, status){
            $scope.servers = data;
        }

    );


  });
