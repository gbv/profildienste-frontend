pdApp.service('InfoService', function($http, $q) {

  this.getAddInf = function(item){

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/info',
      data: $.param({id: item.id}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{
        def.resolve({
          type: json.type,
          content: json.content
        });
      }
    }).error(function(reason){
      def.reject(reason);
    });

    return def.promise;
  };

});