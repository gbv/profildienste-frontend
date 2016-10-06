pdApp.service('RejectService', ['$http', '$rootScope', 'PageConfigService', function ($http, $rootScope, PageConfigService) {

    this.addRejected = function (data, view) {

        var items = data;
        if (data.constructor !== Array) {
            items = [data.id];
        }

        var affected = (view === undefined || view === '') ? items : view;

        var req = $http({
            method: 'POST',
            url: '/api/rejected/add',
            data: $.param({
                affected: affected
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        req.then(function (){
            // if titles in a watchlist were rejected, update the watchlist info
            if (PageConfigService.getCurrentView() === 'watchlist') {
                $rootScope.$broadcast('watchlistsNeedUpdate');
            }
        });

        return req;
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