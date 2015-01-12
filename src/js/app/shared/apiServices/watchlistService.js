pdApp.service('WatchlistService', function($http, $rootScope, $q, LoginService) {

  var defWatchlists = $q.defer();

  LoginService.whenLoggedIn().then(function(data){
    $http.get('/api/user/watchlists').success(function(json){
      if(!json.success){
        defWatchlists.reject(json.message);
      }else{

        this.data = json.data;
        
        defWatchlists.resolve({
          watchlists: json.data.watchlists,
          def_wl: json.data.def_wl
        });

      }
    }.bind(this)).error(function(reason){
      defWatchlists.reject(reason);
    });
  }.bind(this));

  this.getWatchlists = function(){
    if(this.data === undefined){
      return defWatchlists.promise;
    }else{
      var d = $q.defer();
      d.resolve({
        watchlists: this.data.watchlists,
        def_wl: this.data.def_wl
      });
      return d.promise;
    }
  };

  this.removeFromWatchlist = function(item){

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/watchlist/remove',
      data: $.param({id: item.id, wl: item.status.watchlist.id}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{

        for(var i=0; i < this.data.watchlists.length; i++){
          if(this.data.watchlists[i].id == item.status.watchlist.id){
            this.data.watchlists[i].count = json.content;
            $rootScope.$broadcast('watchlistChange', this.data.watchlists);
            break;
          }
        }

        def.resolve();

      }
    }.bind(this));

    return def.promise;
  };


  this.addToWatchlist = function(item, wl){

    var def = $q.defer();

    $http({
      method: 'POST',
      url: '/api/watchlist/add',
      data: $.param({id: item.id, wl: wl}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        def.reject(json.errormsg);
      }else{

        var name;
        for(var i=0; i < this.data.watchlists.length; i++){
          if(this.data.watchlists[i].id == wl){
            this.data.watchlists[i].count = json.content;
            name = this.data.watchlists[i].name;
            $rootScope.$broadcast('watchlistChange', this.data.watchlists);
            break;
          }
        }

        def.resolve({
          content: json.content,
          id: wl,
          name: name
        });

      }
    }.bind(this));

    return def.promise;
  };

});