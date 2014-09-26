(function(){

    var module = angular.module("ServerModule", []);

    module.service("ServerService", ["$resource", function($resource){
        return $resource("/api/servers/:id", {id: '@id'}, {'query':  {method:'GET', isArray:false}});
    }]);

})();