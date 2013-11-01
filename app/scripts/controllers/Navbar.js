'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('NavbarCtrl', function ($scope, $rootScope) {
   $rootScope._active = {};

   $scope._links =[
       {name: "Home", url: ""},
       {name: "Servidores", url: "server"},
       {name:"Settings", url: "settings"}
   ];

   $rootScope._disactivate_all = function(){
       $rootScope._active = {};
       $scope._links.forEach(function (key){
           $rootScope._active[key] = "";
       });
   };

   $rootScope.activate = function(name){
       $rootScope._disactivate_all();
       $rootScope._active[name] = "active";
   };

   $rootScope._disactivate_all();
   $rootScope.activate($scope._links[0]["name"]);
  });
