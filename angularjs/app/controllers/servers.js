(function (){

    var authmodule = angular.module("serverModule", []);

    authmodule.controller("ServersController", function(ServerService, ProcessService, $scope, ProcessInstance){

        var ctrl = this;
        $scope.server_processes = {};
        ServerService.query(function(data){
            $scope.servers = data.results;
            angular.forEach($scope.servers, function(server){
                ctrl.all_processes(server);
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
    });

})();