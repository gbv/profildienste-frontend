pdApp.service('DataService', function($http, $rootScope, $q) {

  var defName = $q.defer();
  var defCart = $q.defer();
  var defWatchlists = $q.defer();
  var defOrderDetails = $q.defer();
  var defSelOptions = $q.defer();

  var defSort = $q.defer();
  var defOrder = $q.defer();

  var optPromise = $http.jsonp('/api/settings?callback=JSON_CALLBACK').success(function(data){

    defSort.resolve({
      sortby: data.data.sortby
    });

     defOrder.resolve({
      order: data.data.order
    });

  }).error(function(reason){
    // handling here
  });

  var promise = $http.jsonp('/api/user?callback=JSON_CALLBACK').success(function(data) {

    defName.resolve({
      name: data.data.name
    });

    defCart.resolve({
      cart: data.data.cart,
      price: data.data.price
    });

    defWatchlists.resolve({
      watchlists: data.data.watchlists,
      def_wl: data.data.def_wl
    });

    defOrderDetails.resolve({
      budgets: data.data.budgets,
      def_lft: data.data.def_lft
    });

    defSelOptions.resolve({
      sort: data.data.settings.sortby,
      order: data.data.settings.order
    });

    return data.data;
  }).error(function(reason){
    //error handling here
  });

  promise.then(function (d){
    this.data = d.data.data;
  }.bind(this));

  this.getWatchlists = function(){
    if(this.data === undefined){
      return defWatchlists.promise;
    }else{
      var d = $q.defer();
      d.resolve({
        watchlists: this.data.watchlists,
        def_wl: this.data.def_wl
      });
      return d.promise;
    }
  }

  this.getOrder = function(){
    return defOrder.promise;
  }

  this.getSortby = function(){
    return defSort.promise;
  }

  this.getSelOptions = function(){
    
    if(this.data === undefined){
      return defSelOptions.promise;
    }else{
      var d = $q.defer();
      d.resolve({
        sort: this.data.settings.sortby,
        order: this.data.settings.order
      });
      return d.promise;
    }
  }

  this.getName = function(){
    return defName.promise;
  }

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
    
  }

  this.getOrderDetails = function(){
    if(this.data === undefined){
      return defOrderDetails.promise;
    }else{
      var d = $q.defer();
      d.resolve({
        budgets: this.data.budgets,
        def_lft: this.data.def_lft
      });
      return d.promise;
    }
    
  }

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
  }

  this.getAddInf = function(item){

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/info',
      data: $.param({id: item.id}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{
        def.resolve({
          type: json.type,
          content: json.content
        });
      }
    });

    return def.promise;
  }


  this.addToWatchlist = function(item, wl){

    if(this.data === undefined){
      return;
    }

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/watchlist/add',
      data: $.param({id: item.id, wl: wl}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{

        var name;
        for(var i=0; i < this.data.watchlists.length; i++){
          if(this.data.watchlists[i].id == wl){
            this.data.watchlists[i].count = json.content;
            name = this.data.watchlists[i].name;
            $rootScope.$broadcast('watchlistChange', this.data.watchlists);
            break;
          }
        }

        def.resolve({
          content: json.content,
          id: wl,
          name: name
        });

      }
    }.bind(this));

    return def.promise;
  }

  this.removeFromWatchlist = function(item){

    if(this.data === undefined){
      return;
    }

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/watchlist/remove',
      data: $.param({id: item.id, wl: item.status.watchlist.id}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{

        for(var i=0; i < this.data.watchlists.length; i++){
          if(this.data.watchlists[i].id == item.status.watchlist.id){
            this.data.watchlists[i].count = json.content;
            $rootScope.$broadcast('watchlistChange', this.data.watchlists);
            break;
          }
        }

        def.resolve();

      }
    }.bind(this));

    return def.promise;
  }

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
  }


  this.addRejected = function(item){

    if(this.data === undefined){
      return;
    }

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/reject/add',
      data: $.param({
        id: [item.id]
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{
        def.resolve();
      }
    }.bind(this));

    return def.promise;
  }


  this.addRejected = function(item){
    return this.addMultRejected([item]);    
  }.bind(this);

  this.addMultRejected = function(items){

    if(this.data === undefined){
      return;
    }
    var ids = [];
    for(var i=0; i < items.length; i++){
      ids.push(items[i].id);
    }

    if(ids.length == 0){
      return;
    }

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/reject/add',
      data: $.param({
        id: ids
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{
        def.resolve();
      }
    }.bind(this));

    return def.promise;
  }

  this.removeRejected = function(item){

    if(this.data === undefined){
      return;
    }

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/reject/remove',
      data: $.param({
        id: item.id
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{
        def.resolve();
      }
    }.bind(this));

    return def.promise;
  }

  this.changeSetting = function(type, value){

    if(this.data === undefined){
      return;
    }

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/settings',
      data: $.param({
        type: type,
        value: value
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{
        def.resolve({
          type: json.type,
          value: json.value
        });

        if(type === 'sortby'){
          this.data.settings.sortby = value;
        }else if(type === 'order'){
          this.data.settings.order = value;
        }

      }
    }.bind(this));

    return def.promise;
  }

});