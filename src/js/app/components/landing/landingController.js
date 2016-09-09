pdApp.controller('LandingController', ['$scope', 'LibraryService', '$location', 'LogoutService', '$window', 'Notification', function ($scope, LibraryService, $location, LogoutService, $window, Notification) {

    if ($window.sessionStorage.token) {
        $location.path('/main');
    }

    LibraryService.getLibraries().then(function (data) {
        $scope.libraries = data.libs;
    }, function (err) {
        if (err) {
            Notification.error(err);
        }
    });

    $scope.openLogin = function (isil) {

        $location.path('login/' + isil);
    };

    $scope.info = LogoutService.getInfo();
}]);