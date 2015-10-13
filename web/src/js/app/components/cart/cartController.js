pdApp.controller('CartController', ['$scope', 'Entries', 'ConfigService', '$location', function($scope, Entries, ConfigService, $location) {

  $scope.entries = new Entries('cart');
  ConfigService.setEntries($scope.entries);

}]);