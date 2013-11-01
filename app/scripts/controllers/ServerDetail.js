'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('ServerdetailCtrl', function ($scope, $http, $routeParams, $rootScope, Socket) {
      $rootScope.activate("Servidores");

      $scope.alerts = [];
      $scope.alert_type = "success";
      $scope._id = $routeParams.id;
      $scope._open_state = {};
      $scope._process_count_by_group = {};


      $scope._count_procs = function(list){
          var _counts = {RUNNING:0, STOPPED:0};
          list.forEach(function(obj){
              if (obj.statename == "RUNNING"){
                  _counts["RUNNING"]++;
              }else if (obj.statename == "STOPPED"){
                  _counts["STOPPED"]++;
              }
          });
          return _counts;
      };

      $scope._update_process_counts = function(_by_groupname){
        var _p_counts = {};
        for (var k in _by_groupname){
          _p_counts[k] = $scope._count_procs(_by_groupname[k]);
        }
        return _p_counts;
      };

      $scope._refresh = function (){
          var future = $http({method: "GET",url:"/server/"+$scope._id+"/process"})
              .success(function (data, status){
                    $scope._by_groupname = $scope._divide_by_groupname(data);
                    $scope._process_count_by_group = $scope._update_process_counts($scope._by_groupname);
                    $scope.process = data;
              })
              .error(function (data, status){
                  $scope.alerts.push(data['data']);
                  $scope.alert_type = "error";
              });
      };

      $scope._refresh();
      Socket.on("status_changed", function(data){
          console.log(data);
          var procname = data["groupname"] + ":" + data["processname"];
          var new_info = data["process_info"];
          $scope._update_internal("", procname, new_info);
          $scope.alerts.push("Mudança de estado:" + procname + " :" + data["to_state"]);
      });

      $scope._divide_by_groupname = function(process_list){
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

      $scope._update_internal = function (action, procname, new_info){
          var groupname = procname.split(":")[0];
          var name = procname.split(":")[1];
          for (var key in $scope._by_groupname){
            if (key == groupname){
                $scope._by_groupname[groupname].forEach(function (obj, index){
                    if (obj.name == name){
                        $scope._by_groupname[groupname][index] = new_info;
                    }
                });
                $scope._process_count_by_group = $scope._update_process_counts($scope._by_groupname);
            }
          }
      };

      $scope._action_on_process = function(action, procname){
            $scope.closeAlert();
            $http({method: "POST",url:"/server/"+$scope._id+"/"+action, data: {process:procname}})
                .success(function (data, status){
                    var new_info = data["process_info"];
                    $scope.alerts.push(data['data'] + " " + procname);
                    $scope.action_running = false;
                    $scope.alert_type = "success";
                    $scope._update_internal(action, procname, new_info);
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

    $scope.closeAlert = function() {
        $scope.alerts = [];
    };

  });
