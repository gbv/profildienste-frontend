pdApp.controller('LandingController', function($scope, LibraryService, $location, LogoutService) {

  LibraryService.getLibraries().then(function(data){
    $scope.libraries = data.libs;
  }, function(reason){
    alert('Fehler: '+reason);
  });

  $scope.openLogin = function (isil){
    $location.path('login/'+isil);
  }

  $scope.hasInfo = LogoutService.hasInfo();
  $scope.info = LogoutService.getInfo();

});