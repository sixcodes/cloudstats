

describe("App", function(){

    var rootScope, sessionInjector, scope, cookieStore;

    beforeEach(function(){
        module("cloudstats");

        inject(function($injector){
            rootScope = $injector.get("$rootScope");
            cookieStore = $injector.get("$cookieStore");
            scope = rootScope.$new();
            sessionInjector = $injector.get("sessionInjector", {$scope: scope, $cookieStore: cookieStore});
        });
    });

    it("Should add session Token if present", function(){
        cookieStore.put("auth_token","abc234def");
        var newconfig = sessionInjector.request({headers: {}});
        expect(newconfig.headers).toEqual({Authorization: "Token abc234def"});
    });

});