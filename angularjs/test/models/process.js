describe("Process Model", function(){


    var ProcessInstanceFactory;

    beforeEach(function() {
        module('ProcessModel');
        inject(function($injector){
            ProcessInstanceFactory = $injector.get("ProcessInstance");
        });
    });

    it("Should build an object from a dict response", function(){
        var data = {
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

        var process = ProcessInstanceFactory(data);
        expect(process.name).toBe('verifysetup/0');
        expect(process.group).toBe('verifysetup');
        expect(process.statename).toBe('STOPPED');
        expect(process.description).toBe('Sep 30 02:54 PM');
        expect(process._data).toBe(data);
    });

});