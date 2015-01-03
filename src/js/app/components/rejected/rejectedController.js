pdApp.controller('RejectedController', function($scope, Entries, ConfigService) {

  $scope.entries = new Entries('rejected');
  
  var config = {
    hideWatchlist: false,
    hideCart: true,
    hideRejected: true,
    rejectPossible: false
  };

  ConfigService.setConfig(config);
  ConfigService.setEntries($scope.entries);

});