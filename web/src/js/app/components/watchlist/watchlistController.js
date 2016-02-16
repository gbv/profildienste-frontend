pdApp.controller('WatchlistController', ['$scope', 'Entries', 'ConfigService', '$routeParams', 'WatchlistService', function ($scope, Entries, ConfigService, $routeParams, WatchlistService) {


  WatchlistService.getWatchlists().then(function (data) {

    var title;
    for (var i = 0; i < data.watchlists.length; i++) {
      if (data.watchlists[i].id == $routeParams.id) {
        title = data.watchlists[i].name;
        break;
      }
    }

    $scope.entries = new Entries('watchlist', $routeParams.id, title);
    ConfigService.setEntries($scope.entries);

  });
}]);