pdApp.controller('ManageWatchlistController', ['$scope', 'WatchlistService', '$location', '$rootScope', 'Notification', function($scope, WatchlistService, $location, $rootScope, Notification) {

  WatchlistService.getWatchlists().then(function(data){
    $scope.watchlists = data.watchlists;
    $scope.default_watchlist = data.def_wl;
  });

  $rootScope.$on('defaultWatchlistChange', function(e, data){
    $scope.default_watchlist = data;
  });

  $scope.editMode = false;
  $scope.name = $scope.watchlist.name;

  this.edit = function(){
    $scope.editMode = true;
  };

  this.save = function(){
    if($scope.name === $scope.watchlist.name){
      $scope.editMode = false;
      return;
    }

    WatchlistService.manageWatchlist($scope.watchlist.id, 'upd-name', $scope.name).then(function(){
      $scope.editMode = false;
    }, function(reason){
      Notification.error(reason);
    });
  };

  this.delete = function(){
    WatchlistService.manageWatchlist($scope.watchlist.id, 'remove', undefined).then(function(){}, function(reason){
      Notification.error(reason);
    });
  };

  this.setAsDefault = function(){
    WatchlistService.manageWatchlist($scope.watchlist.id, 'def', undefined).then(function(){}, function(reason){
      Notification.error(reason);
    });
  };

  this.disableDelete = function(){
    return $scope.watchlists.length == 1 ||  $scope.default_watchlist == $scope.watchlist.id;
  };

  this.disableDefault = function(){
    return $scope.default_watchlist == $scope.watchlist.id;
  };

  this.open = function(){
    $location.path('watchlist/'+$scope.watchlist.id);
  };

}]);