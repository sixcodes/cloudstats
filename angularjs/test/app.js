

describe("App", function(){

    var rootScope, sessionInjector, scope;

    beforeEach(function(){
        module("cloudstats");

        inject(function($injector){
            rootScope = $injector.get("$rootScope");
            scope = rootScope.$new();
            sessionInjector = $injector.get("sessionInjector", {$scope: scope, $rootScope: rootScope});
        });
    });

    it("Should add session Token if present", function(){
        rootScope.auth_token = "abc234def";
        var newconfig = sessionInjector.request({headers: {}});
        expect(newconfig.headers).toEqual({Authorization: "Token abc234def"});
    });

});