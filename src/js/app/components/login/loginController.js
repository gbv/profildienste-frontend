pdApp.controller('LoginController', ['$scope', 'LibraryService', '$routeParams', '$location', 'LoginService', 'Notification', function ($scope, LibraryService, $routeParams, $location, LoginService, Notification) {

    LibraryService.getLibraries().then(function (data) {
        for (var i = 0; i < data.libs.length; i++) {
            if (data.libs[i].isil == $routeParams.isil) {
                $scope.library = data.libs[i];
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
