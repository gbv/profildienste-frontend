pdApp.controller('CoverModalCtrl', ['$scope', '$uibModalInstance', 'cover', function ($scope, $uibModalInstance, cover) {

  $scope.cover = cover;

  $scope.close = function () {
    $uibModalInstance.close();
  };

}]);