pdApp.controller('ManageController', function($scope, WatchlistService, $rootScope) {

  WatchlistService.getWatchlists().then(function(data){
    $scope.watchlists = data.watchlists;
    $scope.default_watchlist = data.def_wl;
  });

  $rootScope.$on('watchlistChange', function(e, data){
    $scope.watchlists = data;
  });

  $rootScope.$on('defaultWatchlistChange', function(e, data){
    $scope.def_wl = data;
  });

  this.addNewWatchlist = function(){

    if($scope.newName === undefined || $scope.newName === ''){
      alert('Fehler: Bitte geben Sie einen Namen ein.');
      return;
    }

    WatchlistService.manageWatchlist(undefined, 'add-wl', $scope.newName).then(function(){},function(reason){
      alert('Fehler: '+reason);
    });
  };

  $scope.sortableOptions = {
    update: function(e, ui) {
      var order = [];
      for(var i=0; i < $scope.watchlists.length; i++){
        order.push($scope.watchlists[i].id);
      }

      WatchlistService.manageWatchlist(undefined, 'change-order', JSON.stringify(order)).then(function(){},function(reason){
        alert('Fehler: '+reason);
      });
    },
    axis: 'y'
  };

});