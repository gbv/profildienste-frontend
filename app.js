var pdApp = angular.module('Profildienst', ['infinite-scroll', 'ui.bootstrap']);

// Load the entries
pdApp.factory('Entries', function($http, $modal) {

  var Entries = function(site) {
    this.items = [];
    this.loading = false;
    this.page = 0;
    this.site = site;
    this.more = true;
  };

  Entries.prototype.loadMore = function() {

    if (!this.more || this.loading){
      return;
    }

    this.loading = true;
    var url = '/api/get/'+this.site+'/page/'+this.page+'?callback=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
      var items = data.data;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }
      this.page++;
      this.loading = false;
      this.more = data.more;
    }.bind(this)).error(function(data, status, headers, config) {

      $modal.open({
        templateUrl: 'errorModal.html',
        controller: 'ErrorModalCtrl',
        keyboard: false
      });

    });
  };

  Entries.prototype.removeItem = function(item) {
    for(var i = 0; i < this.items.length; i++){
      if(this.items[i] === item){
        this.items.splice(i, 1);
      }
    }
  }

  Entries.prototype.reset = function() {
    this.page = 0;
    this.items = [];
    this.more = true;
    this.loadMore();
  }

  return Entries;
});

pdApp.directive('ngOptionbar', function() {
  return {
    restrict: 'E',
    templateUrl: '/template/ui/optionbar.html'
  };
});

pdApp.service('ConfigService', function($q){

  var config;
  var entries;
  var defConfig = $q.defer();
  var defEntries = $q.defer();

  this.getConfig = function(){
    return defConfig.promise;
  };

  this.setConfig = function(c){
    config = c;
    defConfig.resolve({
      config: config
    });
  };

  this.getEntries = function(){
    return defEntries.promise;
  };

  this.setEntries = function(e){
    entries = e;
    defEntries.resolve({
      entries: entries
    });
  };

});

pdApp.controller('ErrorModalCtrl', function ($scope, $modalInstance) {

  $scope.redirect = function () {
    window.location.href = '/';
  };

});


pdApp.controller('MainController', function($scope, Entries, ConfigService) {

  $scope.entries = new Entries('overview');

  $scope.title = 'Test';

  var config = {
    hideWatchlist: false,
    hideCart: true,
    hideRejected: true,
    rejectPossible: true
  };

  ConfigService.setConfig(config);
  ConfigService.setEntries($scope.entries);

});

pdApp.filter('notEmpty', function(){
  return function(val){
    return val !== undefined && val !== null;
  };
});




pdApp.controller('ItemController', function($scope, $sce, DataService, $modal, ConfigService){

  $scope.bibInfCollapsed = true;
  $scope.addInfCollapsed = true;
  $scope.CommentCollapsed = true;

  $scope.item.preis = $sce.trustAsHtml($scope.item.preis);


  DataService.getWatchlists().then(function (data){
    $scope.watchlists = data.watchlists;
    $scope.def_wl = data.def_wl;

  });

  DataService.getOrderDetails().then(function (data){
    $scope.budgets = data.budgets;
    $scope.item.budget = data.budgets[0].key;
    $scope.item.lft = data.def_lft;
  });

  ConfigService.getConfig().then(function (data){
    $scope.config = data.config;
  });

  ConfigService.getEntries().then(function (data){
    $scope.entries = data.entries;
  });

  this.addToCart = function(){
    DataService.addToCart($scope.item).then(function(data){
      $scope.item.status.cart = true;
      $scope.item.lft = data.order.lft;
      $scope.item.budget = data.order.budget;
      $scope.item.selcode = data.order.selcode;
      $scope.item.ssgnr = data.order.ssgnr;
      $scope.item.comment = data.order.comment;

      $scope.item.status.selected = false;

      if($scope.config.hideCart){
        $scope.entries.removeItem($scope.item);
      }
    },
    function(reason){
      alert('Fehler: '+reason);
    });
  };

  this.addToWL = function(wl){
    DataService.addToWatchlist($scope.item, wl).then(function(data){
      $scope.item.status.watchlist.watched = true;
      $scope.item.status.watchlist.name = data.name;
      $scope.item.status.watchlist.id = data.id;

      $scope.item.status.selected = false;

      if($scope.config.hideWatchlist){
        $scope.entries.removeItem($scope.item);
      }
    },
    function(reason){
      alert('Fehler: '+reason);
    });
  }

  this.removeFromWL = function(){
    DataService.removeFromWatchlist($scope.item).then(function(data){
      $scope.item.status.watchlist.watched = false;

      if($scope.config.hideWatchlist){
        $scope.entries.removeItem($scope.item);
      }
    },
    function(reason){
      alert('Fehler: '+reason);
    });
  }

  this.removeFromCart = function(){
    DataService.removeFromCart($scope.item).then(function(data){
      $scope.item.status.cart = false;

      if($scope.config.hideCart){
        $scope.entries.removeItem($scope.item);
      }
    },
    function(reason){
      alert('Fehler: '+reason);
    });
  }

  this.toggleSelect = function(){
    if($scope.item.status.selected){
      $scope.item.status.selected = false;
    }else{
      $scope.item.status.selected = true;
    }
  };

  this.openOPAC = function(){
    window.open('/opac/'+$scope.item.titel+' '+$scope.item.verfasser, '_blank');
  };

  this.closeComment = function(){
    if($scope.item.commentField === undefined ||  $scope.item.commentField === ''){
      $scope.CommentCollapsed = true;
    }
  };


  this.getAddInf = function(){

    if($scope.addInf !== undefined){
      $scope.addInfCollapsed = !$scope.addInfCollapsed;
      return;
    }

    DataService.getAddInf($scope.item).then(function(data){
        if (data.type === 'html'){
          $scope.addInf = $sce.trustAsHtml(data.content);
          $scope.addInfCollapsed = false;
        }else{ 
          window.open(data.content, '_blank');
        }
    },
    function(reason){
      alert('Fehler: '+reason);
    });
  };

  this.addRejected = function(){
    DataService.addRejected($scope.item).then(function(data){
      $scope.item.status.rejected = true;

      $scope.item.status.selected = false;

      if($scope.config.hideRejected){
        $scope.entries.removeItem($scope.item);
      }
    }, function(reason){
      alert('Fehler: '+reason);
    });
  }

  this.removeRejected = function(){
    DataService.removeRejected($scope.item).then(function(data){
      $scope.item.status.rejected = false;

      if($scope.config.hideRejected){
        $scope.entries.removeItem($scope.item);
      }
    }, function(reason){
      alert('Fehler: '+reason);
    });
  }

  this.showCover = function(){

    $modal.open({
      templateUrl: 'coverModal.html',
      controller: 'CoverModalCtrl',
      resolve: {
        cover: function(){
          return $scope.item.cover_lg;
        }
      }
    });

  }


  this.showNoTopBtn = function(){
    return $scope.item.status.done || $scope.item.status.rejected;
  };

  this.showCartBtn = function(){
    return !$scope.item.status.done && !$scope.item.status.rejected && !$scope.item.status.cart;
  };

  this.showCartBtnRem = function(){
    return !$scope.item.status.done && !$scope.item.status.rejected && $scope.item.status.cart;
  };

  this.showOrderFields = function(){
    return !($scope.item.status.rejected);
  };

  this.showInpField = function(){
    return this.showOrderFields() && !$scope.item.status.cart && !$scope.item.status.done;
  };

  this.isRejectable = function(){
    return !$scope.item.status.rejected && !$scope.item.status.cart && !$scope.item.status.watchlist.watched && !$scope.item.status.done;
  };

  this.showWatchlistBtn = function(){
    return !$scope.item.status.done && !$scope.item.status.rejected && !$scope.item.status.watchlist.watched;
  };

  this.showWatchlistRemBtn = function(){
    return !$scope.item.status.done && !$scope.item.status.rejected && $scope.item.status.watchlist.watched;
  };
});

