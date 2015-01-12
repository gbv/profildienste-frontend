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
    var tmp = hasInfo;
    hasInfo = false;
    return tmp;
  }

  this.getInfo = function(){
    return info;
  }
});