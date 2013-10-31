
var mongoose = require('mongoose');
var db = require('./database');
var server = mongoose.model('server');
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');



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
    var newServer = server({
        name: req.body.name,
        rpc_url: req.body.rpc_url,
        rpc_user: req.body.rpc_user,
        rpc_pass: req.body.rpc_pass,
        obs: req.body.obs
    });
    newServer.save();
    res.send('Servidor adicionado com sucesso');
});

app.get('/server', function(req, res){
    server.find({}, function(err, server){
        if(server){
            res.send(server);
        }else{
            res.send('Ainda não há servidores cadastrados');
        }
    })
});

app.get('/server/:id', function(req, res){
    server.findOne({_id:req.params.id}, function(err, server){
        if(server){
            res.send(server);
        }else{
            res.send('Ainda não há servidores cadastrados');
        }
    })
});

app.put('/server', function(req, res){
    server.findOne({_id: req.body._id}, function(err, server){
        if (server){
            server.name = req.body.name;
            server.rpc_url =  req.body.rpc_url;
            server.rpc_user = req.body.rpc_user;
            server.rpc_pass = req.body.rpc_pass;
            server.obs =  req.body.obs;
            server.save();
            res.send('Server editado com sucesso');
        }else{
            res.send('Servidor não existe');
        }
    })
});

app.delete('/server/:id', function(req, res){
    server.findOne({_id: req.params.id}, function(err, server){
        if(server){
            server.remove();
            res.send('Servidor removido com sucesso')
        }else{
            res.send('Servidor não existe')
        }
    })
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
