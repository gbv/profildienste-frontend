pdApp.service('CartService', ['$http', '$rootScope', 'PageConfigService', function ($http, $rootScope, PageConfigService) {


    this.getCart = function () {
        return $http.get('/api/cart/info');
    };

    this.addToCart = function (data, view) {

        var items = data;
        if (data.constructor !== Array) {
            items = [data.id];
        }

        var affected = (view === undefined || view === '') ? items : view;

        var req = $http({
            method: 'POST',
            url: '/api/cart/add',
            data: $.param({
                affected: affected
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        req.then(function () {
            this.getCart().then(function (resp) {
                $rootScope.$broadcast('cartChange', resp);
            });

            // if titles in a watchlist are moved into the cart, update the watchlist info
            if (PageConfigService.getCurrentView() === 'watchlist') {
                $rootScope.$broadcast('watchlistsNeedUpdate');
            }

        }.bind(this));

        return req;
    };


    this.removeFromCart = function (data, view) {

        var items = data;
        if (data.constructor !== Array) {
            items = [data.id];
        }

        var affected = (view === undefined || view === '') ? items : view;

        var req = $http({
            method: 'POST',
            url: '/api/cart/remove',
            data: $.param({
                affected: affected
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        req.then(function () {
            this.getCart().then(function (resp) {
                $rootScope.$broadcast('cartChange', resp);
            });
        }.bind(this));

        return req;
    };

    $rootScope.$on('cartNeedsUpdate', function (){
        this.getCart().then(function (resp) {
            $rootScope.$broadcast('cartChange', resp);
        });
    }.bind(this));

}]);