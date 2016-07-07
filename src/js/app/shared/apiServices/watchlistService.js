pdApp.service('WatchlistService', ['$http', '$rootScope', '$q', 'LoginService', function ($http, $rootScope, $q, LoginService) {


    var req = $http.get('/api/watchlist/list').then(function (resp) {
        return resp;
    });

    this.getWatchlists = function (update) {

        if (update) {
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

    this.manageWatchlist = function (wlId, type, content) {

        var def = $q.defer();

        $http({
            method: 'POST',
            url: '/api/watchlist/manage',
            data: $.param({
                id: wlId,
                type: type,
                content: content
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (json) {
            if (!json.success) {
                def.reject(json.errormsg);
            } else {

                if (type === 'upd-name') {
                    for (i = 0; i < this.data.watchlists.length; i++) {
                        if (this.data.watchlists[i].id == json.id) {
                            this.data.watchlists[i].name = content;
                            break;
                        }
                    }
                }

                if (type === 'add-wl') {
                    var wl = {};
                    wl.name = content;
                    wl.id = json.id;
                    wl.count = 0;
                    this.data.watchlists.push(wl);
                }

                if (type === 'remove') {
                    for (i = 0; i < this.data.watchlists.length; i++) {
                        if (this.data.watchlists[i].id == json.id) {
                            this.data.watchlists.splice(i, 1);
                            break;
                        }
                    }
                }

                if (type === 'def') {
                    this.data.def_wl = json.id;
                    $rootScope.$broadcast('defaultWatchlistChange', json.id);
                }


                $rootScope.$broadcast('watchlistChange', this.data.watchlists);
                def.resolve();

            }
        }.bind(this));

        return def.promise;
    };

}])
;