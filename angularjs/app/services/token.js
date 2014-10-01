(function(){

    var tokenmodule = angular.module("TokenModule", [])
        .factory("TokenService", function($resource){
            return $resource("/api-login", null, {
                get_token: {method: "POST"}
            });
        });
})();