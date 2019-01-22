var pdApp = angular.module('Profildienst', ['infinite-scroll', 'ui.bootstrap', 'ngRoute', 'ui.sortable', 'ui-notification']);

pdApp.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);

pdApp.config(['NotificationProvider', function (NotificationProvider) {
    NotificationProvider.setOptions({
        delay: 10000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'right',
        positionY: 'top'
    });
}]);

pdApp.filter('notEmpty', function () {
    return function (val) {
        return val !== undefined && val !== null && val !== '';
    };
});

pdApp.constant('version', '2.0.0');

pdApp.controller('ErrorModalCtrl', ['$scope', '$uibModalInstance', '$rootScope', '$window', function ($scope, $uibModalInstance, $rootScope, $window) {

    $scope.close = function () {
        $rootScope.token = undefined;
        $uibModalInstance.close();
        $window.location.reload();
    };

}]);


pdApp.factory('authInterceptor', ['$rootScope', '$q', '$window', 'LogoutService', function ($rootScope, $q, $window, LogoutService) {

    var isAbsolute = new RegExp('^([a-z]+://|//)', 'i');
    return {
        request: function (config) {

            if (!isAbsolute.test(config.url)) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
            }

            return config;
        },

        responseError: function (rejection) {

            if (rejection.status === 503) {
                if (rejection.config.url !== '/api/status') {
                    LogoutService.showMaintenance();
                }
                return $q.reject();
            }

            if (rejection.status === 401) {
                LogoutService.forceLogout();
                return $q.reject();
            }

            var err = rejection.data.error || rejection.statusText;
            return $q.reject(err);
        }
    };
}]);

pdApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}]);

pdApp.controller('ContentController', ['$scope', '$rootScope', 'LoginService', function ($scope, $rootScope, LoginService) {

    $scope.loggedIn = false;

    $rootScope.$on('userLogin', function (e) {
        $scope.loggedIn = true;
    });

    $rootScope.$on('userLogout', function (e) {
        $scope.loggedIn = false;
    });

    LoginService.whenLoggedIn().then(function (data) {
        $scope.loggedIn = true;
    });

    //workaround since the affix occasionally bugs and does not
    //remove the affix class when scrolling to top
    $rootScope.$on('siteChanged', function (e) {
        $('#header-fixed').removeClass('affix');
    });

}]);

// Overwrite the Angular Bootstrap popover template to allow HTML
// (see http://stackoverflow.com/a/21979258)
pdApp.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);