"use strict";

describe("Auth Controller", function() {

    beforeEach(function(){
        module("cloudstats");
    });

    var crtl, scope, httpbackend;
    beforeEach(inject(function($injector){
        var $controller = $injector.get("$controller");

        scope = $injector.get("$rootScope").$new();
        httpbackend = $injector.get("$httpBackend");

        crtl = $controller("AuthController", {
            $scope: scope,
            $location: $injector.get("$location"),
            TokenService: $injector.get("TokenService")
        });
    }));

    afterEach(function(){
        httpbackend.verifyNoOutstandingExpectation();
        httpbackend.verifyNoOutstandingRequest();
    });


    it("should get a valid token", function() {
        var data = {username: "teste", password: "secret"};
        httpbackend.whenPOST("/api-login", data).respond({token: "abdf364ad"});

        crtl.username = data["username"];
        crtl.password = data["password"];

        expect(crtl.login_failed).toBeUndefined();
        crtl.login();
        httpbackend.flush();
        expect(crtl.login_failed).toBe(false);
        expect(crtl.token).toBeDefined();

    });

    it("should deny token for invalid credentials", function(){
        httpbackend.whenPOST("/api-login").respond(400, {token: "abdf364ad"});

        expect(crtl.login_failed).toBeUndefined();
        crtl.login();
        httpbackend.flush();
        expect(crtl.login_failed).toBe(true);
        expect(crtl.token).toBeUndefined();

    });
});