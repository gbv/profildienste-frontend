pdApp.service('LoginService', ['$http', '$window', '$q', '$rootScope', function ($http, $window, $q, $rootScope) {

    var defLogin = $q.defer();

    if ($window.sessionStorage.token) {
        $rootScope.$broadcast('userLogin');
    }

    this.performLogin = function (user, pass) {

        if ($window.sessionStorage.token) {
            return;
        }

        var req = $http({
            method: 'POST',
            url: '/api/auth',
            data: $.param({
                user: user,
                pass: pass
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        req.then(function (resp) {
            $window.sessionStorage.setItem('token', resp.data.data);
            defLogin.resolve();
            $rootScope.$broadcast('userLogin');
        }, function (err) {
            defLogin.reject(err);
        });

        return req;

    };

    this.whenLoggedIn = function () {

        if ($window.sessionStorage.token) {
            defLogin.resolve();
        }

        return defLogin.promise;
    };

}]);