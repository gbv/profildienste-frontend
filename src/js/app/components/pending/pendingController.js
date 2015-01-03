pdApp.controller('PendingController', function($scope, Entries, ConfigService) {

  $scope.entries = new Entries('pending');
  
  var config = {
    hideWatchlist: false,
    hideCart: true,
    hideRejected: true,
    rejectPossible: false
  };

  ConfigService.setConfig(config);
  ConfigService.setEntries($scope.entries);

});