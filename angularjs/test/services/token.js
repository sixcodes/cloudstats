

describe("Token Service", function(){

    var service, httpBackend;

    beforeEach(function(){
        module("cloudstats");
        inject(function($injector){
            service = $injector.get("TokenService");
            httpBackend = $injector.get("$httpBackend");
        });
    });

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it("get_token() should POST to /api-login/", function(){
        var data = {username: "teste", password: "secret"};
        httpBackend.expectPOST("/api-login", data).respond(200, {});
        service.get_token(data);
        httpBackend.flush();
    });

});