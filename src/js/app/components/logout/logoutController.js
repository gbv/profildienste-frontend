pdApp.controller('LogoutController', ['$scope', 'LogoutService', function($scope, LogoutService) {
  LogoutService.destroySession();
}]);