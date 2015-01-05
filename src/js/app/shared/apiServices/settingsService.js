pdApp.service('SettingsService', function($http, $rootScope, $q) {

  var defSort = $q.defer();
  var defOrder = $q.defer();
  var promise;

  this.init = function(){

    promise = $http.jsonp('/api/settings?callback=JSON_CALLBACK').success(function(data){

      defSort.resolve({
        sortby: data.data.sortby
      });

       defOrder.resolve({
        order: data.data.order
      });

    }).error(function(reason){
      defSort.reject(reason);
      defOrder.reject(reason);
    });
  }

  this.getOrder = function(){

    if(promise === undefined){
      this.init();
    }

    return defOrder.promise;
  }

  this.getSortby = function(){

    if(promise === undefined){
      this.init();
    }

    return defSort.promise;
  }

  this.changeSetting = function(type, value){

    if(this.data === undefined){
      return;
    }

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/settings',
      data: $.param({
        type: type,
        value: value
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{
        def.resolve({
          type: json.type,
          value: json.value
        });

        if(type === 'sortby'){
          this.data.settings.sortby = value;
        }else if(type === 'order'){
          this.data.settings.order = value;
        }

      }
    }.bind(this));

    return def.promise;
  }

});