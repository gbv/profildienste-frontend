pdApp.service('OrderService', ['$http', '$q', 'LoginService', function($http, $q, LoginService) {

  var defOrder = $q.defer();

  LoginService.whenLoggedIn().then(function(data){
    $http.get('/api/user/orderlist').success(function(json){
      if(!json.success){
        defOrder.reject(json.message);
      }else{

        defOrder.resolve({
          orderlist: json.data.orderlist
        });

      }
    }.bind(this)).error(function(reason){
      defCart.reject(reason);
    });
  }.bind(this));

  this.getOrderlist = function(){
    return defOrder.promise;
  };

}]);