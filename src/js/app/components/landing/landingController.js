pdApp.controller('LandingController', function($scope, LibraryService, $location) {

  LibraryService.getLibraries().then(function(data){
    $scope.libraries = data.libs;
  }, function(reason){
    alert('Fehler: '+reason);
  });

  $scope.openLogin = function (isil){
    $location.path('login/'+isil);
  }

});