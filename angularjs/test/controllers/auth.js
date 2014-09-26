"use strict";

describe("Auth Controller", function() {

    beforeEach(function(){
        module("cloudstats");
    });

    var crtl, scope, httpbackend, rootScope, cookieStore;
    beforeEach(inject(function($injector){
        var $controller = $injector.get("$controller");

        rootScope = $injector.get("$rootScope");
        scope = rootScope.$new();
        httpbackend = $injector.get("$httpBackend");
        cookieStore = $injector.get("$cookieStore");

        crtl = $controller("AuthController", {
            $scope: scope,
            $location: $injector.get("$location"),
            TokenService: $injector.get("TokenService"),
            $cookieStore: cookieStore
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
        expect(cookieStore.get("auth_token")).toEqual("abdf364ad");

    });

    it("should deny token for invalid credentials", function(){
        httpbackend.whenPOST("/api-login").respond(400, {token: "abdf364ad"});

        expect(crtl.login_failed).toBeUndefined();
        crtl.login();
        httpbackend.flush();
        expect(crtl.login_failed).toBe(true);
        expect(crtl.token).toBeUndefined();
        expect(cookieStore.get("auth_token")).toBeUndefined();

    });
});