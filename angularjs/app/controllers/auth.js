(function (){

    var authmodule = angular.module("authModule", []);

    authmodule.controller("AuthController", function($location, TokenService, $cookieStore){

            var ctrl = this;

            TokenService.get_token(
                function(data){
                    $location.path("/servers");
                    $cookieStore.put("auth_token", data.token);
                },
                function(data){
                    $location.path("/");
            });
});
})();