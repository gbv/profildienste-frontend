pdApp.controller('SearchController', ['$scope', 'SearchService', '$rootScope', 'Entries', 'ConfigService', function ($scope, SearchService, $rootScope, Entries, ConfigService) {

  $rootScope.$broadcast('siteChanged', {
    site: 'search',
    watchlist: false
  });

  this.doSearch = function () {

    $scope.searchterm = SearchService.getSearchterm();

    $scope.advancedSearchOpen = false;
    if ($scope.searchterm === undefined || $scope.searchterm === '') {
      $scope.advancedSearchOpen = true;
      $rootScope.$broadcast('siteLoadingFinished', -2);
      return;
    } else {
      $scope.advancedSearchOpen = false;
    }

    $rootScope.$broadcast('siteLoading');
      $scope.entries = new Entries('search/' + window.encodeURIComponent($scope.searchterm), undefined, 'search');
      ConfigService.setEntries($scope.entries);
      $scope.entries.loadMore();
  };

  $rootScope.$on('search', function (e) {
    this.doSearch();
  }.bind(this));

  this.doSearch();

  this.showSearch = function () {
    return ($scope.entries !== undefined && !$scope.getStarted && !$scope.entries.error && ($scope.entries.total > 0 || $scope.entries.loading));
  };

  this.showNoHits = function () {
    return ($scope.entries !== undefined && $scope.entries.total === 0 && !$scope.entries.error && !$scope.getStarted && !$scope.entries.loading);
  };

  $scope.$on('$locationChangeStart', function (event) {
    $rootScope.$broadcast('searchViewUnload');
  });

}]);