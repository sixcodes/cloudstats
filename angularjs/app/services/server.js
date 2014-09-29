(function(){

    var module = angular.module("ServerModule", []);

    module.service("ServerService", ["$resource", function($resource){
        return $resource("/api/servers/:serverId", {serverId: '@serverId'}, {'query':  {method:'GET', isArray:false}});
    }]);


    module.service("ProcessService", ["$resource", function($resource){
        return $resource("/api/servers/:serverId/processes/:procName", {serverId: '@serverId', procName: '@procName'},
            {
                query:  {method: 'GET', isArray:false},
                post:   {method: 'POST'},
                start:   {method: 'POST', params: {action: 'start'}},
                stop:   {method: 'POST', params: {action: 'stop'}},
                restart:   {method: 'POST', params: {action: 'restart'}}
            });
    }]);
})();