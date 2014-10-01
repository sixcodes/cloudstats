(function(){

    var app = angular.module("ProcessModel", [])
        .factory("ProcessInstance", function(){
        return function(process_data){
                return {
                    _data: process_data,
                    name: process_data.name,
                    group: process_data.group,
                    description: process_data.description,
                    statename : process_data.statename
                };
        };
    });


})();