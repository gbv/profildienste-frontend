var pdApp = angular.module('Profildienst', ['infinite-scroll', 'ui.bootstrap', 'ngRoute']);

pdApp.filter('notEmpty', function(){
  return function(val){
    return val !== undefined && val !== null;
  };
});

pdApp.constant('version', '1.0');

pdApp.controller('ErrorModalCtrl', function ($scope, $modalInstance, $location, $rootScope) {

  $scope.redirect = function () {
  	$location.path('login');
  	$modalInstance.close();
  	$rootScope.token = undefined;
  };

});

pdApp.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        alert('Not authenticated!');
      }
      return response || $q.when(response);
    }
  };
});

pdApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});