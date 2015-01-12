pdApp.service('RejectService', function($http, $rootScope, $q) {

  this.addRejected = function(item){
    return this.addMultRejected([item]);    
  }.bind(this);

  this.addMultRejected = function(items){

    var ids = [];
    for(var i=0; i < items.length; i++){
      ids.push(items[i].id);
    }

    if(ids.length == 0){
      return;
    }

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/reject/add',
      data: $.param({
        id: ids
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{
        def.resolve();
      }
    }.bind(this));

    return def.promise;
  }

  this.removeRejected = function(item){

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/reject/remove',
      data: $.param({
        id: item.id
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{
        def.resolve();
      }
    }.bind(this));

    return def.promise;
  }


});