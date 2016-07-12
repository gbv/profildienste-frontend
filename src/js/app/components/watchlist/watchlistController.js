pdApp.controller('WatchlistController', ['$scope', 'Entries', 'ConfigService', '$routeParams', 'WatchlistService', function ($scope, Entries, ConfigService, $routeParams, WatchlistService) {


  WatchlistService.getWatchlists().then(function (resp) {

    console.log(resp);

    var title;
    for (var i = 0; i < resp.data.data.watchlists.length; i++) {
      if (resp.data.data.watchlists[i].id == $routeParams.id) {
        title = resp.data.data.watchlists[i].name;
        break;
      }
    }

    $scope.entries = new Entries('watchlist', $routeParams.id, title);
    ConfigService.setEntries($scope.entries);

  });
}]);