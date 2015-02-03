(function(){

    var module = angular.module("ServerModule", []);

    module.service("ServerService", function($resource){
        return $resource("/api/servers/:serverId", {serverId: '@serverId'},
            {
                'query':  {method:'GET', isArray:false},
                'get':  {method:'GET', isArray:false}
            }
        );
    });

})();