pdApp.controller('CartController', ['$scope', 'Entries', 'ConfigService', '$location', function($scope, Entries, ConfigService, $location) {

  $scope.entries = new Entries('cart');

  var config = {
    hideWatchlist: false,
    hideCart: true,
    hideRejected: true,
    rejectPossible: false
  };
  
  ConfigService.setConfig(config);
  ConfigService.setEntries($scope.entries);



}]);