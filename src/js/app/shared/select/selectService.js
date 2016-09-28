pdApp.service('SelectService', ['$rootScope', 'Notification', 'PageConfigService', 'CartService', 'RejectService', 'WatchlistService', '$uibModal', function ($rootScope, Notification, PageConfigService, CartService, RejectService, WatchlistService, $uibModal) {

    // TODO: Refactor this whole service since a lot of these methods share the same code
    var selected = [];

    var selectView = false;
    var selectAll = false;

    $rootScope.$on('siteChanged', function (ev, data) {
        this.resetSelection();
        this.entries = data.entries;
        this.siteData = data;

        // load page config
        var site = data.watchlist ? 'watchlist' : data.site;
        this.config = PageConfigService.getConfig(site);

    }.bind(this));

    $rootScope.$on('siteLoadingFinished', function (ev, data) {
        if (selectView) {
            selected = [];
            for (var i = 0; i < this.entries.items.length; i++) {
                selected.push(this.entries.items[i]);
            }
        }
    }.bind(this));

    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
        this.resetSelection();
    }.bind(this));

    this.getSelected = function () {
        return selected;
    };

    this.viewSelected = function () {
        return selectView;
    };

    this.getSelectedNumber = function () {
        if (selectView) {
            return this.entries.total;
        } else {
            return selected.length;
        }
    };

    this.selectAll = function () {

        if (this.loading) {
            return;
        }

        this.resetSelection(false);
        selectView = false;
        selectAll = true;
        for (var i = 0; i < this.entries.items.length; i++) {
            this.entries.items[i].status.selected = true;
            selected.push(this.entries.items[i]);
        }

        $rootScope.$broadcast('selectionChange', {
            type: 'item',
            selected: selected.length
        });
    };

    this.selectView = function () {

        if (this.loading) {
            return;
        }

        this.resetSelection(false);
        selectAll = false;
        selectView = true;
        for (var i = 0; i < this.entries.items.length; i++) {
            this.entries.items[i].status.selected = true;
            selected.push(this.entries.items[i]);
        }

        $rootScope.$broadcast('selectionChange', {
            type: 'view'
        });
    };


    this.resetSelection = function (hardReset) {

        if (this.loading) {
            return;
        }

        if (typeof hardReset === 'undefined' || hardReset) {
            selectView = false;
            selectAll = false;
        }

        for (var i = 0; i < selected.length; i++) {
            selected[i].status.selected = false;
        }

        selected = [];

        $rootScope.$broadcast('selectionChange', {
            type: 'none'
        });
    };

    this.select = function (item) {

        if (this.loading) {
            return;
        }

        if (item.status.selected) {
            return;
        }
        selected.push(item);
        item.status.selected = true;

        $rootScope.$broadcast('selectionChange', {
            type: 'item',
            selected: selected.length
        });
    };

    this.deselect = function (item) {

        if (this.loading) {
            return;
        }

        var ind = selected.indexOf(item);
        if (ind < 0) {
            return;
        }

        selected.splice(ind, 1);
        item.status.selected = false;
        selectView = false;

        $rootScope.$broadcast('selectionChange', {
            type: 'item',
            selected: selected.length
        });
    };

    this.getSelectionIds = function () {
        var ids = [];
        for (var i = 0; i < selected.length; i++) {
            ids.push(selected[i].id);
        }
        return ids;
    };

    this.selectionInCart = function (site) {

        var s = '';
        var ids = [];
        if (selectView) {
            s = site;
        } else {
            ids = this.getSelectionIds();
        }

        this.loading = true;
        CartService.addToCart(ids, s).then(function () {

            for (var i = 0; i < selected.length; i++) {
                selected[i].status.selected = false;
                selected[i].status.cart = true;
                if (this.config.actionConfig.hideCart && !selectView) {
                    this.entries.removeItem(selected[i]);
                }
            }

            if (this.config.actionConfig.hideCart && selectView) {
                this.entries.items = [];
                this.entries.loadMore(true);
            }

            this.loading = false;
            this.resetSelection();
        }.bind(this), function (err) {
            if (err) {
                Notification.error(err);
            }
            this.loading = false;
        }.bind(this));
    };

    this.selectionRemoveFromCart = function (site) {

        var s = '';
        var ids = [];
        if (selectView) {
            s = site;
        } else {
            ids = this.getSelectionIds();
        }

        this.loading = true;
        CartService.removeFromCart(ids, s).then(function () {

            for (var i = 0; i < selected.length; i++) {
                selected[i].status.selected = false;
                selected[i].status.cart = false;
                if (this.config.actionConfig.hideCart && !selectView) {
                    this.entries.removeItem(selected[i]);
                }
            }

            if (this.config.actionConfig.hideCart && selectView) {
                this.entries.items = [];
                this.entries.loadMore(true);
            }

            this.loading = false;
            this.resetSelection();
        }.bind(this), function (err) {
            if (err) {
                Notification.error(err);
            }
            this.loading = false;
        }.bind(this));
    };

    this.selectionReject = function (site) {

        var s = '';
        var ids = [];
        if (selectView) {
            s = site;
        } else {
            ids = this.getSelectionIds();
        }

        this.loading = true;
        RejectService.addRejected(ids, s).then(function () {

                for (var i = 0; i < selected.length; i++) {
                    selected[i].status.selected = false;
                    selected[i].status.rejected = true;
                    if (this.config.actionConfig.hideRejected && !selectView) {
                        this.entries.removeItem(selected[i]);
                    }
                }

                if (this.config.actionConfig.hideRejected && selectView) {
                    this.entries.items = [];
                    this.entries.loadMore(true);
                }

                this.loading = false;
                this.resetSelection();

            }.bind(this),
            function (err) {
                if (err) {
                    Notification.error(err);
                }
                this.loading = false;
            }.bind(this));

    };

    this.selectionRemoveReject = function (site) {

        var s = '';
        var ids = [];
        if (selectView) {
            s = site;
        } else {
            ids = this.getSelectionIds();
        }

        this.loading = true;
        RejectService.removeRejected(ids, s).then(function () {

                for (var i = 0; i < selected.length; i++) {
                    selected[i].status.selected = false;
                    selected[i].status.rejected = false;
                    if (this.config.actionConfig.hideRejected && !selectView) {
                        this.entries.removeItem(selected[i]);
                    }
                }

                if (this.config.actionConfig.hideRejected && selectView) {
                    this.entries.items = [];
                    this.entries.loadMore(true);
                }

                this.loading = false;
                this.resetSelection();

            }.bind(this),
            function (err) {
                if (err) {
                    Notification.error(err);
                }
                this.loading = false;
            }.bind(this));
    };

    this.selectionRemoveFromWatchlist = function () {

        var affected = this.viewSelected() ? 'watchlist/' + this.siteData.id : this.getSelectionIds();
        var watchlistId = this.siteData.watchlist ? this.siteData.id : undefined;

        this.loading = true;

        WatchlistService.removeFromWatchlist(affected, watchlistId).then(function () {

                for (var i = 0; i < selected.length; i++) {
                    selected[i].status.selected = false;
                    selected[i].status.watchlist = false;
                    if (this.config.actionConfig.hideWatchlist && !selectView) {
                        this.entries.removeItem(selected[i]);
                    }
                }

                if (this.config.actionConfig.hideWatchlist && selectView) {
                    this.entries.items = [];
                    this.entries.loadMore(true);
                }

                this.loading = false;
                this.resetSelection();

            }.bind(this),
            function (err) {
                if (err) {
                    Notification.error(err);
                }
                this.loading = false;
            }.bind(this));
    };

    this.selectionAddToWatchlist = function () {

        var modalInstance = $uibModal.open({
            templateUrl: '/watchlist/watchlistSelectionModal.html',
            controller: 'WatchlistSelectionModalController',
            keyboard: true
        });

        modalInstance.result.then(function (watchlistId) {

            var affected = this.viewSelected() ? this.siteData.site : this.getSelectionIds();

            this.loading = true;

            WatchlistService.addToWatchlist(affected, watchlistId).then(function () {

                    for (var i = 0; i < selected.length; i++) {
                        selected[i].status.selected = false;
                        selected[i].status.watchlist = false;
                        if (this.config.actionConfig.hideWatchlist && !selectView) {
                            this.entries.removeItem(selected[i]);
                        }
                    }

                    if (this.config.actionConfig.hideWatchlist && selectView) {
                        this.entries.items = [];
                        this.entries.loadMore(true);
                    }

                    this.loading = false;
                    this.resetSelection();

                }.bind(this),
                function (err) {
                    if (err) {
                        Notification.error(err);
                    }
                    this.loading = false;
                }.bind(this));
        }.bind(this));
    };

}]);