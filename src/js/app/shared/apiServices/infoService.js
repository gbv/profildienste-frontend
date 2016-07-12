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
        }, function (resp) {
            Notification.error(resp.data.error);
        });
    };

}]);