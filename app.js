var pdApp = angular.module('Profildienst', ['infinite-scroll', 'ui.bootstrap']);

// Load the entries
pdApp.factory('Entries', function($http) {

  var Entries = function(url) {
    this.items = [];
    this.loading = false;
    this.page = 0;
    this.url = url;
  };

  Entries.prototype.loadMore = function() {

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
    }.bind(this)).error(function(data, status, headers, config) {
      alert('error');
    });
  };

  return Entries;
});

pdApp.controller('MainController', function($scope, Entries) {

  $scope.entries = new Entries('pageloader/overview/page/1?callback=JSON_CALLBACK');

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




pdApp.controller('ItemController', function($scope, $http, $sce){

  $scope.bibInfCollapsed = true;
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
  };

  this.openOPAC = function(){
    window.open('/opac/'+$scope.item.titel+' '+$scope.item.verfasser, '_blank');
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

/*
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

*/