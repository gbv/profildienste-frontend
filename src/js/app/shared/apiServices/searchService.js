pdApp.service('SearchService', ['$http', '$q', 'SettingsService', '$rootScope', function ($http, $q, SettingsService, $rootScope) {

    var searchterm;
    var searchType;

    this.getSearchConfig = function () {
        return SettingsService.getSettings().then(function (resp) {
            return {
                searchable_fields: resp.data.data.searchable_fields,
                search_modes: resp.data.data.search_modes
            };
        });
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