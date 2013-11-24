var app = require('../app'),
    assert = require('assert'),
    request = require('supertest')(app);
var modelServer = app.models.servers;

describe("Test return params GET", function(){

    var serverItem = {
        "_id": '52865e05ae84f66fee000001',
        "name": "testes1",
        "rpc_url": "updater.domain.com.br:9000",
        "rpc_user": "ghost",
        "rpc_pass": "12345",
        "obs": "rá",
        "admin_email": 'admin@cloudstats.com'
    };

    var serverItem2 = {
        "_id": '52865e05ae84f66fee000002',
        "name": "testes2",
        "rpc_url": "updater2.domain.com.br:9000",
        "rpc_user": "ghost",
        "rpc_pass": "12345",
        "obs": "rrá",
        "admin_email": 'admin@cloudstats.com'
    };

    beforeEach(function(done){
        var newServer = modelServer(serverItem);
        newServer.save();
        var newServer2 = modelServer(serverItem2);
        newServer2.save();
        done();
    });

//    afterEach(function(done){
//        modelServer.find({}, function(err, data){
//            data.forEach(function(item){
//                item.remove();
//            })
//        });
//        done();
//    });
        it("Retorna todos os JSON do banco", function(done){
            request.get('/server').end(function(err, res){
                res.status.should.eql(200);
                assert.equal(res.body.length, 2);
                assert.equal(res.body[0].name, 'testes1');
                res.body[0].rpc_url.should.equal("updater.domain.com.br:9000");
                assert.equal(res.body[0].rpc_user, 'ghost');
                assert.equal(res.body[0].rpc_pass, '12345');
                assert.equal(res.body[0].obs, 'rá');
                assert(res.body[0].admin_email, 'admin@cloudstats.com');
                done();
            });
        });

    it("Find server by ID", function(done){
        request.get('/server/52865e05ae84f66fee000001').end(function(err, res){
            assert(res.status, 200);
            assert(res.body._id, '52865e05ae84f66fee000001');
            assert(res.body.name, 'teste1');
            assert(res.body.rpc_url, 'updater.domain.com.br:9000');
            assert(res.body.rpc_user, 'ghost');
            assert(res.body.rpc_pass, '12345');
            assert(res.body.obs, 'rá');
            assert(res.body.admin_email, 'admin@cloudstats.com');
            done();
        });
    });
});

describe("Test POST to create a new server", function(done){
    var serverItem = {
        "name": "testes_new",
        "rpc_url": "updater_new.domain.com.br:9000",
        "rpc_user": "ghost",
        "rpc_pass": "12345",
        "obs": "rá",
        "admin_email": 'admin2@cloudstats.com'
    };
    it("Create new", function(done){
        request.post('/server').send(serverItem).end(function(err, res){
            assert.equal(res.status, 200);
        });
    });

    it("Checking new server", function(done){
        modelServer.findOne({"name":"teste_new"}, function(err, data){
            assert.equal(data.name, "testes_new");
        })
    })
});
