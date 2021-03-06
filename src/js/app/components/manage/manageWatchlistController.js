pdApp.controller('ManageWatchlistController', ['$scope', 'WatchlistService', '$location', '$rootScope', 'Notification', function ($scope, WatchlistService, $location, $rootScope, Notification) {

    $scope.editMode = false;
    $scope.name = $scope.watchlist.name;

    this.edit = function () {
        $scope.editMode = true;
    };

    this.save = function () {

        if ($scope.name === $scope.watchlist.name) {
            $scope.editMode = false;
            return;
        }

        WatchlistService.renameWatchlist($scope.watchlist.id, $scope.name).then(function () {
            $scope.editMode = false;
        }, function (err) {
            if (err) {
                Notification.error(err);
            }
        });
    };

    this.delete = function () {
        WatchlistService.deleteWatchlist($scope.watchlist.id).then(function () {
        }, function (err) {
            if (err) {
                Notification.error(err);
            }
        });
    };

    this.setAsDefault = function () {
        WatchlistService.updateDefaultWatchlist($scope.watchlist.id).then(function () {
        }, function (err) {
            if (err) {
                Notification.error(err);
            }
        });
    };

    this.disableDelete = function () {
        return $scope.watchlists.length === 1 || $scope.watchlist.default;
    };

    this.disableDefault = function () {
        return $scope.watchlist.default;
    };

    this.open = function () {
        $location.path('watchlist/' + $scope.watchlist.id);
    };

}]);