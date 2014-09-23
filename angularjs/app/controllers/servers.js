(function (){

    var authmodule = angular.module("serverModule", []);

    authmodule.controller("ServersController", ['$http', '$location', '$log', function($http, $location, $log){

        var ctrl = this;
        this.servers = [
            {
                name: "ETL",
                ipaddress: "0.0.0.0"
            },
            {
                name: "Updater",
                ipaddress: "0.0.0.1"
            }
        ];
    }]);

})();