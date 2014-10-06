(function(){

    var module = angular.module("ProcessModule", []);

    module.service("ProcessService", function($resource){
        return {

            _process_name: function(original_name){
                return original_name.replace("/", "-");
            },

            resource: $resource("/api/servers/:serverId/processes/:procName", {serverId: '@serverId', procName: '@procName'},
            {
                all: {method: 'GET', isArray: true},
                post: {method: 'POST'},
                start: {method: 'POST'},
                stop: {method: 'POST'},
                restart: {method: 'POST'}
            }),

            start: function(server, proc_data, cb){
                return this.resource.start({serverId: server.id, procName: this._process_name(proc_data.name)}, {action:"start", group:proc_data.group}, cb);
            },

            stop: function(server, proc_data, callback){
                return this.resource.stop({serverId: server.id, procName: this._process_name(proc_data.name)}, {action:"stop", group:proc_data.group}, callback);
            },

            restart: function(server, proc_data, callback){
                return this.resource.restart({serverId: server.id, procName: this._process_name(proc_data.name)}, {action:"restart", group:proc_data.group}, callback);
            },

            all: function(server){
                return this.resource.all({serverId: server.id});
            }
        };
    });

    module.factory("ProcessInstance", function(){
        return function(process_data){
                return {
                    _data: process_data,
                    name: process_data.name,
                    group: process_data.group,
                    description: process_data.description,
                    statename : process_data.statename
                };
        };
    });

})();