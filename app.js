var pdApp = angular.module('Profildienst', ['infinite-scroll', 'ui.bootstrap']);

// Load the entries
pdApp.factory('Entries', function($http) {

  var Entries = function(site) {
    this.items = [];
    this.loading = false;
    this.page = 0;
    this.site = site;
  };

  Entries.prototype.loadMore = function() {

    if (this.loading){
      return;
    }

    this.loading = true;
    var url = 'pageloader/'+this.site+'/page/'+this.page+'?callback=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
      var items = data.data;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }
      this.page++;
      this.loading = false;
    }.bind(this)).error(function(data, status, headers, config) {
      alert('error');
    });
  };

  return Entries;
});

pdApp.controller('MainController', function($scope, Entries) {

  $scope.entries = new Entries('overview');

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




pdApp.controller('ItemController', function($scope, $http, $sce, DataService, $modal){

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
    $scope.def_lft = data.def_lft;
  });

  this.addToCart = function(){
    DataService.addToCart($scope.item.id);
  };

  this.addToWL = function(wl){
    alert('wishlist mit der id '+wl);
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

    $http({
      method: 'POST',
      url: '/ajax/info',
      data: $.param({id: $scope.item.id}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        alert('Fehler: '+json.errormsg);
      }else{
            if (json.type == 'html'){
              $scope.addInf = $sce.trustAsHtml(json.content);
              $scope.addInfCollapsed = false;
            }else{ 
              window.open(json.content, '_blank');
            }
          }
    }.bind(this));
  };

  this.showCover = function(){

    var modalInstance = $modal.open({
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

pdApp.controller('MenuController', function($scope, $rootScope, DataService){

  DataService.getWatchlists().then(function(data){
    $scope.watchlists = data.watchlists;
    $scope.def_wl = data.def_wl;
  });

  DataService.getName().then(function(data){
    $scope.name = data.name;
  })

  DataService.getCart().then(function(data){
    $scope.cart = data.cart;
  })

  $rootScope.$on('cartChange', function(e, cart){
    $scope.cart = cart;
  });

  $rootScope.$on('watchlistChange', function(e, watchlists){
    $scope.watchlists = watchlists;
  });
});


pdApp.service('DataService', function($http, $rootScope, $q) {

  var defName = $q.defer();
  var defCart = $q.defer();
  var defWatchlists = $q.defer();
  var defOrderDetails = $q.defer();


  var promise = $http.jsonp('/user/?callback=JSON_CALLBACK').success(function(data) {

    defName.resolve({
      name: data.data.name
    });

    defCart.resolve({
      cart: data.data.cart
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
        cart: this.data.cart
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

  this.addToCart = function(id){
    this.data.cart++;
    $rootScope.$broadcast('cartChange', this.data.cart);
  }

  /*
  this.addToWatchlist = function(id, wl){
    //alert('DataService '+id);
    // Anfrage
    this.data.cart++;
    $rootScope.$broadcast('cartChange', this.data.cart);
  } */

});

