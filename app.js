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

  return Entries;
});

pdApp.controller('ErrorModalCtrl', function ($scope, $modalInstance) {

  $scope.redirect = function () {
    window.location.href = '/';
  };

});


pdApp.controller('MainController', function($scope, Entries) {

  $scope.entries = new Entries('cart');

  $scope.title = 'Test';

  $scope.config = {
    itemsRejectable: true,
    allowComments: true,
    showInputs: true
  };

});

pdApp.filter('notEmpty', function(){
  return function(val){
    return val !== undefined && val !== null;
  };
});




pdApp.controller('ItemController', function($scope, $sce, DataService, $modal){

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

  this.addToCart = function(){
    DataService.addToCart($scope.item).then(function(data){
      $scope.item.status.cart = true;
      $scope.item.lft = data.order.lft;
      $scope.item.budget = data.order.budget;
      $scope.item.selcode = data.order.selcode;
      $scope.item.ssgnr = data.order.ssgnr;
      $scope.item.comment = data.order.comment;
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
    },
    function(reason){
      alert('Fehler: '+reason);
    });
  }

  this.removeFromWL = function(){
    DataService.removeFromWatchlist($scope.item).then(function(data){
      $scope.item.status.watchlist.watched = false;
    },
    function(reason){
      alert('Fehler: '+reason);
    });
  }

  this.removeFromCart = function(){
    DataService.removeFromCart($scope.item).then(function(data){
      $scope.item.status.cart = false;
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

  this.showInpField = function(){
    return !$scope.item.status.done && !$scope.item.status.rejected && !$scope.item.status.cart;
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

pdApp.controller('HelpController', function ($scope, $modalInstance) {

  $scope.cancel = function () {
    $modalInstance.close();
  };

});


pdApp.service('DataService', function($http, $rootScope, $q) {

  var defName = $q.defer();
  var defCart = $q.defer();
  var defWatchlists = $q.defer();
  var defOrderDetails = $q.defer();


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

    return data.data;
  }).error(function(data){
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

});

