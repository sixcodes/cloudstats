module.exports = function(app){
    var Schema = require('mongoose').Schema
        ,ObjectId = Schema.ObjectId;
    var db = require('../middleware/db_connect')();


    var modelServer = new Schema({
        id: ObjectId,
        name: String,
        rpc_url: {type: String, required: true},
        rpc_user: String,
        rpc_pass: String,
        obs: String,
        admin_email: String
    });
    return db.model('servers', modelServer)
};
