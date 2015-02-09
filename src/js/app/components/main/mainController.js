pdApp.controller('MainController', ['$scope', 'Entries', 'ConfigService', function($scope, Entries, ConfigService) {

  $scope.entries = new Entries('overview');
  
  var config = {
    hideWatchlist: false,
    hideCart: true,
    hideRejected: true,
    rejectPossible: true
  };

  ConfigService.setConfig(config);
  ConfigService.setEntries($scope.entries);

}]);