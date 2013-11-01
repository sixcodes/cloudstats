'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('ServereditCtrl', function ($scope, $rootScope, $routeParams, $http) {
    $rootScope.activate("Servidores");
    $scope.title = "Edit Server";

    $scope._id = $routeParams.id;
    $http({method: "GET",url:"/server/"+$scope._id})
              .success(function (data, status){
                    console.log(data);
                    $scope.server = data;
              })
              .error(function (data, status){
                    console.log(data);
              });

    $scope.reset = function (){
      $scope.server = {};
    };

    $scope.save = function(server){
      console.log("save()");
      server._id = $scope._id;
      $http({method: "PUT",url:"/server", data: angular.toJson(server)})
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

