module.exports = function(app){
    var server = app.controllers.servers;

    app.get('/server', server.getAll);
    app.get('/server/:id', server.getById);
    app.get('/server/:id/process', server.getProcessById);
    app.post('/server', server.create);
    app.post('/server/:id/:action', server.executeAction);
    app.put('/server', server.update);
    app.delete('/server/:id', server.delete);

};
