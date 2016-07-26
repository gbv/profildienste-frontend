pdApp.service('SettingsService', ['$http', function ($http) {

    var reqSettings;
    this.getSettings = function () {

        if (reqSettings === undefined) {
            reqSettings = $http.get('/api/settings');
        }
        return reqSettings;
    };


    this.getUserSettings = function () {
        return $http.get('/api/user/settings');
    };

    this.getOrder = function () {
        return this.getSettings().then(function (resp) {
            return resp.data.data.order;
        });
    };

    this.getSortby = function () {
        return this.getSettings().then(function (resp) {
            return resp.data.data.sortby;
        });
    };


    this.getSelOptions = function () {
        return this.getUserSettings().then(function (resp) {
            return {
                sort: resp.data.data.settings.sortby,
                order: resp.data.data.settings.order
            };
        });
    };

    this.changeSetting = function (type, value) {

        return $http({
            method: 'POST',
            url: '/api/user/settings',
            data: $.param({
                type: type,
                value: value
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };

}]);