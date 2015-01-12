pdApp.service('CartService', function($http, $rootScope, $q, LoginService) {

  var defCart = $q.defer();

  LoginService.whenLoggedIn().then(function(data){
    $http.get('/api/user/cart').success(function(json){
      if(!json.success){
        defCart.reject(json.message);
      }else{

        defCart.resolve({
          cart: json.data.cart,
          price: json.data.price
        });

      }
    }).error(function(reason){
      defCart.reject(reason);
    });
  });

  this.getCart = function(){
    return defCart.promise;
  };

  this.addToCart = function(item){

    if(this.data === undefined){
      return;
    }

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/cart/add',
      data: $.param({
        id: item.id, 
        bdg: item.budget,
        lft: item.lft,
        selcode: item.selcode, 
        ssgnr: item.ssgnr, 
        comment: item.commentField
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{

        def.resolve({
          order: json.order
        });

        $rootScope.$broadcast('cartChange', json.content, json.price);

      }
    }.bind(this));

    return def.promise;
  };


  this.removeFromCart = function(item){

    if(this.data === undefined){
      return;
    }

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/cart/remove',
      data: $.param({id: item.id}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{

        this.data.cart = json.content;
        this.data.price = json.price;
      
        $rootScope.$broadcast('cartChange', this.data.cart, this.data.price);

        def.resolve();

      }
    }.bind(this));

    return def.promise;
  };

});