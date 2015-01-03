pdApp.service('ConfigService', function($q){

  var config;
  var entries;
  var defConfig = $q.defer();
  var defEntries = $q.defer();

  this.getConfig = function(){
    if(config === undefined){
      return defConfig.promise;
    }else{
      var def = $q.defer();
      def.resolve({
        config: config
      });
      return def.promise;
    }
  };

  this.setConfig = function(c){
    config = c;

    defConfig.resolve({
      config: config
    });
  };

  this.getEntries = function(){
    if(entries === undefined){
      return defEntries.promise;
    }else{
      var def = $q.defer();
      def.resolve({
        entries: entries
      });
      return def.promise;
    }
  };

  this.setEntries = function(e){
    entries = e;
    
    defEntries.resolve({
      entries: entries
    });
  };

});