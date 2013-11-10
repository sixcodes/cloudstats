var app = require('../app'),
    request = require('supertest')(app);

describe("Testando retorno dos GET", function(){
    it("Retorna JSON com todos dados do banco", function(done){
        request.get('/server').end(function(err, res){
            res.status.should.eql(200);
            done();
        });
    });
});
