'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('ServerCtrl', function ($scope, $rootScope) {
    $rootScope.activate("Servidores");

    $scope.servers = [
        {name: "Updater"},
        {name: "Updater2"},
        {name: "Exportacao"}
    ];

  });
