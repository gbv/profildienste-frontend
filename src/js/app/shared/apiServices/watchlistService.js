pdApp.service('WatchlistService', ['$http', '$rootScope', '$q', 'LoginService', function ($http, $rootScope, $q, LoginService) {

    var defWatchlists = $q.defer();

    LoginService.whenLoggedIn().then(function (data) {
        $http.get('/api/watchlist/list').success(function (resp) {

            this.data = resp.data;

            defWatchlists.resolve({
                watchlists: resp.data,
                def_wl: 0 // TODO: rework default watchlist handling
            });

        }.bind(this)).error(function (reason) {
            defWatchlists.reject(reason);
        });
    }.bind(this));

    this.getWatchlists = function () {
        return defWatchlists.promise;
    };

    this.removeFromWatchlist = function (item) {

        var def = $q.defer();

        $http({
            method: 'POST',
            url: '/api/watchlist/remove',
            data: $.param({id: item.id, wl: item.status.watchlist.id}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (json) {
            if (!json.success) {
                def.reject(json.errormsg);
            } else {

                for (var i = 0; i < this.data.watchlists.length; i++) {
                    if (this.data.watchlists[i].id == item.status.watchlist.id) {
                        this.data.watchlists[i].count = json.content;
                        $rootScope.$broadcast('watchlistChange', this.data.watchlists);
                        break;
                    }
                }

                def.resolve();

            }
        }.bind(this));

        return def.promise;
    };


    this.addToWatchlist = function (item, wl) {

        if (wl === undefined) {
            wl = this.data.def_wl;
        }

        var def = $q.defer();

        $http({
            method: 'POST',
            url: '/api/watchlist/add',
            data: $.param({id: item.id, wl: wl}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (json) {
            if (!json.success) {
                def.reject(json.errormsg);
            } else {

                var name;
                for (var i = 0; i < this.data.watchlists.length; i++) {
                    if (this.data.watchlists[i].id == wl) {
                        this.data.watchlists[i].count = json.content;
                        name = this.data.watchlists[i].name;
                        $rootScope.$broadcast('watchlistChange', this.data.watchlists);
                        break;
                    }
                }

                def.resolve({
                    content: json.content,
                    id: wl,
                    name: name
                });

            }
        }.bind(this));

        return def.promise;
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

}]);