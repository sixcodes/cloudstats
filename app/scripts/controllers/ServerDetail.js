'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('ServerdetailCtrl', function ($scope, $http, $routeParams) {
      $scope._id = $routeParams.id;
      $http({method: "GET",url:"/server/"+$scope._id+"/process"})
          .success(function (data, status){
                console.log(data);
                $scope.process = data;
          })
          .error(function (data, status){
          });
  });
