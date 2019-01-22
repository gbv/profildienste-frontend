pdApp.controller('CoverModalCtrl', ['$scope', '$uibModalInstance', 'cover', 'CoverService', function ($scope, $uibModalInstance, cover, CoverService) {

    $scope.loading = true;
    $scope.cover = null;

    CoverService.getCover(cover).then(function (img){
        $scope.cover = img;
        $scope.loading = false;
    }, function (err) {
        $scope.loading = false;
    });

    $scope.close = function () {
        $uibModalInstance.close();
    };

}]);