(function (){

    var authmodule = angular.module("authModule", [])
        .controller("AuthController", function(){

            this.login_ok = false;

            this.login = function(){
                this.login_ok = true;
            };
    });

})();