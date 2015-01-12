pdApp.service('CartService', function($http, $rootScope, $q, LoginService) {

  var defCart = $q.defer();

  LoginService.whenLoggedIn().then(function(data){
    $http.get('/api/user/cart').success(function(json){
      if(!json.success){
        defCart.reject(json.message);
      }else{

        this.data = json.data;

        defCart.resolve({
          cart: json.data.cart,
          price: json.data.price
        });

      }
    }.bind(this)).error(function(reason){
      defCart.reject(reason);
    });
  }.bind(this));

  this.getCart = function(){
    if(this.data === undefined){
      return defCart.promise;
    }else{
      var d = $q.defer();
      d.resolve({
        cart: this.data.cart,
        price: this.data.price
      });
      return d.promise;
    }
  };

  this.addToCart = function(item){

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