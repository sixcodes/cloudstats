
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
module.exports = server_io;
module.exports = app;
