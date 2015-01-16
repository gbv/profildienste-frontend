pdApp.controller('ItemController', function($scope, $sce, WatchlistService, CartService, $modal, ConfigService, $rootScope, SelectService, InfoService, RejectService, UserService, $timeout){

  $scope.bibInfCollapsed = true;
  $scope.addInfCollapsed = true;
  $scope.CommentCollapsed = true;

  $scope.item.preis = $sce.trustAsHtml($scope.item.preis);


  WatchlistService.getWatchlists().then(function (data){
    $scope.watchlists = data.watchlists;
    $scope.def_wl = data.def_wl;

  });

  UserService.getUserData().then(function (data){
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

  $rootScope.$on('selectAll', function(){
    if(this.isRejectable() && !$scope.item.status.selected){
      SelectService.select($scope.item);
    }
  }.bind(this));

  this.addToCart = function(){
    CartService.addToCart($scope.item).then(function(data){
      $scope.item.status.cart = true;
      $scope.item.lft = data.order.lft;
      $scope.item.budget = data.order.budget;
      $scope.item.selcode = data.order.selcode;
      $scope.item.ssgnr = data.order.ssgnr;
      $scope.item.comment = data.order.comment;

      SelectService.deselect($scope.item);

      if($scope.config.hideCart){
        $scope.entries.removeItem($scope.item);
      }
    },
    function(reason){
      alert('Fehler: '+reason);
    });
  };

  this.addToWL = function(wl){
    WatchlistService.addToWatchlist($scope.item, wl).then(function(data){
      $scope.item.status.watchlist.watched = true;
      $scope.item.status.watchlist.name = data.name;
      $scope.item.status.watchlist.id = data.id;

      SelectService.deselect($scope.item);

      if($scope.config.hideWatchlist){
        $scope.entries.removeItem($scope.item);
      }
    },
    function(reason){
      alert('Fehler: '+reason);
    });
  }

  this.removeFromWL = function(){
    WatchlistService.removeFromWatchlist($scope.item).then(function(data){
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
    CartService.removeFromCart($scope.item).then(function(data){
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
      SelectService.deselect($scope.item);
    }else{
      SelectService.select($scope.item);
    }
  };

  this.openOPAC = function(){
    InfoService.openOPAC($scope.item);
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

    InfoService.getAddInf($scope.item).then(function(data){
        if (data.type === 'html'){
          $scope.addInf = $sce.trustAsHtml(data.content);
          // dirty but needed
          $timeout(function(){$scope.addInfCollapsed = false; }, 100);
        }else{ 
          window.open(data.content, '_blank');
        }
    },
    function(reason){
      alert('Fehler: '+reason);
    });
  };

  this.addRejected = function(){
    RejectService.addRejected($scope.item).then(function(data){
      $scope.item.status.rejected = true;

      SelectService.deselect($scope.item);

      if($scope.config.hideRejected){
        $scope.entries.removeItem($scope.item);
      }
    }, function(reason){
      alert('Fehler: '+reason);
    });
  }

  this.removeRejected = function(){
    RejectService.removeRejected($scope.item).then(function(data){
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