'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('ServeraddCtrl', function ($scope, $rootScope) {
  $rootScope.activate("Servidores");
  $scope.title = "Addind a new Server";


  $scope.reset = function (){

  }

  $scope.save = function(server){
      console.log(server);
  }
  });
