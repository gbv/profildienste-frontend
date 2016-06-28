pdApp.service('UserService', ['$http', '$q', 'LoginService', function ($http, $q, LoginService) {

    var defUser = $q.defer();

    var motdSeen = false;

    LoginService.whenLoggedIn().then(function (data) {

        // Get name and budgets
        $http.get('/api/user').success(function (resp) {

            defUser.resolve({
                name: resp.data.name,
                motd: resp.data.motd,
                defaults: resp.data.defaults,
                budgets: resp.data.budgets,
                show: {
                    comments: false,
                    author: true,
                    pages: true,
                    isbn: true,
                    gvk: true,
                    year: true,
                    genre: true,
                    dnb_number: true,
                    dnb: true,
                    assigned: true
                }
            });

        }).error(function (reason) {
            defUser.reject(reason);
        });

    });

    this.getUserData = function () {
        return defUser.promise;
    };

    this.setMOTDSeen = function () {
        this.motdSeen = true;
    };

    this.getMOTDSeen = function () {
        return this.motdSeen;
    };

}]);