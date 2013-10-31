'use strict';

angular.module('dashSupervisorFrontApp')
  .controller('ServerCtrl', function ($scope) {
    $scope.servers = [
        {name: "Updater"},
        {name: "Updater2"},
        {name: "Exportacao"}
    ];
  });
