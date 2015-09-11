pdApp.controller('OrderController', ['$scope', 'OrderService', '$location', '$http', '$rootScope', 'Notification', function($scope, OrderService, $location, $http, $rootScope, Notification) {

  $scope.orderComplete = false;

  OrderService.getOrderlist().then(function (data){
    $scope.orderlist = data.orderlist;

    $rootScope.$broadcast('siteChanged', {
      site: 'order',
      watchlist: false
    });

    $rootScope.$broadcast('siteLoading');
    $rootScope.$broadcast('siteLoadingFinished', 0);

  }, function(reason){
    Notification.error(reason);
    $location.path('cart');
  });

  this.order = function(){
    $http({
      method: 'POST',
      url: '/api/order',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        Notification.error(json.errormsg);
      }else{
        $scope.orderComplete = true;
        $rootScope.$broadcast('cartChange', json.cart, json.price);
        $rootScope.$broadcast('siteChanged', {
          site: 'ordered',
          watchlist: false
        });
      }
    });
  };

  this.cancel = function(){
    $location.path('cart');
  };

  this.finish = function(){
    $location.path('main');
  };

}]);
