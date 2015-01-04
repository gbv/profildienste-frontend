pdApp.controller('LoginController', function($scope, DataService) {

  DataService.getWatchlists().then(function(data){
    $scope.watchlists = data.watchlists;
    $scope.default_watchlist = data.def_wl;
  });
  
});