pdApp.controller('ManageController', ['$scope', 'WatchlistService', '$rootScope', 'Notification', function ($scope, WatchlistService, $rootScope, Notification) {

    WatchlistService.getWatchlists().then(function (resp) {
        $scope.watchlists = resp.data.data.watchlists;

        $rootScope.$broadcast('siteChanged', {
            site: 'manage',
            watchlist: false
        });

        $rootScope.$broadcast('siteLoading');
        $rootScope.$broadcast('siteLoadingFinished', $scope.watchlists.length);

    });

    $rootScope.$on('watchlistChange', function (e, data) {
        $scope.watchlists = data;
    });

    this.addNewWatchlist = function () {

        if ($scope.newName === undefined || $scope.newName === '') {
            Notification.error('Bitte geben Sie einen Namen ein.');
            return;
        }

        WatchlistService.addNewWatchlist($scope.newName).then(function () {
        }, function (err) {
            if (err) {
                Notification.error(err);
            }
        });
    };

    $scope.sortableOptions = {
        stop: function (e, ui) {

            var order = $scope.watchlists.map(function (watchlist) {
                return watchlist.id;
            });

            WatchlistService.changeWatchlistOrder(order).then(function () {
            }, function (err) {
                if (err) {
                    Notification.error(err);
                }
            });
        },
        axis: 'y'
    };

}]);