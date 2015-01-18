pdApp.controller('CartController', function($scope, Entries, ConfigService, $location) {

  $scope.entries = new Entries('cart');

  var config = {
    hideWatchlist: false,
    hideCart: true,
    hideRejected: true,
    rejectPossible: false
  };
  
  ConfigService.setConfig(config);
  ConfigService.setEntries($scope.entries);

  this.showContinue = function(){
    return ($scope.entries.total > 0);
  }

  this.continue = function(){
    $location.path('order');
  }

});