(function (){

    var authmodule = angular.module("serverModule", []);

    authmodule.controller("ServersController", ['ServerService', 'ProcessService', '$scope', 'ProcessFactory', function(ServerService, ProcessService, $scope, ProcessFactory){

        var ctrl = this;
        $scope.server_processes = {};
        $scope.ProcessService = ProcessService;
        ServerService.query(function(data){
            $scope.servers = data.results;
        }, function (data) {

        });

        this.start = function(server, proc_data){
            ProcessService.start(server, proc_data, function(data){
                _.extend(proc_data, data);
            });
        };

        this.stop = function(server, proc_data){
            ProcessService.stop(server, proc_data, function(data){
                _.extend(proc_data, data);
            });
        };

        this.all_processes = function(server){
            ProcessService.resource.all({serverId: server.id}, function(data){
                $scope.server_processes[server.id] = {};
                for (var proc_idx in data){
                    var proc = ProcessFactory(data[proc_idx]);
                    $scope.server_processes[server.id][proc.name] = proc;
                }
            });
        };

        this.is_running = function(statename){
            return (statename === 'RUNNING');
        };

    }]);

})();