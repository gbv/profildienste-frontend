// Load the entries
pdApp.factory('Entries', ['$http', '$uibModal', '$rootScope', 'SelectService', function($http, $uibModal, $rootScope, SelectService) {

  // Entry object
  var Entries = function(site, id, title) {
    this.items = [];
    this.loading = false;
    this.page = 0;
    this.site = site;
    this.more = true;
    this.id = id;
    this.total = 0;
    this.error = false;

    $rootScope.$broadcast('siteChanged', {
      site: (title !== undefined) ? title : site,
      watchlist: (id !== undefined),
      entries: this
    });
  };

  // loads more entries from the server
  Entries.prototype.loadMore = function() {

    if (!this.more || this.loading){
      return;
    }

    this.loading = true;
    $rootScope.$broadcast('siteLoading');
    if(this.id === undefined){
      var url = '/api/get/'+this.site+'/page/'+this.page;
    }else{
      var url = '/api/get/'+this.site+'/'+this.id+'/page/'+this.page;
    }
    
    $http.get(url).success(function(data) {
      if(data.success){
        var items = data.data;

        var selectAll = SelectService.viewSelected();

        for (var i = 0; i < items.length; i++) {
          items[i].status.selected = selectAll;
          this.items.push(items[i]);
        }
        this.page++;
        this.loading = false;
        this.more = data.more;
        this.total = data.total;
        $rootScope.$broadcast('siteLoadingFinished', data.total);
      }else{
        this.error = true;
        this.errorMessage = data.message;
        $rootScope.$broadcast('siteLoadingFinished', -1);
      }
      
    }.bind(this)).error(function(data, status, headers, config) {

      $modal.open({
        templateUrl: 'errorModal.html',
        controller: 'ErrorModalCtrl',
        keyboard: false
      });

    });
  };

  // removes a given item from the item collection
  Entries.prototype.removeItem = function(item) {
    for(var i = 0; i < this.items.length; i++){
      if(this.items[i] === item){
        this.items.splice(i, 1);
        break;
      }
    }

    this.total--;
    $rootScope.$broadcast('totalChanged', this.total);

    if(this.items.length == 0){
      this.page--;
      this.loadMore();
    }
  }

  // resets the loader
  Entries.prototype.reset = function(url) {
    if(url !== undefined){
      this.url = url;
    }
    this.page = 0;
    this.items = [];
    this.more = true;
    this.loadMore();
  }

  return Entries;
}]);