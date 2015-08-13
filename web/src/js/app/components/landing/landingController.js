pdApp.controller('LandingController', ['$scope', 'LibraryService', '$location', 'LogoutService', '$window', 'Notification', function($scope, LibraryService, $location, LogoutService, $window, Notification) {

  if($window.sessionStorage.token){
    $location.path('/main');
  }

  LibraryService.getLibraries().then(function(data){
    $scope.libraries = data.libs;
  }, function(reason){
    Notification.error(reason);
  });

  $scope.openLogin = function (isil){
    $location.path('login/'+isil);
  }


  $scope.hasInfo = LogoutService.hasInfo();
  $scope.info = LogoutService.getInfo();

}]);