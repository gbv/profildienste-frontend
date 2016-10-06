pdApp.controller('HeaderController', ['$scope', '$rootScope', 'LoginService', '$location', '$http', 'Notification', 'PageConfigService', function ($scope, $rootScope, LoginService, $location, $http, Notification, PageConfigService) {
    $scope.title = '';
    $scope.icon = '';
    $scope.site = 'main';

    $scope.loading = true;
    $scope.total = 0;

    $scope.selection = false;
    $scope.selected = 0;

    $rootScope.$on('siteChanged', function (ev, site) {

        $scope.site = site.site;

        $scope.title = site.watchlist ? site.site : PageConfigService.getTitle();
        $scope.icon = PageConfigService.getIcon();

        $scope.total = 0;
    });

    $rootScope.$on('siteLoading', function (ev) {
        $scope.loading = true;
    });

    $rootScope.$on('siteLoadingFinished', function (ev, total) {
        $scope.loading = false;
        $scope.total = total;
    });

    $rootScope.$on('totalChanged', function (ev, total) {
        $scope.total = total;
    });

    $rootScope.$on('watchlistChange', function (ev, data) {
        if ($scope.site === 'manage') {
            $scope.total = data.length;
        }
    });

    $scope.loggedIn = false;

    LoginService.whenLoggedIn().then(function (data) {
        $scope.loggedIn = true;
    });

    $rootScope.$on('userLogin', function (e) {
        $scope.loggedIn = true;
    });

    $rootScope.$on('userLogout', function (e) {
        $scope.loggedIn = false;
    });

    this.showCartContinue = function () {
        return ($scope.site === 'cart' && $scope.total > 0);
    };

    this.cartContinue = function () {
        $location.path('order');
    };

    this.showDeletePermanently = function () {
        return ($scope.site === 'rejected' && $scope.total > 0);
    };

    this.deletePermanently = function () {
        $http({
            method: 'DELETE',
            url: '/api/titles/delete',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (resp) {
            Notification.success('Ihre abgelehnten Titel wurden erfolgreich gelöscht.');
            $location.path('/main');
        }, function (err) {
            if (err) {
                Notification.error(err);
            }
        });
    };

    this.showManageWatchlists = function () {
        return (!$scope.loading && $scope.site === 'manage');
    };

    this.showOrderConfirmation = function () {
        return (!$scope.loading && $scope.site === 'order');
    };

    this.showOrderedConfirmation = function () {
        return (!$scope.loading && $scope.site === 'ordered');
    };

    this.showSearchResults = function () {
        return (!$scope.loading && $scope.site === 'search' && $scope.total > 0);
    };

    this.showSearchNoResults = function () {
        return (!$scope.loading && $scope.site === 'search' && $scope.total === 0);
    };

    this.showSearchGettingStarted = function () {
        return (!$scope.loading && $scope.site === 'search' && $scope.total === -2);
    };

    this.showError = function () {
        return ($scope.total === -1);
    };

    this.showEntriesInformation = function () {
        return (
            !$scope.loading && !this.showError() && !this.showManageWatchlists() && !this.showOrderConfirmation() && !this.showOrderedConfirmation() && !this.showSearchResults() && !this.showSearchNoResults() && !this.showSearchGettingStarted() && !this.showEntriesSelectedInformation()
        );
    };

    $rootScope.$on('selectionChange', function (e, data) {

        if ((data.type === 'item' && data.selected === 0) || data.type === 'none') {
            $scope.selection = false;
            $scope.selected = 0;
        } else {
            $scope.selection = data.type;
        }

        if (data.type === 'item') {

            $scope.selected = data.selected;

            if ($scope.selected === $scope.total) {
                $scope.selection = 'view';
            }
        }

    });

    this.showEntriesSelectedInformation = function () {
        return !$scope.loading && $scope.selection;
    };

    // used to display the special case when items in a search result are selected
    this.selectionInSearchResult = function (){
        return $scope.selection && this.showSearchResults();
    };

}]);