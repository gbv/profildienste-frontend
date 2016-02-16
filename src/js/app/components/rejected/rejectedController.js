pdApp.controller('RejectedController', ['$scope', 'Entries', 'ConfigService', function ($scope, Entries, ConfigService) {

  $scope.entries = new Entries('rejected');
  ConfigService.setEntries($scope.entries);

}]);