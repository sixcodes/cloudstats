//console.log(json);

// development only
var mongoose = require('mongoose');

var express = require('express')
    , load = require('express-load')
    , http = require('http')
    , path = require('path');
var io = require('socket.io');
var app = express();
var push = require('pushover-notifications');



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("smtp_user", process.env.SMTP_USER);
app.set("smtp_pass", process.env.SMTP_PASS);
app.set("push_user", process.env.PUSHOVER_USER || null);
app.set("push_token", process.env.PUSHOVER_TOKEN || null);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

load('models').then('controllers').then('routes').into(app);
var sendgrid = require("sendgrid")(app.get("smtp_user"), app.get("smtp_pass"));

var Email = sendgrid.Email;
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var server = http.createServer(app);

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
var server_io = io.listen(server);

server_io.sockets.on('status', function (socket) {

});

//app.post('/event', function(req, res){
//    console.log(req.body);
//    res.send("ACK");
//    process_info = {};
//
//
//
//    model_server.findOne({name: req.body.hostname}, function(err, server){
//        if (server){
//            var options = {"url": server.rpc_url, "basic_auth": {"user": server.rpc_user, "pass": server.rpc_pass } };
//            var client = rpc._actionProcess(options, req.body.groupname + ":" + req.body.processname);
//            client._call("getProcessInfo", function(_info){
//                server_io.sockets.emit("status_changed", {
//                    hostname: req.body.hostname,
//                    processname: req.body.processname,
//                    groupname: req.body.groupname,
//                    from_state: req.body.from_state,
//                    to_state: req.body.to_state,
//                    process_info: _info
//                });
//            });
//        }
//    });
//    if (req.body.from_state == "RUNNING" && (req.body.to_state == "STOPPING" || req.body.to_state == "STOPPED" || req.body.to_state == "EXITED" || req.body.to_state == "FATAL")) {
//        sendgrid.send(email,
//        model_server.findOne({name: req.body.hostname}, function(err, server){
//            if (server){
//                var email = new Email({
//                    to:       server.admin_email,
//                    from:     'supervisord@sieve.com.br',
//                    subject:  '[supervisord] ' + req.body.processname + " parou no servidor " + req.body.hostname,
//                    text:     'Verifique em ' + server.rpc_url
//                });
//                email.addCategory("alert_supervisor")
//                function(err, json) {
//                        if (err) {
//                            return console.error(err);
//                        }
//                    return json;
//                    }
//                if (app.get("push_user") != null && app.get("push_token") != null){
//                    var msg = {
//                        message: 'Verifique em ' + server.rpc_url,
//                        title: "Serviço " + req.body.processname + ' parou',
//                        sound: 'magic', // optional
//                        priority: 1 // optional
//                    };
//                    var p = new push( {
//                        user: app.get('push_user'),
//                        token: app.get('push_token'),
//                    });
//                    p.send( msg, function( err, result ) {
//                        if ( err ) {
//                            throw err;
//                        }
//
//                        console.log( result );
//                    });
//                }
//            }
//            else {
//                console.log("Servidor não encontrado");
//            }
//        });
//    }
//});



module.exports = app;
