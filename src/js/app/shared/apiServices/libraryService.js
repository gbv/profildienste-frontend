pdApp.service('LibraryService', ['$http', '$q', function ($http, $q) {

  var defLibs = $q.defer();

  $http.get('/api/libraries').success(function (data) {

      defLibs.resolve({
        libs: data.data
      });
    
  }).error(function (data) {
    defLibs.reject(data.error);
  });

  this.getLibraries = function () {
    return defLibs.promise;
  };

}]);