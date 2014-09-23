(function (){

    var authmodule = angular.module("authModule", []);

    authmodule.controller("AuthController", ['$http', '$location', '$log', function($http, $location){

            var ctrl = this;

            this.login = function(){
                $http.post("/api-login/", {username: this.username, password: this.password})
                    .success(function (data){
                        $location.path("/servers");
                    })
                    .error(function(data){
                        ctrl.login_failed = true;
                        $location.path("/");
                    });
            };
    }]);

})();