pdApp.controller('HeaderController', ['$scope', '$rootScope', 'LoginService', '$location','$http', 'Notification', function($scope, $rootScope, LoginService, $location, $http, Notification) {
  $scope.title = '';
  $scope.icon = '';
  $scope.site = 'main';

  $scope.loading = true;
  $scope.total = 0;

  var titles = {
    overview : {
      title: 'Gesamtübersicht Neuerscheinungen',
      icon: ''
    },
    cart: {
      title: 'Warenkorb',
      icon: 'fa-shopping-cart'
    },
    pending: {
      title: 'In Bearbeitung',
      icon: 'fa-tasks'
    },
    rejected: {
      title: 'Abgelehnt',
      icon: 'fa-minus-circle'
    },
    done: {
      title: 'Bearbeitet',
      icon: 'fa-check'
    },
    manage: {
      title: 'Verwaltung Ihrer Merklisten',
      icon: 'fa-star'
    },
    order: {
      title: 'Bestätigung',
      icon: 'fa-shopping-cart'
    },
    ordered: {
      title: 'Vorgang erfolgreich abgeschlossen',
      icon: 'fa-check'
    },
    search: {
      title: 'Suche',
      icon: 'fa-search'
    }
  };

  $rootScope.$on('siteChanged', function (ev, site){

    $scope.site = site.site;

    if(!site.watchlist){

      var title = titles[site.site];

      $scope.title = title.title;
      $scope.icon = title.icon;

    }else{

      $scope.title = site.site;
      $scope.icon = 'fa-star';

    }

    $scope.total = 0;
  });

  $rootScope.$on('siteLoading', function (ev){
    $scope.loading = true;
  });

  $rootScope.$on('siteLoadingFinished', function (ev, total){
    $scope.loading = false;
    $scope.total = total;
  });

  $scope.loggedIn = false;

  LoginService.whenLoggedIn().then(function(data){
    $scope.loggedIn = true;
  });

  $rootScope.$on('userLogin', function(e){
    $scope.loggedIn = true;
  });

  $rootScope.$on('userLogout', function(e){
    $scope.loggedIn = false;
  });

  this.showCartContinue = function(){
    return ($scope.site === 'cart' && $scope.total > 0);
  };

  this.cartContinue = function(){
    $location.path('order');
  };

  this.showDeletePermanently = function(){
    return ($scope.site === 'rejected' && $scope.total > 0);
  };

  this.deletePermanently = function(){
    $http({
      method: 'POST',
      url: '/api/delete',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        Notification.error(json.errormsg);
      }else{
        $location.path('/main');
      }
    }.bind(this));
  };

  this.showManageWatchlists = function(){
    return (!$scope.loading && $scope.site === 'manage');
  };

  this.showOrderConfirmation = function(){
    return (!$scope.loading && $scope.site === 'order');
  };

  this.showOrderedConfirmation = function(){
    return (!$scope.loading && $scope.site === 'ordered');
  };

  this.showSearchResults = function(){
    return (!$scope.loading && $scope.site === 'search' && $scope.total > 0);
  };

  this.showSearchNoResults = function(){
    return (!$scope.loading && $scope.site === 'search' && $scope.total === 0);
  };

  this.showSearchGettingStarted = function(){
    return (!$scope.loading && $scope.site === 'search' && $scope.total === -2);
  }

  this.showError = function(){
    return ($scope.total === -1);
  };

  this.showEntriesInformation = function(){
    return (!$scope.loading && !this.showError() && !this.showManageWatchlists() && !this.showOrderConfirmation() && !this.showOrderedConfirmation() && !this.showSearchResults() && !this.showSearchNoResults() && !this.showSearchGettingStarted());
  };

}]);