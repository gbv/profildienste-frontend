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

pdApp.factory('authInterceptor', function ($rootScope, $q, $window, $location) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }

      return config;
    },

    responseError: function(rejection) {

      if (rejection.status === 401) {
        $window.sessionStorage.removeItem('token');
        $location.path('/');
      }
      return $q.reject(rejection);
    }
  };
});

pdApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});