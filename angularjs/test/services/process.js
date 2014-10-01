
describe("Process Service", function(){

    var httpbackend, ProcessService;
    var example_proc_data = {
            description: 'Sep 30 02:54 PM',
            exitstatus: -1,
            group: 'verifysetup',
            logfile: '',
            name: 'verifysetup/0',
            now: 1412117279,
            pid: 0,
            spawnerr: '',
            start: 1412099636,
            state: 0,
            statename: 'STOPPED',
            stderr_logfile: '',
            stdout_logfile: '',
            stop: 1412099659
    };
    var server = {
        id: 1
    };

    beforeEach(function(){
        module("cloudstats");
        inject(function($injector){
            httpbackend = $injector.get("$httpBackend");
            ProcessService = $injector.get("ProcessService");
        });

    });


    afterEach(function(){
        httpbackend.verifyNoOutstandingExpectation();
        httpbackend.verifyNoOutstandingRequest();
    });


    it("Should call start with the correct data", function(){
        var data = {
            action: "start",
            group: "verifysetup"
        };


        httpbackend.expectPOST("/api/servers/1/processes/verifysetup-0", data).respond(202, {});
        var resp = ProcessService.start(server, example_proc_data);
        httpbackend.flush();

    });

    it("Should call stop with the correct data", function(){
        var data = {
            action: "stop",
            group: "verifysetup"
        };


        httpbackend.expectPOST("/api/servers/1/processes/verifysetup-0", data).respond(202, {});
        var resp = ProcessService.stop(server, example_proc_data);
        httpbackend.flush();

    });

    it("Should call restart with the correct data", function(){
        var data = {
            action: "restart",
            group: "verifysetup"
        };


        httpbackend.expectPOST("/api/servers/1/processes/verifysetup-0", data).respond(202, {});
        var resp = ProcessService.restart(server, example_proc_data);
        httpbackend.flush();

    });

    it("Should call all() with the correct data", function(){
        httpbackend.expectGET("/api/servers/1/processes").respond(200, []);
        var resp = ProcessService.all(server);
        httpbackend.flush();

    });
});