
var mongoose = require('mongoose');
var db = require('./database');
var rpc = require('./rpc');
var model_server = mongoose.model('server');
var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path');
var io = require('socket.io');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("smtp_user", process.env.SMTP_USER);
app.set("smtp_pass", process.env.SMTP_PASS);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var sendgrid = require("sendgrid")(app.get("smtp_user"), app.get("smtp_pass"));
var Email = sendgrid.Email;

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/users', user.list);

app.post('/server', function(req, res){
    var newServer = model_server({
        name: req.body.name,
        rpc_url: req.body.rpc_url,
        rpc_user: req.body.rpc_user,
        rpc_pass: req.body.rpc_pass,
        obs: req.body.obs,
        admin_email: req.body.admin_email
    });
    var valid = req.body.name && req.body.rpc_url;
    if (valid){
        newServer.save();
        res.send('Servidor adicionado com sucesso');
    }else {
        res.status(400).send({data: "Nome e URL sao obrigatorios"});
    }
});

app.get('/server', function(req, res){
    model_server.find({}, function(err, server){
        if(server){
            res.send(server);
        }else{
            res.send('Ainda não há servidores cadastrados');
        }
    })
});

app.post('/server/:id/:action', function(req, res){
    model_server.findOne({_id:req.params.id}, function(err, server){
        if(server){
            var processInfo = {};
            var options = {"url": server.rpc_url, "basic_auth": {"user": server.rpc_user, "pass": server.rpc_pass } };
            var client = rpc._actionProcess(options, req.body.process);
            client._call( req.params.action + "Process", function(data){
                client._call("getProcessInfo", function(process_info){
                    processInfo = process_info;

                    if (data && processInfo){
                        console.log("processInfo="+processInfo);
                        res.send({data: "Sucesso", process_info: processInfo});
                    }else{
                        res.status(404).send({data: "Erro alterando status de processo, por favor tente novamente"});
                    }
                });
            });
        }else{
            res.send('Este servidor não existe, por favor verifique.');
        }
    })
});

app.get('/server/:id', function(req, res){
    model_server.findOne({_id:req.params.id}, function(err, server){
        if(server){
            res.send(server);
        }else{
            res.status(404).send({data:'Servidor nao encontrado'});
        }
    })
});

app.get('/server/:id/process', function(req, res){
    model_server.findOne({_id:req.params.id}, function(err, server){
        if(server){
            console.log("server encontrado, acessando xmlrpc");
            options = {"url": server.rpc_url, "basic_auth": {"user": server.rpc_user, "pass": server.rpc_pass } };
            var client = rpc._get_client(options);
            client._call("getAllProcessInfo", function(data){
                if (data){
                    res.send(data);
                }else{
                    res.status(404).send({data: "Erro ao alterar estado do processo"});
                }
            });
        }else{
            res.status(404).send({data:'Servidor nao encontrado'});
        }
    })
});


app.put('/server', function(req, res){
    model_server.findOne({_id: req.body._id}, function(err, server){
        if (server){
            server.name = req.body.name;
            server.rpc_url =  req.body.rpc_url;
            server.rpc_user = req.body.rpc_user;
            server.rpc_pass = req.body.rpc_pass;
            server.obs =  req.body.obs;
            server.admin_email = req.body.admin_email;
            server.save();
            res.send('Server editado com sucesso');
        }else{
            res.send('Servidor não existe');
        }
    })
});

app.delete('/server/:id', function(req, res){
    model_server.findOne({_id: req.params.id}, function(err, server){
        if(server){
            server.remove();
            res.send('Servidor removido com sucesso')
        }else{
            res.send('Servidor não existe')
        }
    })
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var server_io = io.listen(server);
server_io.sockets.on('status', function (socket) {

});

app.post('/event', function(req, res){
    console.log(req.body);
    res.send("ACK");
    server_io.sockets.emit("status_changed", {
        hostname: req.body.hostname,
        process: req.body.processname,
        from_state: req.body.from_state,
        to_state: req.body.to_state
    });
    if (req.body.from_state == "RUNNING" && (req.body.to_state == "STOPPING" || req.body.to_state == "STOPPED" || req.body.to_state == "EXITED")) {
        model_server.findOne({name: req.body.hostname}, function(err, server){
            if (server){
                var email = new Email({
                    to:       server.admin_email,
                    from:     'supervisord@sieve.com.br',
                    subject:  '[supervisord] ' + req.body.processname + " parou no servidor " + req.body.hostname,
                    text:     'Verifique em ' + server.rpc_url
                });
                email.addCategory("alert_supervisor");
                sendgrid.send(email,
                    function(err, json) {
                        if (err) { return console.error(err); }
                        console.log(json);
                    });
            }
            else {
                console.log("Servidor não encontrado");
            }
        });
    }
});
