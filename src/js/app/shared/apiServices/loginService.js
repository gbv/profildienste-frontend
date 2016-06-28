pdApp.service('LoginService', ['$http', '$window', '$q', '$rootScope', function ($http, $window, $q, $rootScope) {

  var defLogin = $q.defer();

  if ($window.sessionStorage.token) {
    $rootScope.$broadcast('userLogin');
  }

  this.performLogin = function (user, pass) {

    if ($window.sessionStorage.token) {
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
    }).success(function (json) {
      defLogin.resolve();
      login.resolve();

      $window.sessionStorage.setItem('token', json.data);

      $rootScope.$broadcast('userLogin');
    }).error(function (data) {
      defLogin.reject(data.error);
      login.reject(data.error);
    });

    return login.promise;

  };

  this.whenLoggedIn = function () {

    if ($window.sessionStorage.token) {
      defLogin.resolve();
    }

    return defLogin.promise;
  };

  this.destroySession = function (reason) {
    $window.sessionStorage.removeItem('token');
    $rootScope.$broadcast('userLogout');
  };
}]);