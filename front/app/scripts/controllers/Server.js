'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('ServerCtrl', function ($scope, $rootScope, $http, $location, $routeParams, $modal) {
    $rootScope.activate("Servidores");
    $scope._by_id = {};

    $http({method: "GET", url:"/server"}).
        success(function (data, status){
            $scope.servers = data;
            $scope.servers.forEach(function(s){
                $scope._by_id[s._id] = s;
            });
        }
    );

    $scope._remove_from_list = function(list, _id){
        var new_list = [];
        list.forEach(function (server){
            if (server._id != _id){
                new_list.push(server);
            }
        });
        return new_list;
    };

     $scope._modal_ok = function(){
         $scope._modal_result= true;
     };

     $scope._modal_cancel = function(){
         $scope._modal_result= false;
     };

    $scope._delete = function(_id){
       $scope._id = _id;
       var modal = $modal.open({
           templateUrl: "views/modal/delete.html",
           scope: $scope
       });

       modal.result.then(function () {
            $http({method: "DELETE", url:"/server/"+_id}).
                success(function (data, status){
                    $scope.servers = $scope._remove_from_list($scope.servers, _id);
                }
            );
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
       });

    };

    $scope.reset = function (){
      $scope.server = {};
    };

    $scope.save = function(server){
      $http({method: "POST",url:"/server", data: angular.toJson(server)})
          .success(function (data, status){
                $scope.servers.push(server);
          })
          .error(function (data, status){
                $scope.add_status = status;
                $scope.add_data = data;
          });
    };

    $scope.add_here = function (){
       $scope.title = "Create Server";
       var modal = $modal.open({
           templateUrl: "views/serveredit.html",
           scope: $scope
       });
    };

  });
