pdApp.service('UserService', ['$http', '$q', 'LoginService', function($http, $q, LoginService) {

  var defUser = $q.defer();

  LoginService.whenLoggedIn().then(function(data){

    // Get name and budgets
    $http.get('/api/user/').success(function(json){
      if(!json.success){
        defUser.reject(json.message);
      }else{
        
        defUser.resolve({
          name: json.data.name,
          def_lft: json.data.def_lft,
          budgets: json.data.budgets
        });

      }
    }).error(function(reason){
      defUser.reject(reason);
    });

  });

  this.getUserData = function(){
    return defUser.promise;
  };

}]);