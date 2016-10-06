pdApp.controller('WatchlistController', ['$scope', 'Entries', 'ConfigService', '$routeParams', 'WatchlistService', '$location', function ($scope, Entries, ConfigService, $routeParams, WatchlistService, $location) {


    WatchlistService.getWatchlists().then(function (resp) {

        var title;
        for (var i = 0; i < resp.data.data.watchlists.length; i++) {
            if (resp.data.data.watchlists[i].id == $routeParams.id) {
                title = resp.data.data.watchlists[i].name;
                break;
            }
        }

        if (title === undefined) {
            $location.path('/');
        }

        $scope.entries = new Entries('watchlist', $routeParams.id, title);
        ConfigService.setEntries($scope.entries);
        $scope.entries.reset(); //bugfix, otherwise titles won't load for some reason when directly opening the watchlist page

    });
}]);