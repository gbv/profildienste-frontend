pdApp.controller('WatchlistController', function($scope, Entries, ConfigService, $routeParams) {
  
  $scope.entries = new Entries('watchlist', $routeParams.id);

  var config = {
    hideWatchlist: false,
    hideCart: true,
    hideRejected: true,
    rejectPossible: false
  };

  ConfigService.setConfig(config);
  ConfigService.setEntries($scope.entries);

});