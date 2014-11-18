(function (){

    var authmodule = angular.module("ProcessesModule", []);

    authmodule.controller("ProcessesController", function(ServerService, ProcessService, $scope, ProcessInstance, $location, $routeParams){

        var ctrl = this;
        $scope.server_processes = {};
        $scope.serverId = $routeParams.id;
        $scope.processes = [];
        ServerService.get({serverId: $scope.serverId}).$promise.then(function(data){
            $scope.server = data;
            ProcessService.all(data).$promise.then(function(data){
                angular.forEach(data, function(item){
                    $scope.processes.push(item);
                });
                console.log($scope.processes);
            });
        });

        console.log($scope.processes);
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

        this.all_processes = function(server){
            ProcessService.all(server).$promise.then(function(data){
                $scope.server_processes[server.id] = {};
                angular.forEach(data, function(item){
                    var proc = ProcessInstance(item);
                    $scope.server_processes[server.id][proc.name] = proc;
                });
            });
        };

        this.is_running = function(statename){
            return (statename === 'RUNNING');
        };

        this.can_interact_with_process = function(process){
            return process.can_interact;
        };
    });

})();