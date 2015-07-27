pdApp.controller('CoverModalCtrl', ['$scope', '$modalInstance', 'cover', function ($scope, $modalInstance, cover) {

  $scope.cover = cover;

  $scope.close = function () {
    $modalInstance.close();
  };

}]);