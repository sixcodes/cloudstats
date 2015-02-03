"use strict";

describe("Server Controller", function() {

    beforeEach(function(){
        module("cloudstats");
    });

    var crtl, scope, httpbackend, rootScope, makeController;
    beforeEach(inject(function($injector){
        var $controller = $injector.get("$controller");

        rootScope = $injector.get("$rootScope");
        scope = rootScope.$new();
        httpbackend = $injector.get("$httpBackend");

        makeController = function(){

        return $controller("ServersController", {
            $scope: scope,
            TokenService: $injector.get("ServerService")
        });
        }
    }));

    afterEach(function(){
        httpbackend.verifyNoOutstandingExpectation();
        httpbackend.verifyNoOutstandingRequest();
    });


    it("should get server infos", function() {
        httpbackend.expectGET("/api/servers").respond({results: [
            {id: 1, name: "s1", ipaddress: "127.0.0.1"},
            {id: 2, name: "s2", ipaddress: "8.8.8.8"}
        ]});

        var controller = makeController();
        httpbackend.flush();
        expect(scope.servers).toBeDefined();
        expect(scope.servers.length).toEqual(2);

    });
});