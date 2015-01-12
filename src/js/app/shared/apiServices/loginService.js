pdApp.service('LoginService', function($http, $window, $q) {

  var defLogin = $q.defer();
  var token;

  this.performLogin = function(user, pass){

    if($window.sessionStorage.token){
      return;
    }

    var login = $q.defer();

    $http({
      method: 'POST',
      url: '/api/auth',
      data: $.param({
        user: user,
        pass: pass
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        login.reject(json.message);
      }else{

        defLogin.resolve();
        login.resolve();

        $window.sessionStorage.token = json.token;
      }
    }).error(function(reason){
      $scope.error = true;
      $scope.errorMessage = reason;
    });

    return login.promise;

  };

  this.whenLoggedIn = function(){

    if($window.sessionStorage.token){
      defLogin.resolve();
    }

    return defLogin.promise;
  };

});