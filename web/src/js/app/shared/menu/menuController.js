pdApp.controller('MenuController', ['$scope', '$rootScope', 'WatchlistService', 'CartService', 'UserService', '$modal', 'SelectService', 'LoginService', 'SearchService', '$location', function ($scope, $rootScope, WatchlistService, CartService, UserService, $modal, SelectService, LoginService, SearchService, $location) {


    WatchlistService.getWatchlists().then(function (data) {
        $scope.watchlists = data.watchlists;
        $scope.def_wl = data.def_wl;
    });

    UserService.getUserData().then(function (data) {
        $scope.name = data.name;
    });

    CartService.getCart().then(function (data) {
        $scope.cart = data.cart;
        $scope.price = data.price
    });

    $rootScope.$on('cartChange', function (e, cart, price) {
        $scope.cart = cart;
        $scope.price = price;
    });

    $rootScope.$on('watchlistChange', function (e, watchlists) {
        $scope.watchlists = watchlists;
    });

    this.openHelp = function () {

        $modal.open({
            templateUrl: '/assets/html/help.html',
            controller: 'HelpController'
        });
    };

    $scope.itemsSelected = (SelectService.getSelected().length > 0);
    $scope.showSelMenu = false;

    $rootScope.$on('itemSelected', function () {
        $scope.itemsSelected = true;
        $scope.selNumber = SelectService.getSelected().length;

        if ($scope.selNumber == 1) {
            $scope.showSelMenu = true;
        }
    });

    $rootScope.$on('itemDeselected', function () {

        $scope.selNumber = SelectService.getSelected().length;

        if ($scope.selNumber == 0) {
            $scope.itemsSelected = false;
            $scope.showSelMenu = false;
        }
    });

    this.toggleSelMenu = function () {
        $scope.showSelMenu = !$scope.showSelMenu;
    }

    this.selectAll = function () {
        SelectService.selectAll();
    }

    this.deselectAll = function () {
        SelectService.deselectAll();
    }

    this.rejectAll = function () {
        SelectService.rejectAll();
    }

    this.search = function () {
        SearchService.setSearchterm($scope.searchterm);
        $location.path('search');
    }

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

    var backShown = false;
    var initialRoute = true;

    if($location.path() !== '/main'){
        $('#back').css('font-size', '12px');
        $('#back').css('opacity', '1');
        $('#logo').css('line-height', '14px');
        backShown = true;
    }else{
        $('#back').css('font-size', '0px');
        $('#back').css('opacity', '0');
        $('#logo').css('line-height', '20px');
    }

    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {

        if(initialRoute){
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

}]);
