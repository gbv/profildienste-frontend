pdApp.service('RejectService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

    this.addRejected = function (data, view) {

        var def = $q.defer();

        var items = data;
        if (data.constructor !== Array) {
            items = [data.id];
        }

        var v = (view === undefined) ? '' : view;

        $http({
            method: 'POST',
            url: '/api/reject/add',
            data: $.param({
                id: items,
                view: v
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (json) {
            if (!json.success) {
                def.reject(json.errormsg);
            } else {
                def.resolve();
            }
        }.bind(this));

        return def.promise;
    };

    this.removeRejected = function (data, view) {

        var def = $q.defer();

        var items = data;
        if (data.constructor !== Array) {
            items = [data.id];
        }

        var v = (view === undefined) ? '' : view;

        $http({
            method: 'POST',
            url: '/api/reject/remove',
            data: $.param({
                id: items,
                view: v
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (json) {
            if (!json.success) {
                def.reject(json.errormsg);
            } else {
                def.resolve();
            }
        }.bind(this));

        return def.promise;
    };

}]);