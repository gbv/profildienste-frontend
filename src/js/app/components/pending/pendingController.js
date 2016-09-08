pdApp.controller('PendingController', ['$scope', 'Entries', 'ConfigService', function ($scope, Entries, ConfigService) {

    $scope.entries = new Entries('pending');
    ConfigService.setEntries($scope.entries);

}]);