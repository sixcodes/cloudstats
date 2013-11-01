'use strict';

describe('Controller: ServereditCtrl', function () {

  // load the controller's module
  beforeEach(module('dashSupervisorFrontApp'));

  var ServereditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ServereditCtrl = $controller('ServereditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
