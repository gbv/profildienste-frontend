pdApp.controller('OrderController', function($scope, OrderService, $location) {

  $scope.orderComplete = false;

  OrderService.getOrderlist().then(function (data){
    $scope.orderlist = data.orderlist;
  }, function(reason){
    alert(reason);
    $location.path('cart');
  });
  
  this.order = function(){
    alert('order');
    $scope.orderComplete = true;
  };

  this.cancel = function(){
    $location.path('cart');
  }

  this.finish = function(){
    $location.path('/main');
  }
});