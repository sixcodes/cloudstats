(function (){

    var authmodule = angular.module("ProcessesModule", []);

    authmodule.controller("ProcessesController", function(ServerService, ProcessService, $scope, ProcessInstance, $location, $routeParams){

        var ctrl = this;
        this.show_hide = {};
        $scope.server_processes = {};
        $scope.serverId = $routeParams.id;
        $scope.processes = {};
        ServerService.get({serverId: $scope.serverId}).$promise.then(function(data){
            $scope.server = data;
            ProcessService.all(data).$promise.then(function(data){
                $scope.processes = data;
            });
        });

        this.start = function(server, process){
            ProcessService.start(server, process, function(data){
                angular.copy(data, process);
            });
        };

        this.stop = function(server, process){
            ProcessService.stop(server, process, function(data){
                angular.copy(data, process);
            });
        };

        this.is_running = function(process){
            return (process['statename'] === 'RUNNING');
        };

        this.can_interact_with_process = function(process){
            return process.can_interact;
        };

        this.toggle_showprocess = function(group){
            ctrl.show_hide[group] = !ctrl.show_hide[group];
        };

        this.should_show = function(group){
            return ctrl.show_hide[group] === true;
        }

    });

})();