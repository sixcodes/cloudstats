var app = require('../app'),
    assert = require('assert'),
    request = require('supertest')(app);
var modelServer = app.models.servers;

before(function(){
    modelServer.find({}, function(err, data){
        data.forEach(function(item){
            item.remove();
        });
    });
});



describe("Test return params GET", function(){

    before(function(done){

        modelServer.find({}, function(err, data){
            data.forEach(function(item){
                item.remove();
            });

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

            var newServer = modelServer(serverItem);
            newServer.save();
            var newServer2 = modelServer(serverItem2);
            newServer2.save();

            done();
        });

    });


    it("Retorna todos os JSON do banco", function(done){
        request.get('/server').end(function(err, res){
            res.status.should.eql(200);
            assert.equal(res.body.length, 2);
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

describe("Test POST to create a new server", function(){
    describe("New server", function(){
        var serverIt = {
            "name": "testes_new",
            "rpc_url": "updater_new.domain.com.br:9000",
            "rpc_user": "ghost",
            "rpc_pass": "12345",
            "obs": "rá",
            "admin_email": 'admin2@cloudstats.com'
        };

        it("Create new", function(){
            request.post('/server').send(serverIt).end(function(err, res){
                assert.equal(res.status, 200);
            });
        });
    });

    describe("Checking create server", function(){
        it("Checking new server", function(){
            modelServer.findOne({"name":"testes_new"}, function(err, data){
                assert.equal(data.name, "testes_new");
                assert.equal(data.rpc_url, "updater_new.domain.com.br:9000");
                assert.equal(data.rpc_user, "ghost");
                assert.equal(data.rpc_pass, "12345");
                assert.equal(data.obs, "rá");
                assert.equal(data.admin_email, "admin2@cloudstats.com");
            });
        });
    });
});

describe("Test update server PUT", function(){

    before(function(){
        var server1 = {
            "_id": '52865e05ae84f66fee000003',
            "name": "server1",
            "rpc_url": "updater1.domain.com.br:9000",
            "rpc_user": "ghost",
            "rpc_pass": "12345",
            "obs": "rrá",
            "admin_email": 'admin@cloudstats.com'
        };

        var newServer = modelServer(server1);
        newServer.save();
    });

    it("Update server1", function(){
        var serverNew = {
            "_id": '52865e05ae84f66fee000003',
            "name": "server123",
            "rpc_url": "updater3.domain.com.br:9000",
            "rpc_user": "ghosts",
            "rpc_pass": "123456",
            "obs": "rá",
            "admin_email": 'admin@cloudstats.com'
        };

        request.put('/server').send(serverNew).end(function(err, res){
            assert.equal(200, res.status);
        });
    });

    it("Looking DB at server if was updated", function(){
        modelServer.findOne({"_id":"52865e05ae84f66fee000003"}, function(err, data){
            assert(data.name, 'serverz123');
            assert(data.rpc_url, 'updater3.domain.com.br:9000');
            assert(data.rpc_user, 'ghosts');
            assert(data.rpc_pass, '123456');
            assert(data.obs, 'rá');
            assert(data.admin_email, 'admin@cloudstats.com');
        });
    });
});

describe("Test delete server DELETE", function(){

    before(function(){
        //creating server
        var server2 = {
            "_id": '52865e05ae84f66fee000004',
            "name": "server1",
            "rpc_url": "updater1.domain.com.br:9000",
            "rpc_user": "ghost",
            "rpc_pass": "12345",
            "obs": "rrá",
            "admin_email": 'admin@cloudstats.com'
        };

        var newServer2 = modelServer(server2);
        newServer2.save();
    });

    it("Looking at the db if exist", function(){
        modelServer.findOne({"_id":"52865e05ae84f66fee000004"}, function(err, data){
            console.log(data);
            assert.equal(data.length, 1);
        });
    });

    it("Delete server2", function(){
        request.del('/server/52865e05ae84f66fee000004').end(function(err, res){
            assert.equal(200, res.status);
        });
    });

    it("Looking at the db", function(){
        modelServer.findOne({"_id":"52865e05ae84f66fee000004"}, function(err, data){
            assert.equal(data.length, 0);
        });
    });
});


//describe("", function(done){
//    it("", function(done){
//
//    })
//});
