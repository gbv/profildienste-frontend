pdApp.service('ConfigService', function($q){

  var config;
  var entries;
  var defConfig = $q.defer();
  var defEntries = $q.defer();

  this.getConfig = function(){
    return defConfig.promise;
  };

  this.setConfig = function(c){
    config = c;
    defConfig.resolve({
      config: config
    });
  };

  this.getEntries = function(){
    return defEntries.promise;
  };

  this.setEntries = function(e){
    entries = e;
    defEntries.resolve({
      entries: entries
    });
  };

});