var mongoose = require('mongoose');
var Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;
var db_url = "mongodb://localhost:27017/cloudstats",
    db = mongoose.connect(db_url);
var serverSchema = new Schema({
    id: ObjectId,
    name: String,
    rpc_url: String,
    rpc_user: String,
    rpc_pass: String,
    obs: String
});
var server = db.model('server', serverSchema);
