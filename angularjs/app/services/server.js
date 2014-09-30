(function(){

    var module = angular.module("ServerModule", []);

    module.service("ServerService", ["$resource", function($resource){
        return $resource("/api/servers/:serverId", {serverId: '@serverId'}, {'query':  {method:'GET', isArray:false}});
    }]);


    module.service("ProcessService", ["$resource", function($resource){
        return {
            resource: $resource("/api/servers/:serverId/processes/:procName", {serverId: '@serverId', procName: '@procName'},
            {
                all: {method: 'GET', isArray: true},
                post: {method: 'POST'},
                start: {method: 'POST'},
                stop: {method: 'POST'},
                restart: {method: 'POST'}
            }),

            start: function(server, proc_data, callback){
                this.resource.start({serverId: server.id, procName: proc_data.name.replace("/", "-")}, {action:"start", group:proc_data.group}, callback);
            },

            stop: function(server, proc_data, callback){
                this.resource.stop({serverId: server.id, procName: proc_data.name.replace("/", "-")}, {action:"stop", group:proc_data.group}, callback);
            },

            restart: function(server, proc_data, callback){
                this.resource.restart({serverId: server.id, procName: proc_data.name.replace("/", "-")}, {action:"restart", group:proc_data.group}, callback);
            }




        };
    }]);

})();