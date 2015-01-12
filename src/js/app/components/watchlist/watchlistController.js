pdApp.controller('WatchlistController', function($scope, Entries, ConfigService, $routeParams, WatchlistService) {
  
  $scope.entries = new Entries('watchlist', $routeParams.id);

  WatchlistService.getWatchlists().then(function (data){

    for(var i=0; i < data.watchlists.length; i++){
      if(data.watchlists[i].id == $routeParams.id){
        $scope.title = data.watchlists[i].name;
        break;
      }
    }
    
  });

  var config = {
    hideWatchlist: false,
    hideCart: true,
    hideRejected: true,
    rejectPossible: false
  };

  ConfigService.setConfig(config);
  ConfigService.setEntries($scope.entries);

});