pdApp.controller('HelpController', ['$scope', '$modalInstance', function($scope, $modalInstance) {

  $scope.cancel = function () {
    $modalInstance.close();
  };

}]);