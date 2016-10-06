pdApp.controller('MenuController',['$scope', '$rootScope', 'WatchlistService', 'CartService', 'UserService', '$uibModal', 'SelectService', 'LoginService', 'SearchService', '$location', 'PageConfigService', '$timeout', function ($scope, $rootScope, WatchlistService, CartService, UserService, $uibModal, SelectService, LoginService, SearchService, $location, PageConfigService, $timeout) {

    $scope.pricePopover = '/menu/pricePopover.html';
    $scope.openSelectionActions = true;

    LoginService.whenLoggedIn().then(function () {

        WatchlistService.getWatchlists().then(function (resp) {
            $scope.watchlists = resp.data.data.watchlists;
        });

        UserService.getUserData().then(function (data) {
            $scope.name = data.name;
        });

        CartService.getCart().then(function (resp) {
            $scope.cart = resp.data.data.count;
            $scope.price = resp.data.data.price;
        });
    });

    $rootScope.$on('cartChange', function (e, resp) {
        $scope.cart = resp.data.data.count;
        $scope.price = resp.data.data.price;
    });

    $rootScope.$on('watchlistChange', function (e, watchlists) {
        $scope.watchlists = watchlists;
    });

    this.openHelp = function () {

        $uibModal.open({
            templateUrl: '/html/help.html',
            controller: 'HelpController'
        });
    };

    $scope.showSelMenu = false;
    $scope.menuChangePossible = false;

    $rootScope.$on('selectionChange', function (e, data) {
        var selectionMenuPreviouslyShown = $scope.showSelMenu;
        $scope.showSelMenu = data.type === 'view' || (data.type === 'item' && data.selected > 0);
        $scope.menuChangePossible = $scope.showSelMenu;

        if (!selectionMenuPreviouslyShown && $scope.showSelMenu){
            $timeout(function () {
                $scope.openSelectionActions = true;
            }, 50);
        }
    });

    this.toggleSelMenu = function () {
        $scope.showSelMenu = !$scope.showSelMenu;
    };

    this.selectAll = function () {
        SelectService.selectAll();
    };

    this.selectView = function () {
        SelectService.selectView();
    };

    this.deselectAll = function () {
        SelectService.resetSelection();
    };

    this.selectionInCart = function () {
        SelectService.selectionInCart($scope.site);
    };

    this.selectionRemoveFromCart = function () {
        SelectService.selectionRemoveFromCart($scope.site);
    };

    this.selectionReject = function () {
        SelectService.selectionReject($scope.site);
    };

    this.selectionRemoveReject = function () {
        SelectService.selectionRemoveReject($scope.site);
    };

    this.selectionRemoveFromWatchlist = function (){
        SelectService.selectionRemoveFromWatchlist();
    };

    this.search = function () {
        SearchService.setSearchterm($scope.searchterm, 'keyword');
        $location.path('search');
    };

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

    $rootScope.$on('searchViewUnload', function () {
        $scope.searchterm = '';
    });

    $rootScope.$on('setSearchbox', function (e, data) {
        $scope.searchterm = data;
    });

    $rootScope.$on('siteChanged', function (ev, site) {
        $scope.site = site.watchlist ? 'watchlist/' + site.id : site.site;
        $scope.selection = PageConfigService.getSelectionOptions((site.watchlist ? 'watchlist' : site.site));
    });

    var backShown = false;
    var initialRoute = true;

    if ($location.path() !== '/main') {
        $('#back').css('font-size', '12px');
        $('#back').css('opacity', '1');
        $('#logo').css('line-height', '14px');
        backShown = true;
    } else {
        $('#back').css('font-size', '0px');
        $('#back').css('opacity', '0');
        $('#logo').css('line-height', '20px');
    }

    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {

        if (initialRoute) {
            initialRoute = false;
            return;
        }

        if ($location.path() !== '/main') {
            if (!backShown) {

                $('#back').removeClass('back-out');
                $('#back').addClass('back-in');

                $('#logo').removeClass('logo-out');
                $('#logo').addClass('logo-in');

                backShown = true;
            }
        } else {
            if (backShown) {

                $('#back').removeClass('back-in');
                $('#back').addClass('back-out');

                $('#logo').removeClass('logo-in');
                $('#logo').addClass('logo-out');

                backShown = false;
            }
        }
    });

    this.selectionInWatchlist = function (){
        SelectService.selectionAddToWatchlist();
    };

}]);
