'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('ServeraddCtrl', function ($scope, $rootScope, $http) {
      $rootScope.activate("Servidores");
      $scope.title = "Create Server";

      $scope.reset = function (){
          $scope.server = {};
      };

      $scope.save = function(server){
          $http({method: "POST",url:"http://localhost:3000/server", data: angular.toJson(server)})
              .success(function (data, status){
                    $scope.add_status = status;
                    $scope.add_data = data;
              })
              .error(function (data, status){
                    $scope.add_status = status;
                    $scope.add_data = data;
              });
      };
  });
