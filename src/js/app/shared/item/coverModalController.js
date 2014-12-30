pdApp.controller('CoverModalCtrl', function ($scope, $modalInstance, cover) {

  $scope.cover = cover;

  $scope.close = function () {
    $modalInstance.close();
  };

});