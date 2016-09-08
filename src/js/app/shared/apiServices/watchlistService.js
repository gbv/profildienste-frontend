pdApp.service('WatchlistService', ['$http', '$rootScope', '$q', 'LoginService', function ($http, $rootScope, $q, LoginService) {


    var req;

    this.getWatchlists = function (update) {

        if (update || req === undefined) {
            req = $http.get('/api/watchlist/list');
        }

        return req;
    };

    this.removeFromWatchlist = function (item) {

        // TODO
        var req = $http({
            method: 'POST',
            url: '/api/watchlist/' + item.status.watchlist.id + '/remove',
            data: $.param({
                affected: [item.id]
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


    this.addToWatchlist = function (item, wl) {

        // use and find default watchlist if no explicit watchlist id is given
        var defWatchlistId;
        if (wl === undefined) {
            defWatchlistId = this.getWatchlists().then(function (resp) {
                for (var i = 0; i < resp.data.data.watchlists.length; i++) {
                    var watchlist = resp.data.data.watchlists[i];
                    if (watchlist.default === true) {
                        return watchlist.id;
                    }
                }
            });
        } else {
            defWatchlistId = $q.when(wl);
        }


        var req = defWatchlistId.then(function (watchlistId) {

            if (watchlistId === undefined) {
                return $q.reject('No watchlist id given.');
            }

            // TODO: update to ids and view possible (see cart for instance)
            return $http({
                method: 'POST',
                url: '/api/watchlist/' + watchlistId + '/add',
                data: $.param({
                    affected: [item.id]
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        });


        req.then(function (resp) {
            this.getWatchlists(true).then(function (resp) {
                $rootScope.$broadcast('watchlistChange', resp.data.data.watchlists);
            });
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

        req.then(function (resp) {
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

        req.then(function (resp) {
            this.getWatchlists(true).then(function (resp) {
                $rootScope.$broadcast('watchlistChange', resp.data.data.watchlists);
            });
        }.bind(this));

        return req;
    };

}]);