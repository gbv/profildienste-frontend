pdApp.service('LibraryService', ['$http', function ($http) {

    this.getLibraries = function () {
        return $http.get('/api/libraries');
    };

}]);