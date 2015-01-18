pdApp.controller('OrderController', function($scope, OrderService, $location) {

  OrderService.getOrderlist().then(function (data){
    $scope.orderlist = data.orderlist;
    console.log(data.orderlist);
  }, function(reason){
    alert(reason);
    $location.path('cart');
  });
  
  this.order = function(){
    alert('order');
  };

  this.cancel = function(){
    alert('cancel');
  }
});