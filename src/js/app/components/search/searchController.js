pdApp.controller('SearchController', ['$scope', 'SearchService', '$rootScope', 'Entries', 'ConfigService', function ($scope, SearchService, $rootScope, Entries, ConfigService) {

  $rootScope.$broadcast('siteChanged', {
    site: 'search',
    watchlist: false
  });

  this.doSearch = function () {

    $scope.searchterm = SearchService.getSearchterm();
    $scope.searchType = SearchService.getSearchType();

    $scope.advancedSearchOpen = false;
    $scope.noSearchterm = false;
    if ($scope.searchterm === undefined || $scope.searchterm === '') {
      $scope.advancedSearchOpen = true;
      $scope.noSearchterm = true;
      $rootScope.$broadcast('siteLoadingFinished', -2);
      return;
    } else {
      $scope.advancedSearchOpen = false;
    }

    $rootScope.$broadcast('siteLoading');

    var searchterm;
    if ($scope.searchType === 'keyword'){
       searchterm = window.encodeURIComponent($scope.searchterm);
    } else {
      searchterm = window.encodeURIComponent(angular.toJson($scope.searchterm));
    }
      $scope.entries = new Entries('search/' + searchterm + '/' + $scope.searchType, undefined, 'search');
      ConfigService.setEntries($scope.entries);
      $scope.entries.loadMore();
  };

  $rootScope.$on('siteLoadingFinished', function (e) {
    if ($scope.entries) {
      $scope.entries.getAdditional().then(function (data) {
        $rootScope.$broadcast('searchFinished', data);
      });
    }
  });

  $rootScope.$on('search', function (e) {
    this.doSearch();
  }.bind(this));

  this.doSearch();

  this.showSearch = function () {
    return ($scope.entries !== undefined && !$scope.noSearchterm && !$scope.entries.error && ($scope.entries.total > 0 || $scope.entries.loading));
  };

  this.showNoHits = function () {
    return ($scope.entries !== undefined && $scope.entries.total === 0 && !$scope.entries.error && !$scope.noSearchterm && !$scope.entries.loading);
  };

  $scope.$on('$locationChangeStart', function (event) {
    $rootScope.$broadcast('searchViewUnload');
  });

}]);