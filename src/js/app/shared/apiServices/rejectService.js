pdApp.service('RejectService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

    this.addRejected = function (data, view) {

        var items = data;
        if (data.constructor !== Array) {
            items = [data.id];
        }

        var affected = (view === undefined || view === '') ? items : view;

        return $http({
            method: 'POST',
            url: '/api/rejected/add',
            data: $.param({
                affected: affected
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

    };

    this.removeRejected = function (data, view) {

        var items = data;
        if (data.constructor !== Array) {
            items = [data.id];
        }

        var affected = (view === undefined || view === '') ? items : view;

        return $http({
            method: 'POST',
            url: '/api/rejected/remove',
            data: $.param({
                affected: affected
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };

}]);