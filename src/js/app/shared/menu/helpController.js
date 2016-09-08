pdApp.controller('HelpController', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

    $scope.cancel = function () {
        $uibModalInstance.close();
    };

}]);