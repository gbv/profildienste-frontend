var pdApp = angular.module('Profildienst', ['infinite-scroll', 'ui.bootstrap']);

pdApp.filter('notEmpty', function(){
  return function(val){
    return val !== undefined && val !== null;
  };
});

pdApp.controller('ErrorModalCtrl', function ($scope, $modalInstance) {

  $scope.redirect = function () {
    window.location.href = '/';
  };

});