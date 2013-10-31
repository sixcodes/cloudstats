'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('ServeraddCtrl', function ($scope, $rootScope, $http) {
      $rootScope.activate("Servidores");
      $scope.title = "Addind a new Server";
      $scope.server_added = {};

      $scope.reset = function (){
          $scope.server = {};
      };

      $scope.save = function(server){
          console.log(server);
          $scope.server_added = $http({method: "POST",
                                            url:"http://localhost:3000/server",
                                            data: angular.toJson(server)}
          );
      }
  });
