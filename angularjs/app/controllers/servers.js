(function (){

    var authmodule = angular.module("serverModule", []);

    authmodule.controller("ServersController", ['ServerService', '$scope', function(ServerService, $scope){

        var ctrl = this;
        ServerService.query(function(data){
            $scope.servers = data.results;
        }, function (data) {

        });



    }]);

})();