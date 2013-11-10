var app = require('../app'),
    request = require('supertest')(app);


describe("Testando retorno dos parametros GET", function(){

    var modelServer = app.models.servers;
    var serverItem = {
        "name": "testes1",
        "rpc_url": "updater.domain.com.br:9000",
        "rpc_user": "ghost",
        "rpc_pass": "12345",
        "obs": "rá"
    };
    beforeEach(function(done){
        var newServer = modelServer(serverItem);
        newServer.save();
        done();
    });

    afterEach(function(done){
        modelServer.servers.remove();
        done();
    });

    it("Retorna todos os JSON do banco", function(done){
        request.get('/server').end(function(err, res){
            console.log(res.body);
            res.status.should.eql(200);
            assert.equal(res.body[0].name, 'testes1');
            res.body[0].rpc_url.should.equal("updater.domain.com.br:9000");
            assert.equal(res.body[0].rpc_user, 'ghost');
            assert.equal(res.body[0].rpc_pass, '12345');
            assert.equal(res.body[0].obs, 'rá');
            done();
        });
    });
});
