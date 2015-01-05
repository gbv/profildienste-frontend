pdApp.controller('LoginController', function($scope, LibraryService, $routeParams, $location) { // LoginService

  LibraryService.getLibraries().then(function(data){
    for(var i=0; i < data.libs.length; i++){
      if(data.libs[i].isil == $routeParams.isil){
        $scope.library = data.libs[i];
        break;
      }
    }

    if($scope.library === undefined){
      $location.path('/');
    }
    
  }, function(reason){
    alert('Fehler: '+reason);
  });
  
});