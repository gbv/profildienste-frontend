var pdApp = angular.module('Profildienst', ['infinite-scroll', 'ui.bootstrap', 'ngRoute']);

pdApp.filter('notEmpty', function(){
  return function(val){
    return val !== undefined && val !== null;
  };
});

pdApp.constant('version', '1.0');

pdApp.controller('ErrorModalCtrl', function ($scope, $modalInstance, $location, $rootScope) {

  $scope.redirect = function () {
  	$location.path('/');
  	$modalInstance.close();
  	$rootScope.token = undefined;
  };

});

pdApp.factory('authInterceptor', function ($rootScope, $q, $window, LogoutService) {
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
        LogoutService.destroySession('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an um fortzufahren.');
      }
      return $q.reject(rejection);
    }
  };
});

pdApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});