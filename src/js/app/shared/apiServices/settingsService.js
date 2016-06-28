pdApp.service('SettingsService', ['$http', '$rootScope', '$q', 'LoginService', function ($http, $rootScope, $q, LoginService) {

    var defSort = $q.defer();
    var defOrder = $q.defer();

    var defSelOptions = $q.defer();

    LoginService.whenLoggedIn().then(function (data) {

        // all available settings
        $http.get('/api/settings').success(function (resp) {

            defSort.resolve({
                sortby: resp.data.sortby
            });

            defOrder.resolve({
                order: resp.data.order
            });

        }).error(function (reason) {
            defSort.reject(reason);
            defOrder.reject(reason);
        });


        // user specific settings
        $http.get('/api/user/settings').success(function (resp) {

            this.data = resp.data;

            defSelOptions.resolve({
                sort: resp.data.settings.sortby,
                order: resp.data.settings.order
            });

        }.bind(this)).error(function (reason) {
            defSelOptions.reject(reason);
        });

    }.bind(this));

    this.getOrder = function () {

        return defOrder.promise;
    };

    this.getSortby = function () {

        return defSort.promise;
    };


    this.getSelOptions = function () {
        if (this.data === undefined) {
            return defSelOptions.promise;
        } else {
            var d = $q.defer();
            d.resolve({
                sort: this.data.settings.sortby,
                order: this.data.settings.order
            });
            return d.promise;
        }
    };

    this.changeSetting = function (type, value) {

        var def = $q.defer();

        $http({
            method: 'POST',
            url: '/api/settings',
            data: $.param({
                type: type,
                value: value
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (json) {
            if (!json.success) {
                def.reject(json.errormsg);
            } else {
                def.resolve({
                    type: json.type,
                    value: json.value
                });

                if (type === 'sortby') {
                    this.data.settings.sortby = value;
                } else if (type === 'order') {
                    this.data.settings.order = value;
                }

            }
        }.bind(this));

        return def.promise;
    };

}]);