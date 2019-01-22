pdApp.controller('FooterController', ['$scope', 'version', '$rootScope', 'LoginService', function ($scope, version, $rootScope, LoginService) {
    $scope.version = version;
    $scope.loggedIn = false;

    LoginService.whenLoggedIn().then(function () {
        $scope.loggedIn = true;
    });

    $rootScope.$on('userLogin', function () {
        $scope.loggedIn = true;
    });

    $rootScope.$on('userLogout', function () {
        $scope.loggedIn = false;
    });
}]);