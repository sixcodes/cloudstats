var xmlrpc = require('xmlrpc');


exports._get_client = function(options){
    var rpc_client = xmlrpc.createClient(options);
    return {
        _call: function (method, cb){
            rpc_client.methodCall('supervisor.' + method, [], function(err, value){
                cb(value);
            });

        }
    }
};

exports._actionProcess = function(options, process){
    var rpc_client = xmlrpc.createClient(options);
    return {
        _call: function(method, cb){
            rpc_client.methodCall('supervisor.' + method, [process], function(err, value){
                 cb(value);
            });
        }
    }
};
