(function(){

    var tokenmodule = angular.module("TokenModule", [])
        .factory("TokenService", function($resource){
            return $resource("/token", null, {
                get_token: {method: "GET"}
            });
        });
})();