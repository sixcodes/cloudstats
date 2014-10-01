(function(){

    var module = angular.module("ProcessModule", []);

    module.service("ProcessService", function($resource){
        return {
            resource: $resource("/api/servers/:serverId/processes/:procName", {serverId: '@serverId', procName: '@procName'},
            {
                all: {method: 'GET', isArray: true},
                post: {method: 'POST'},
                start: {method: 'POST'},
                stop: {method: 'POST'},
                restart: {method: 'POST'}
            }),

            start: function(server, proc_data, cb){
                return this.resource.start({serverId: server.id, procName: proc_data.name.replace("/", "-")}, {action:"start", group:proc_data.group}, cb);
            },

            stop: function(server, proc_data, callback){
                return this.resource.stop({serverId: server.id, procName: proc_data.name.replace("/", "-")}, {action:"stop", group:proc_data.group}, callback);
            },

            restart: function(server, proc_data, callback){
                return this.resource.restart({serverId: server.id, procName: proc_data.name.replace("/", "-")}, {action:"restart", group:proc_data.group}, callback);
            }
        };
    });


})();