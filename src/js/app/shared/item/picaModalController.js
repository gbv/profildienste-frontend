/**
 * Controller for the PICA Modal
 */
pdApp.controller('PICAModalCtrl', ['$scope', '$uibModalInstance', 'picaData', function ($scope, $uibModalInstance, picaData) {

    $scope.picaData = picaData;

    $scope.close = function () {
        $uibModalInstance.close();
    };

}]);