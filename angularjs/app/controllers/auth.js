(function (){

    var authmodule = angular.module("authModule", []);

    authmodule.controller("AuthController", ['$location', 'TokenService', function($location, TokenService){

            var ctrl = this;

            this.login = function(){
                TokenService.get_token(null, {username: this.username, password: this.password},
                    function(data){
                        ctrl.login_failed = false;
                        $location.path("/servers");
                        ctrl.token = data.token;
                    },
                    function(data){
                        ctrl.login_failed = true;
                        $location.path("/");
                    });
            };
    }]);
})();