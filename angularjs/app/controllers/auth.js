(function (){

    var authmodule = angular.module("authModule", []);

    authmodule.controller("AuthController", ['$location', 'TokenService', '$rootScope', function($location, TokenService, $rootScope){

            var ctrl = this;

            this.login = function(){
                TokenService.get_token(null, {username: this.username, password: this.password},
                    function(data){
                        ctrl.login_failed = false;
                        $location.path("/servers");
                        $rootScope.auth_token = data.token;
                    },
                    function(data){
                        ctrl.login_failed = true;
                        $location.path("/");
                    });
            };
    }]);
})();