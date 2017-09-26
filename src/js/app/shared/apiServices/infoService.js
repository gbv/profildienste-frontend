pdApp.service('InfoService', ['$http', 'Notification', function ($http, Notification) {

    this.getAddInf = function (item) {
        return $http({
            method: 'GET',
            url: '/api/titles/' + item.id + '/info'
        });
    };

    this.openOPAC = function (item) {

        var req = $http({
            method: 'GET',
            url: '/api/titles/' + item.id + '/opac'
        });

        req.then(function (resp) {
            window.open(resp.data.data.opac, '_blank');
        }, function (err) {
            if (err) {
                Notification.error(err);
            }
        });
    };

    /**
     * Fetches a titles PICA data using the server API
     *
     * @param item Item which PICA data should be fetched
     * @returns Promise
     */
    this.getPICA = function (item) {
        return $http({
            method: 'GET',
            url: '/api/titles/' + item.id + '/pica'
        });
    };
}]);