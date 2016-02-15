pdApp.service('InfoService', ['$http', '$q', 'Notification', function($http, $q, Notification) {

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

  this.openOPAC = function(item){

    $http({
      method: 'POST',
      url: '/api/opac',
      data: $.param({
        titel: item.titel,
        verfasser: item.verfasser
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        Notification.error('Es wurde kein OPAC Katalog für Ihre Bibliothek hinterlegt.');
      }else{
        window.open(json.data.url, '_blank');
      }
    }).error(function(reason){
      def.reject(reason);
    });
  };

}]);