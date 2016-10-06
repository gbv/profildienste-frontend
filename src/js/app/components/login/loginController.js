pdApp.controller('LoginController', ['$scope', 'LibraryService', '$routeParams', '$location', 'LoginService', 'Notification', function ($scope, LibraryService, $routeParams, $location, LoginService, Notification) {

    LibraryService.getLibraries().then(function (resp) {
        for (var i = 0; i < resp.data.data.length; i++) {
            if (resp.data.data[i].isil == $routeParams.isil) {
                $scope.library = resp.data.data[i];
                break;
            }
        }

        if ($scope.library === undefined) {
            $location.path('/');
        }

    }, function (err) {
        if (err) {
            Notification.error(err);
        }
    });

    $scope.userValid = true;
    $scope.passValid = true;

    this.submitLogin = function () {


        $scope.userValid = $scope.user !== undefined;
        $scope.passValid = !($scope.pass === undefined || $scope.pass.trim() === '');

        if (!$scope.userValid || !$scope.passValid) {
            return;
        }

        LoginService.performLogin($scope.user, $scope.pass).then(function () {
            $location.path('/main');
        }, function (error) {
            $scope.error = true;
            $scope.errorMessage = error;
        });
    };

}]);
