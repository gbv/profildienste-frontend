pdApp.service('SearchService', ['$http', '$q', 'LoginService', '$rootScope', function ($http, $q, LoginService, $rootScope) {

  var defSearchConfig = $q.defer();
  var searchterm;
  var searchType;

  LoginService.whenLoggedIn().then(function (data) {
  /* TODO: this is now part of the settings and therefore should be handled by the settingsService
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
    */
  });

  this.getSearchConfig = function () {
    return defSearchConfig.promise;
  };

  this.setSearchterm = function (term, type) {
    searchterm = term;
    searchType = type;
    $rootScope.$broadcast('search');
  };

  this.getSearchterm = function () {
    return searchterm;
  };

  this.getSearchType = function () {
    return searchType;
  };

}]);