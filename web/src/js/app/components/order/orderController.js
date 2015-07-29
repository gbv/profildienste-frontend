pdApp.controller('OrderController', ['$scope', 'OrderService', '$location', '$http', '$rootScope', function($scope, OrderService, $location, $http, $rootScope) {

  $scope.orderComplete = false;

  OrderService.getOrderlist().then(function (data){
    $scope.orderlist = data.orderlist;
  }, function(reason){
    alert(reason);
    $location.path('cart');
  });

  this.order = function(){
    $http({
      method: 'POST',
      url: '/api/order',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        alert('Fehler: '+json.errormsg);
      }else{
        $scope.orderComplete = true;
        $rootScope.$broadcast('cartChange', json.cart, json.price);
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
