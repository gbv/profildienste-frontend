pdApp.controller('LogoutController', function($scope, LogoutService) {
  LogoutService.destroySession();
});