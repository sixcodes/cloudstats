'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('NavbarCtrl', function ($scope) {

   $scope._links =[
       {name: "Home", url: ""},
       {name: "Servidores", url: "server"},
       {name:"Settings", url: "settings"}
   ];

   $scope._disactivate_all = function(){
       $scope._active = {};
       $scope._links.forEach(function (key){
           $scope._active[key] = "";
       });
   };

   $scope.activate = function(name){
       $scope._disactivate_all();
       $scope._active[name] = "active";
   };

   $scope._active = {};
   $scope._disactivate_all();
   $scope.activate($scope._links[0]["name"]);

  });
