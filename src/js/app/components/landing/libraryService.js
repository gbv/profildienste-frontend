pdApp.service('LibraryService', ['$http', '$q', function($http, $q) {

  var defLibs = $q.defer();

  $http.jsonp('/api/libraries?callback=JSON_CALLBACK').success(function(data){
    
    defLibs.resolve({
      libs: data.data
    });

  }).error(function(reason){
    defLibs.reject(reason);
  });

  this.getLibraries = function(){
    return defLibs.promise;
  };

}]);