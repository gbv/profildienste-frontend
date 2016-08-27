pdApp.controller('OrderController', ['$scope', 'OrderService', '$location', '$http', '$rootScope', 'Notification', '$sce', 'CartService', function ($scope, OrderService, $location, $http, $rootScope, Notification, $sce, CartService) {

    $scope.orderComplete = false;

    $scope.defaultValueHelpText = $sce.trustAsHtml('Da keine Angabe<br> gemacht wurde, <br>wurde hier der <br>für Sie hinterlegte <br>Standardwert <br>eingetragen.');

    OrderService.getOrderlist().then(function (resp) {

        $scope.orderlist = resp.data.data;

        $rootScope.$broadcast('siteChanged', {
            site: 'order',
            watchlist: false
        });

        $rootScope.$broadcast('siteLoading');
        $rootScope.$broadcast('siteLoadingFinished', 0);

    }, function (reason) {
        Notification.error(reason);
        $location.path('cart');
    });

    this.order = function () {
        var req = $http({
            method: 'POST',
            url: '/api/cart/order',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        req.then(function (resp) {
            $scope.orderComplete = true;

            CartService.getCart().then(function (resp) {
                $rootScope.$broadcast('cartChange', resp);
            });

            $rootScope.$broadcast('siteChanged', {
                site: 'ordered',
                watchlist: false
            });
        }, function (resp) {
            Notification.error(resp.data.error);
        });
    };

    this.cancel = function () {
        $location.path('cart');
    };

    this.finish = function () {
        $location.path('main');
    };

}]);
