pdApp.service('LogoutService', ['$window', '$rootScope', '$injector', '$location', function ($window, $rootScope, $injector, $location) {

    var info;

    var openModal = false;
    this.forceLogout = function () {
        this.destroySession('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an um fortzufahren.');

        if (!openModal) {
            var modalInstance = $injector.get('$uibModal').open({
                templateUrl: 'errorModal.html',
                controller: 'ErrorModalCtrl',
                backdrop: 'static',
                keyboard: false
            });

            openModal = true;

            modalInstance.result.then(function () {
                openModal = false;
            });
        }

    };

    this.destroySession = function (reason) {

        if (reason !== undefined) {
            info = reason;
        }

        $window.sessionStorage.removeItem('token');
        $rootScope.$broadcast('userLogout');
        $location.path('/');
    };

    this.getInfo = function () {
        var ret = info;
        info = '';
        return ret;
    };

}]);