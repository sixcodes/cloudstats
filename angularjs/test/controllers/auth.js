"use strict";

describe("Auth Controller", function() {

    beforeEach(function(){
        module("cloudstats");
    });

    var crtl, scope, httpbackend, rootScope, cookieStore, create_controller, location;
    beforeEach(inject(function($injector){
        var $controller = $injector.get("$controller");

        rootScope = $injector.get("$rootScope");
        scope = rootScope.$new();
        httpbackend = $injector.get("$httpBackend");
        cookieStore = $injector.get("$cookieStore");
        location = $injector.get("$location");

        create_controller = function (){
            return $controller("AuthController", {
                $scope: scope,
                $location: $injector.get("$location"),
                TokenService: $injector.get("TokenService"),
                $cookieStore: cookieStore
            });
        }

    }));

    afterEach(function(){
        httpbackend.verifyNoOutstandingExpectation();
        httpbackend.verifyNoOutstandingRequest();
    });


    it("should get a valid token", function() {
        httpbackend.whenGET("/token").respond({token: "abdf364ad"});

        crtl = create_controller();
        httpbackend.flush();
        expect(cookieStore.get("auth_token")).toEqual("abdf364ad");
        expect(location.path()).toEqual("/servers");

    });

    it("should deny token for invalid credentials", function(){
        httpbackend.whenGET("/token").respond(400, {});

        crtl = create_controller();
        httpbackend.flush();
        expect(crtl.token).toBeUndefined();
        expect(cookieStore.get("auth_token")).toBeUndefined();
        expect(location.path()).toEqual("/");

    });
});