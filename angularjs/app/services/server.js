(function(){

    var module = angular.module("ServerModule", []);

    module.service("ServerService", ["$resource", function($resource){
        return $resource("/api/servers/:serverId", {serverId: '@serverId'}, {'query':  {method:'GET', isArray:false}});
    }]);


    module.service("ProcessService", ["$resource", function($resource){
        return $resource("/api/servers/:serverId/process", {serverId: '@serverId'},
            {
                query:  {method:'GET', isArray:false},
                post:   {method: 'POST'}
            });
    }]);
})();