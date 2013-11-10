'use strict';

describe('Controller: ServerdetailCtrl', function () {

  // load the controller's module
  beforeEach(module('dashSupervisorFrontApp'));

  var ServerdetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ServerdetailCtrl = $controller('ServerdetailCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
