module.exports = function(){
    var mongoose = require('mongoose');
    var env_url = {
        "test" : "mongodb://localhost:27017/test_cloudstats",
        "development": "mongodb://localhost:27017/cloudstats"
    };
    var uristring = env_url[ process.env.NODE_ENV || "development" ];
    return mongoose.connect(uristring);
};
