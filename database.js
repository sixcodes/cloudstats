var mongoose = require('mongoose');
var Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost:27017/cloudstats";
db = mongoose.connect(uristring);
var serverSchema = new Schema({
    id: ObjectId,
    name: String,
    rpc_url: String,
    rpc_user: String,
    rpc_pass: String,
    obs: String,
    admin_email: String
});
var server = db.model('server', serverSchema);
