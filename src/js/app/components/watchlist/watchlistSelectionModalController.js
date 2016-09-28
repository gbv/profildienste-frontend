pdApp.controller('WatchlistSelectionModalController', ['$scope', 'WatchlistService', function ($scope, WatchlistService) {

    $scope.selectedWatchlist = false;
    $scope.watchlists = [];

    WatchlistService.getWatchlists().then(function (resp){
        $scope.watchlists = resp.data.data.watchlists;
        for (var i = 0; i < $scope.watchlists.length; i++) {
            if ($scope.watchlists[i].default){
                $scope.selectedWatchlist = $scope.watchlists[i].id;
                break;
            }
        }
    });

    $scope.cancel = function (){
        $scope.$dismiss();
    };

    $scope.moveSelection = function (){
        $scope.$close($scope.selectedWatchlist);
    };

}]);