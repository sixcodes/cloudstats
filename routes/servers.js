module.exports = function(app){
    var server = app.controllers.servers;

    app.post('/server', server.create);
    app.get('/server', server.getAll);

};
