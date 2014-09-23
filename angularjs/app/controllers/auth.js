(function (){

    var authmodule = angular.module("authModule", []);

    authmodule.controller("AuthController", ['$http', '$location', '$log', 'TokenService', function($http, $location, $log, TokenService){

            var ctrl = this;

            this.login = function(){
                TokenService.get_token(null, {username: this.username, password: this.password},
                    function(data){
                        $location.path("/servers");
                        this.token = data["token"];
                        $log.log(this.token);
                    },
                    function(data){
                        ctrl.login_failed = true;
                        $location.path("/");
                    });
                $log.log(this.token);
            };
    }]);

})();