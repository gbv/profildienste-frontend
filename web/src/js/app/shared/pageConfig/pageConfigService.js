pdApp.service('PageConfigService', ['Notification', function (Notification) {

    var views = {
        overview: {
            title: 'Gesamtübersicht Neuerscheinungen',
            icon: 'fa-home',
            enableSelection: true,
            actionConfig: {
                hideWatchlist: false,
                hideCart: true,
                hideRejected: true
            },
            selection: {
                cart: true,
                removeCart: false,
                watchlist: false,   //eigentlich true,
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
                hideWatchlist: false,
                hideCart: true,
                hideRejected: true
            },
            selection: {
                cart: false,
                removeCart: true,
                watchlist: false,   //eigentlich true,
                removeWatchlist: false,
                reject: false,
                removeReject: false
            }
        },
        pending: {
            title: 'In Bearbeitung',
            icon: 'fa-tasks',
            enableSelection:false,
            actionConfig: {
                hideWatchlist: false,
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
                hideWatchlist: false,
                hideCart: true,
                hideRejected: true
            },
            selection: {
                cart: false,
                removeCart: false,
                watchlist: false,
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
                hideWatchlist: false,
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
            enableSelection: false,
            actionConfig: {
                hideWatchlist: false,
                hideCart: false,
                hideRejected: false
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
        watchlist: {
            title: 'Merkliste', //unused
            icon: 'fa-star',
            enableSelection: true,
            actionConfig: {
                hideWatchlist: true,
                hideCart: false,
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
        }
    };

    this.getTitle = function (view) {
        if (views.hasOwnProperty(view)) {
            return views[view].title;
        }else{
            return undefined;
        }
    };

    this.getIcon = function (view) {
        if (views.hasOwnProperty(view)) {
            return views[view].icon;
        }else{
            return undefined;
        }
    };

    this.getConfig = function (view) {
        if (views.hasOwnProperty(view)) {
            return {
                actionConfig: views[view].actionConfig,
                selectionEnabled: views[view].enableSelection
            };
        }else{
            return undefined;
        }
    };

    this.getSelectionOptions = function (view) {
        if (views.hasOwnProperty(view)) {
            return views[view].selection;
        }else{
            return undefined;
        }
    };
}]);
