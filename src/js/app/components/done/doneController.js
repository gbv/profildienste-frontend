pdApp.controller('DoneController', ['$scope', 'Entries', 'ConfigService', function ($scope, Entries, ConfigService) {

    $scope.entries = new Entries('done');
    ConfigService.setEntries($scope.entries);

}]);