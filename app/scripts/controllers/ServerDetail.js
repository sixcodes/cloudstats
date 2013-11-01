'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('ServerdetailCtrl', function ($scope, $http, $routeParams) {
      $scope._id = $routeParams.id;
      $http({method: "GET",url:"/server/"+$scope._id+"/process"})
          .success(function (data, status){
                console.log(data);
                $scope._by_groupname = $scope._divide_by_groupname(data);
                $scope.process = data;
          })
          .error(function (data, status){
          });

      $scope._divide_by_groupname = function(process_list){
        console.log(process_list);
        $scope._by_groupname = {};
        process_list.forEach(function (p){
            if (!$scope._by_groupname[p.group]){
                $scope._by_groupname[p.group] = Array();
            }
            $scope._by_groupname[p.group].push(p);
        });
        console.log($scope._by_groupname);
      };
  });
