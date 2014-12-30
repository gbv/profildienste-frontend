// Load the entries
pdApp.factory('Entries', function($http, $modal) {

  // Entry object
  var Entries = function(site) {
    this.items = [];
    this.loading = false;
    this.page = 0;
    this.site = site;
    this.more = true;
  };

  // loads more entries from the server
  Entries.prototype.loadMore = function() {

    if (!this.more || this.loading){
      return;
    }

    this.loading = true;
    var url = '/api/get/'+this.site+'/page/'+this.page+'?callback=JSON_CALLBACK';
    $http.jsonp(url).success(function(data) {
      var items = data.data;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i]);
      }
      this.page++;
      this.loading = false;
      this.more = data.more;
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
      }
    }

    if(this.items.length == 0){
      this.loadMore();
    }
  }

  // resets the loader
  Entries.prototype.reset = function() {
    this.page = 0;
    this.items = [];
    this.more = true;
    this.loadMore();
  }

  return Entries;
});