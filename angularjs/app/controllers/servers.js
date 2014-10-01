(function (){

    var authmodule = angular.module("serverModule", ["ProcessModel"]);

    authmodule.controller("ServersController", function(ServerService, ProcessService, $scope, ProcessInstance){

        var ctrl = this;
        $scope.server_processes = {};
        $scope.ProcessService = ProcessService;
        ServerService.query(function(data){
            $scope.servers = data.results;
        }, function (data) {

        });

        this.start = function(server, proc_data){
            ProcessService.start(server, proc_data, function(data){
                angular.copy(data, proc_data);
            });
        };

        this.stop = function(server, proc_data){
            ProcessService.stop(server, proc_data, function(data){
                angular.copy(data, proc_data);
            });
        };

        this.all_processes = function(server){
            ProcessService.resource.all({serverId: server.id}, function(data){
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