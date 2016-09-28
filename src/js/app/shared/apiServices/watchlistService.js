pdApp.service('WatchlistService', ['$http', '$rootScope', '$q', 'PageConfigService', function ($http, $rootScope, $q, PageConfigService) {


    var req;

    this.getWatchlists = function (update) {

        if (update || req === undefined) {
            req = $http.get('/api/watchlist/list');
        }

        return req;
    };

    this.removeFromWatchlist = function (affected, watchlist) {

        var req = $http({
            method: 'POST',
            url: '/api/watchlist/' + watchlist + '/remove',
            data: $.param({
                affected: affected
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        req.then(function (resp) {
            this.getWatchlists(true).then(function (resp) {
                $rootScope.$broadcast('watchlistChange', resp.data.data.watchlists);
            });
        }.bind(this));

        return req;
    };


    this.addToWatchlist = function (affected, watchlistId) {

        // use and find default watchlist if no watchlist id is given
        var defWatchlistId;
        if (watchlistId === undefined) {
            defWatchlistId = this.getWatchlists().then(function (resp) {
                for (var i = 0; i < resp.data.data.watchlists.length; i++) {
                    var watchlist = resp.data.data.watchlists[i];
                    if (watchlist.default === true) {
                        return watchlist.id;
                    }
                }
            });
        } else {
            defWatchlistId = $q.when(watchlistId);
        }

        var req = defWatchlistId.then(function (watchlistId) {

            if (watchlistId === undefined) {
                return $q.reject('No watchlist id given.');
            }

            return $http({
                method: 'POST',
                url: '/api/watchlist/' + watchlistId + '/add',
                data: $.param({
                    affected: affected
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        });

        // trigger watchlist update
        req.then(function (resp) {

            this.getWatchlists(true).then(function (resp) {
                $rootScope.$broadcast('watchlistChange', resp.data.data.watchlists);
            });

            // if titles in the cart are moved into a watchlist, update the cart info
            if (PageConfigService.getCurrentView() === 'cart') {
                $rootScope.$broadcast('cartNeedsUpdate');
            }
        }.bind(this));

        return req;
    };

    this.addNewWatchlist = function (name) {
        var req = $http({
            method: 'PUT',
            url: '/api/watchlist/new',
            data: $.param({
                name: name
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        req.then(function (resp) {
            this.getWatchlists(true).then(function (resp) {
                $rootScope.$broadcast('watchlistChange', resp.data.data.watchlists);
            });
        }.bind(this));

        return req;
    };

    this.deleteWatchlist = function (id) {
        var req = $http({
            method: 'DELETE',
            url: '/api/watchlist/' + id
        });

        req.then(function (resp) {
            this.getWatchlists(true).then(function (resp) {
                $rootScope.$broadcast('watchlistChange', resp.data.data.watchlists);
            });
        }.bind(this));

        return req;
    };

    this.changeWatchlistOrder = function (order) {
        var req = $http({
            method: 'PATCH',
            url: '/api/watchlist/order',
            data: $.param({
                order: order
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        req.then(function (resp) {
            this.getWatchlists(true).then(function (resp) {
                $rootScope.$broadcast('watchlistChange', resp.data.data.watchlists);
            });
        }.bind(this));

        return req;
    };

    this.renameWatchlist = function (id, name) {

        var req = $http({
            method: 'POST',
            url: '/api/watchlist/' + id + '/rename',
            data: $.param({
                name: name
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        req.then(function () {
            this.getWatchlists(true).then(function (resp) {
                $rootScope.$broadcast('watchlistChange', resp.data.data.watchlists);
            });
        }.bind(this));

        return req;
    };

    this.updateDefaultWatchlist = function (id) {

        var req = $http({
            method: 'POST',
            url: '/api/watchlist/default',
            data: $.param({
                id: id
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        req.then(function () {
            this.getWatchlists(true).then(function (resp) {
                $rootScope.$broadcast('watchlistChange', resp.data.data.watchlists);
            });
        }.bind(this));

        return req;
    };

    $rootScope.$on('watchlistsNeedUpdate', function (){
        this.getWatchlists(true).then(function (resp) {
            $rootScope.$broadcast('watchlistChange', resp.data.data.watchlists);
        });
    }.bind(this));

}]);