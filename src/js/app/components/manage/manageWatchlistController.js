pdApp.controller('ManageWatchlistController', function($scope, DataService, $location) {

  DataService.getWatchlists().then(function(data){
    $scope.watchlists = data.watchlists;
    $scope.default_watchlist = data.def_wl;
  });

  this.disableDelete = function(){
    return $scope.watchlists.length == 1 ||  $scope.default_watchlist == $scope.watchlist.id;
  };

  this.disableDefault = function(){
    return $scope.default_watchlist == $scope.watchlist.id;
  }

  this.open = function(){
    $location.path('watchlist/'+$scope.watchlist.id);
  }

});