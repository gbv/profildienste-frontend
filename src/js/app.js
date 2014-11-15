var pdApp = angular.module('Profildienst', ['infinite-scroll', 'ui.bootstrap']);

pdApp.controller('MainController', function($scope, Entries, Userdata) {
  $scope.entries = new Entries('pageloader/overview/page/1?callback=JSON_CALLBACK');


  Userdata.getData().then(function(d){
    $scope.user = d.data.data;
  });

});

pdApp.filter('notEmpty', function(){
  return function(val){
    return val !== undefined && val !== null;
  };
});


// Load the entries
pdApp.factory('Entries', function($http) {
  var Entries = function(url) {
    this.items = [];
    this.loading = false;
    this.page = 0;
    this.url = url;
  };

  Entries.prototype.nextPage = function() {
    if (this.loading){
      return;
    }

    this.loading = true;
    $http.jsonp(this.url).success(function(data) {
      var items = data.data;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }
      this.page++;
      this.loading = false;
    }.bind(this));
  };

  return Entries;
});


pdApp.controller('ItemController', function($scope){

  $scope.addInfCollapsed = true;
  $scope.CommentCollapsed = true;


  this.addToCart = function(){
    alert('Mein Controller item: '+$scope.item.id);
    if($scope.item.options.rm_ct){
      alert('Ich sollte ausgeblendet werden');
    }else{
      alert('Ich darf bleiben');
    }
    $scope.item.status.cart = true;
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

// Load user related data
pdApp.factory('Userdata', function($http) {
  var promise;
  var url = 'http://test.dev/dataprovider.php?jsonp=JSON_CALLBACK';
  var userData = {
    getData: function(){
      if (!promise){
        promise = $http.jsonp(url).success(function(data) {
          return data.data;
        });
      }

      return promise;
    }
  };

  return userData;
});
