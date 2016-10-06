pdApp.service('PageConfigService', ['$rootScope', function ($rootScope) {

    var currentView;

    $rootScope.$on('siteChanged', function (ev, data) {
        currentView = data.watchlist ? 'watchlist' : data.site;
    });

    var views = {
        overview: {
            title: 'Gesamtübersicht Neuerscheinungen',
            icon: 'fa-home',
            enableSelection: true,
            actionConfig: {
                hideWatchlist: true,
                hideCart: true,
                hideRejected: true
            },
            selection: {
                cart: true,
                removeCart: false,
                watchlist: true,
                removeWatchlist: false,
                reject: true,
                removeReject: false
            }
        },
        cart: {
            title: 'Warenkorb',
            icon: 'fa-shopping-cart',
            enableSelection: true,
            actionConfig: {
                hideWatchlist: true,
                hideCart: true,
                hideRejected: true
            },
            selection: {
                cart: false,
                removeCart: true,
                watchlist: true,
                removeWatchlist: false,
                reject: false,
                removeReject: false
            }
        },
        pending: {
            title: 'In Bearbeitung',
            icon: 'fa-tasks',
            enableSelection: false,
            actionConfig: {
                hideWatchlist: true,
                hideCart: true,
                hideRejected: true
            },
            selection: {
                cart: false,
                removeCart: false,
                watchlist: false,
                removeWatchlist: false,
                reject: false,
                removeReject: false
            }
        },
        rejected: {
            title: 'Abgelehnt',
            icon: 'fa-minus-circle',
            enableSelection: true,
            actionConfig: {
                hideWatchlist: true,
                hideCart: true,
                hideRejected: true
            },
            selection: {
                cart: false,
                removeCart: false,
                watchlist: true,
                removeWatchlist: false,
                reject: false,
                removeReject: true
            }
        },
        done: {
            title: 'Bearbeitet',
            icon: 'fa-check',
            enableSelection: false,
            actionConfig: {
                hideWatchlist: true,
                hideCart: true,
                hideRejected: true
            },
            selection: {
                cart: false,
                removeCart: false,
                watchlist: false,
                removeWatchlist: false,
                reject: false,
                removeReject: false
            }
        },
        manage: {
            title: 'Verwaltung Ihrer Merklisten',
            icon: 'fa-star',
            enableSelection: false,
            actionConfig: {},
            selection: {
                cart: false,
                removeCart: false,
                watchlist: false,
                removeWatchlist: false,
                reject: false,
                removeReject: false
            }
        },
        order: {
            title: 'Bestätigung',
            icon: 'fa-shopping-cart',
            enableSelection: false,
            actionConfig: {},
            selection: {
                cart: false,
                removeCart: false,
                watchlist: false,
                removeWatchlist: false,
                reject: false,
                removeReject: false
            }
        },
        ordered: {
            title: 'Vorgang erfolgreich abgeschlossen',
            icon: 'fa-check',
            enableSelection: false,
            actionConfig: {},
            selection: {
                cart: false,
                removeCart: false,
                watchlist: false,
                removeWatchlist: false,
                reject: false,
                removeReject: false
            }
        },
        search: {
            title: 'Suche',
            icon: 'fa-search',
            enableSelection: true,
            actionConfig: {
                hideWatchlist: true,
                hideCart: true,
                hideRejected: true
            },
            selection: {
                cart: true,
                removeCart: false,
                watchlist: true,
                removeWatchlist: false,
                reject: true,
                removeReject: false
            }
        },
        watchlist: {
            title: 'Merkliste',
            icon: 'fa-star',
            enableSelection: true,
            actionConfig: {
                hideWatchlist: true,
                hideCart: true,
                hideRejected: true
            },
            selection: {
                cart: true,
                removeCart: false,
                watchlist: false,
                removeWatchlist: true,
                reject: true,
                removeReject: false
            }
        }
    };

    this.getTitle = function () {
        if (views.hasOwnProperty(currentView)) {
            return views[currentView].title;
        } else {
            return undefined;
        }
    };

    this.getIcon = function () {
        if (views.hasOwnProperty(currentView)) {
            return views[currentView].icon;
        } else {
            return undefined;
        }
    };

    this.getConfig = function () {
        if (views.hasOwnProperty(currentView)) {
            return {
                actionConfig: views[currentView].actionConfig,
                selectionEnabled: views[currentView].enableSelection
            };
        } else {
            return undefined;
        }
    };

    this.getSelectionOptions = function () {
        if (views.hasOwnProperty(currentView)) {
            return views[currentView].selection;
        } else {
            return undefined;
        }
    };

    this.getCurrentView = function () {
        return currentView;
    };

}]);
