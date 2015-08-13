pdApp.controller('LoginController', ['$scope', 'LibraryService', '$routeParams', '$location', 'LoginService', 'Notification', function($scope, LibraryService, $routeParams, $location, LoginService, Notification) {

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
    Notification.error(reason);
  });

  $scope.userValid = true;
  $scope.passValid = true;

  this.submitLogin = function(){


    if($scope.user === undefined || !$scope.user.match(/^\d+$/)){
      $scope.userValid = false;
    }else{
      $scope.userValid = true;
    }

    if($scope.pass === undefined || $scope.pass.trim() === ''){
      $scope.passValid = false;
    }else{
      $scope.passValid = true;
    }

    if(!$scope.userValid || !$scope.passValid){
      return;
    }

    LoginService.performLogin($scope.user, $scope.pass).then(function(data){
      $location.path('/main');
    }, function(error){
      $scope.error = true;
      $scope.errorMessage = error;
    });
  }
  
}]);