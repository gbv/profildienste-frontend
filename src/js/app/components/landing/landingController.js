pdApp.controller('LandingController', ['$scope', 'LibraryService', '$location', 'LogoutService', '$window', function($scope, LibraryService, $location, LogoutService, $window) {

  if($window.sessionStorage.token){
    $location.path('/main');
  }

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

}]);