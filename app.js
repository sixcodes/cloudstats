
var mongoose = require('mongoose');
var db = require('./database');
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
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/server', function(req, res){
    console.log(req.body);
    var newServer = model_server({
        name: req.body.name,
        rpc_url: req.body.rpc_url,
        rpc_user: req.body.rpc_user,
        rpc_pass: req.body.rpc_pass,
        obs: req.body.obs
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

app.get('/server/:id', function(req, res){
    model_server.findOne({_id:req.params.id}, function(err, server){
        if(server){
            res.send(server);
        }else{
            res.send('Ainda não há servidores cadastrados');
        }
    })
});

app.put('/server', function(req, res){
    model_server.findOne({_id: req.body._id}, function(err, server){
        if (server){
            model_server.name = req.body.name;
            model_server.rpc_url =  req.body.rpc_url;
            model_server.rpc_user = req.body.rpc_user;
            model_server.rpc_pass = req.body.rpc_pass;
            model_server.obs =  req.body.obs;
            model_server.save();
            res.send('Server editado com sucesso');
        }else{
            res.send('Servidor não existe');
        }
    })
});

app.delete('/server/:id', function(req, res){
    model_server.findOne({_id: req.params.id}, function(err, server){
        if(server){
            model_server.remove();
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
    server_io.sockets.emit("status_changed", {hostname: req.body.hostname,
        process: req.body.processname,
        from_state: req.body.from_state,
        to_state: req.body.to_state
        }
    );
});
