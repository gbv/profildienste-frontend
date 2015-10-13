pdApp.controller('MainController', ['$scope', 'Entries', 'ConfigService', function($scope, Entries, ConfigService) {

  $scope.entries = new Entries('overview');
  ConfigService.setEntries($scope.entries);

}]);