pdApp.controller('CoverModalCtrl', function ($scope, $modalInstance, cover) {

  $scope.cover = cover;

  $scope.close = function () {
    $modalInstance.close();
  };

});

pdApp.controller('MenuController', function($scope, $rootScope, DataService, $modal){

  DataService.getWatchlists().then(function(data){
    $scope.watchlists = data.watchlists;
    $scope.def_wl = data.def_wl;
  });

  DataService.getName().then(function(data){
    $scope.name = data.name;
  })

  DataService.getCart().then(function(data){
    $scope.cart = data.cart;
    $scope.price = data.price
  })

  $rootScope.$on('cartChange', function(e, cart, price){
    $scope.cart = cart;
    $scope.price = price;
  });

  $rootScope.$on('watchlistChange', function(e, watchlists){
    $scope.watchlists = watchlists;
  });

  this.openHelp = function(){

    $modal.open({
      templateUrl: '/assets/html/help.html',
      controller: 'HelpController'
    });
  }
});

pdApp.controller('HelpController', function($scope, $modalInstance) {

  $scope.cancel = function () {
    $modalInstance.close();
  };

});

pdApp.controller('OptionController', function($scope, DataService, ConfigService, $q) {

  var p =  $q.all([DataService.getSortby(), DataService.getOrder(), DataService.getSelOptions(), ConfigService.getConfig(), ConfigService.getEntries()]);

  p.then(function(data){

    $scope.sortby = data[0].sortby;
    $scope.order = data[1].order;

    $scope.selected_sorter_key = data[2].sort;
    for(var i=0; i < data[0].sortby.length; i++){
      if(data[0].sortby[i].key === data[2].sort){
        $scope.selected_sorter = data[0].sortby[i].value;
        break;
      }
    }

    $scope.selected_order_key = data[2].order;
    for(var i=0; i < data[1].order.length; i++){
      if(data[1].order[i].key === data[2].order){
        $scope.selected_order = data[1].order[i].value;
        break;
      }
    }

    $scope.showSelectAll = data[3].config.rejectPossible;

    $scope.entries = data[4].entries;


  }, function(reason){
    alert('Fehler: '+reason);
  });

  this.setSorter = function (sorter){

    if(sorter === $scope.selected_sorter_key){
      return;
    }

    DataService.changeSetting('sortby', sorter).then(function(data){

      $scope.selected_sorter_key = data.value;
      for(var i=0; i < $scope.sortby.length; i++){
        if($scope.sortby[i].key === data.value){
          $scope.selected_sorter = $scope.sortby[i].value;
          break;
        }
      }

      $scope.entries.reset();

    }, function(reason){
      alert('Fehler: '+reason);
    });
    
  }

  this.setOrder = function (order){

    if(order === $scope.selected_order_key){
      return;
    }

    DataService.changeSetting('order', order).then(function(data){

      $scope.selected_order_key = data.value;
      for(var i=0; i < $scope.order.length; i++){
        if($scope.order[i].key === data.value){
          $scope.selected_order = $scope.order[i].value;
          break;
        }
      }

      $scope.entries.reset();

    }, function(reason){
      alert('Fehler: '+reason);
    });
    
  }

});


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
      }
    }.bind(this));

    return def.promise;
  }

});

