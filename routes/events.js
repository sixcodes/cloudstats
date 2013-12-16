module.exports = function(app){
    var event = app.controllers.events;

    app.post('/event', event.execute);

};
