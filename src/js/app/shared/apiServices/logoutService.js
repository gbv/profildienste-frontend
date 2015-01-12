pdApp.service('LogoutService', function($window, $rootScope, $location) {

  var hasInfo = false;
  var info;

  this.destroySession = function(reason){

    if(reason !== undefined){
      hasInfo = true;
      info = reason;
    }
 
    $window.sessionStorage.removeItem('token');
    $rootScope.$broadcast('userLogout');
  };

  this.hasInfo = function(){
    return hasInfo;
  }

  this.getInfo = function(){
    return info;
  }
});