(function (){

    var authmodule = angular.module("serverModule", []);

    authmodule.controller("ServersController", function(ServerService, ProcessService, $scope, ProcessInstance, $location){

        var ctrl = this;
        $scope.server_processes = {};
        ServerService.query(function(data){
            $scope.servers = data.results;
        });

        this.get_detail = function(server){
            $location.path("/servers/" + server.id + "/processes");
        };

    });

})();