pdApp.service('OrderService', ['$http', function ($http) {

    this.getOrderlist = function () {
        return $http.get('/api/cart/orderlist');
    };

}]);