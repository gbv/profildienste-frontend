pdApp.controller('MenuController', function($scope, $rootScope, DataService, $modal, SelectService){

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
  };

  $scope.itemsSelected = (SelectService.getSelected().length > 0);
  $scope.showSelMenu = false;

  $rootScope.$on('itemSelected', function(){
    $scope.itemsSelected = true;
    $scope.selNumber = SelectService.getSelected().length;

    if($scope.selNumber == 1){
      $scope.showSelMenu = true;
    }
  });

  $rootScope.$on('itemDeselected', function(){

    $scope.selNumber = SelectService.getSelected().length;

    if($scope.selNumber == 0){
      $scope.itemsSelected = false;
      $scope.showSelMenu = false;
    }
  });

  this.toggleSelMenu = function(){
    $scope.showSelMenu = !$scope.showSelMenu;
  }

  this.selectAll = function(){
    SelectService.selectAll();
  }

  this.deselectAll = function(){
    SelectService.deselectAll();
  }

  this.rejectAll = function(){
    SelectService.rejectAll();
  }

});
