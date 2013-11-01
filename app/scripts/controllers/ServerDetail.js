'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('ServerdetailCtrl', function ($scope, $http, $routeParams, $rootScope) {
      $rootScope.activate("Servidores");

      $scope.alerts = [];
      $scope._id = $routeParams.id;
      $scope._open_state = {};

      $scope._refresh = function (){
          var future = $http({method: "GET",url:"/server/"+$scope._id+"/process"})
              .success(function (data, status){
                    $scope._by_groupname = $scope._divide_by_groupname(data);
                    $scope.process = data;
              })
              .error(function (data, status){
                  $scope.alerts.push(data['data']);
              });
      };

      $scope._refresh();

      $scope._divide_by_groupname = function(process_list){
        console.log(process_list);
        var _by_groupname = {};
        process_list.forEach(function (p){
            $scope._open_state[p.group] = false;
            if (!_by_groupname[p.group]){
                _by_groupname[p.group] = Array();
            }
            _by_groupname[p.group].push(p);
        });
        return _by_groupname;
      };

      $scope._update_internal = function (action, procname){
          var groupname = procname.split(":")[0];
          var name = procname.split(":")[1];
          console.log(groupname);
          console.log($scope._by_groupname);
          for (var key in $scope._by_groupname){
            if (key == groupname){
                console.log($scope._by_groupname[groupname]);
                $scope._by_groupname[groupname].forEach(function (o){
                    if (o.name == name){
                        if (action == "stop"){
                            o.statename = "STOPPED";
                        }else{
                            o.statename = "RUNNING";
                        }
                    }
                });
            }
          }
      };

      $scope._action_on_process = function(action, procname){
            console.log(action+" Process: "+procname);
            $http({method: "POST",url:"/server/"+$scope._id+"/"+action, data: {process:procname}})
                .success(function (data, status){
                    $scope.alerts.push(data['data'] + " " + procname);
                    $scope.action_running = false;
                    $scope._update_internal(action, procname);
                })
                .error(function (data, status){
                    $scope.alerts.push(data['data'] + " " + procname);
                    $scope.action_running = false;
                });
      };

      $scope._stop = function(procname){
          $scope.action_running = true;
          $scope._action_on_process("stop", procname);
      };

      $scope._start = function(procname){
          $scope.action_running = true;
          $scope._action_on_process("start", procname);
      };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

  });
