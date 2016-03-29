pdApp.service('SearchService', ['$http', '$q', 'LoginService', '$rootScope', function ($http, $q, LoginService, $rootScope) {

  var defSearchConfig = $q.defer();
  var searchterm;

  LoginService.whenLoggedIn().then(function (data) {

    // Get name and budgets
    $http.get('/api/search').success(function (json) {
      if (!json.success) {
        defSearchConfig.reject(json.message);
      } else {
        defSearchConfig.resolve(json.data);
      }
    }).error(function (reason) {
      defSearchConfig.reject(reason);
    });

  });

  this.getSearchConfig = function () {
    return defSearchConfig.promise;
  };

  this.setSearchterm = function (term) {
    searchterm = term;
    $rootScope.$broadcast('search');
  };

  this.getSearchterm = function () {
    return searchterm;
  };

}]);