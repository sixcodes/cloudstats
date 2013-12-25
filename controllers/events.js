module.exports = function(app, server_io){
    var rpc = require('.././rpc');
    var modelServer = app.models.servers;
    var sendgrid = require("sendgrid")(app.get("smtp_user"), app.get("smtp_pass"));
    var Email = sendgrid.Email;

    return EventController = {

       execute: function(req, res){
           res.send("ACK");
           process_info = {};

           modelServer.findOne({name: req.body.hostname}, function(err, server){
               if (server){
                   var options = {"url": server.rpc_url, "basic_auth": {"user": server.rpc_user, "pass": server.rpc_pass } };
                   var client = rpc._actionProcess(options, req.body.groupname + ":" + req.body.processname);
                   client._call("getProcessInfo", function(_info){
                       server_io.sockets.emit("status_changed", {
                           hostname: req.body.hostname,
                           processname: req.body.processname,
                           groupname: req.body.groupname,
                           from_state: req.body.from_state,
                           to_state: req.body.to_state,
                           process_info: _info
                       });
                   });
               }
           });
           if (req.body.from_state == "RUNNING" && (req.body.to_state == "STOPPING" || req.body.to_state == "STOPPED" || req.body.to_state == "EXITED" || req.body.to_state == "FATAL")) {
               sendgrid.send(email, modelServer.findOne({name: req.body.hostname}, function(err, server){
                       if (server){
                           var email = new Email({
                               to:       server.admin_email,
                               from:     'supervisord@cloudstats.com.br',
                               subject:  '[supervisord] ' + req.body.processname + " stopped on server " + req.body.hostname,
                               text:     'Verifique em ' + server.rpc_url
                           });
                           email.addCategory("alert_supervisor");

                           if (app.get("push_user") != null && app.get("push_token") != null){
                               var msg = {
                                   message: 'Look in ' + server.rpc_url,
                                   title: "Service " + req.body.processname + ' stopped',
                                   sound: 'magic', // optional
                                   priority: 1 // optional
                               };
                               var p = new push( {
                                   user: app.get('push_user'),
                                   token: app.get('push_token')
                               });
                               p.send( msg, function( err, result ) {
                                   if ( err ) {
                                       throw err;
                                   }
                                   console.log( result );
                               });
                           }
                       }else{console.log("Server not found!");}
                       }, function(err, json) {
                           if (err) {
                               return console.error(err);
                           }
                           return json;
                       })
               );
           }
       }
    };
};
