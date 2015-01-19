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


// Overwrite the Angular Bootstrap popover template to allow HTML
// (see http://stackoverflow.com/a/21979258)
pdApp.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);

angular.module('template/popover/popover.html', []).run(['$templateCache', function ($templateCache) {
  $templateCache.put('template/popover/popover.html',
    '<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n' +
    '  <div class=\"arrow\"></div>\n' +
    '\n' +
    '  <div class=\"popover-inner\">\n' +
    '      <h3 class=\"popover-title\" ng-bind-html=\"title | unsafe\" ng-show=\"title\"></h3>\n' +
    '      <div class=\"popover-content\"ng-bind-html=\"content | unsafe\"></div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);