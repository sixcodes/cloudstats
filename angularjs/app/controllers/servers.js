(function (){

    var authmodule = angular.module("serverModule", []);

    authmodule.controller("ServersController", ['ServerService', 'ProcessService', '$scope', function(ServerService, ProcessService, $scope){

        var ctrl = this;
        ServerService.query(function(data){
            $scope.servers = data.results;
        }, function (data) {

        });


        this.process = function(server){
            console.log(server);
            console.log(ProcessService);
            ProcessService.post({serverId: server.id, processName: "etl0/1"});
        }

    }]);

})();