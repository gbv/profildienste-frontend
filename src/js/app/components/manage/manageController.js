pdApp.controller('ManageController', function($scope, WatchlistService) {

  WatchlistService.getWatchlists().then(function(data){
    $scope.watchlists = data.watchlists;
    $scope.default_watchlist = data.def_wl;
  });
  
});