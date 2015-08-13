pdApp.service('SelectService', ['$rootScope', 'RejectService', 'ConfigService', 'Notification', function($rootScope, RejectService, ConfigService, Notification){
  var selected = [];

  ConfigService.getConfig().then(function(data){
    this.config = data.config;
  }.bind(this));

  ConfigService.getEntries().then(function(data){
    this.entries = data.entries;
  }.bind(this));

  this.getSelected = function(){
    return selected;
  };

  this.selectAll = function(){
    $rootScope.$broadcast('selectAll');
  };

  this.deselectAll = function(){
    var i;
    for(i=0; i < selected.length; i++){
      selected[i].status.selected = false;
    }

    selected = []; 

    if(i > 0){
      $rootScope.$broadcast('itemDeselected');
    }
  };

  this.select = function(item){
    if(selected.indexOf(item) >= 0){
      return;
    }
    selected.push(item);
    item.status.selected = true;
    $rootScope.$broadcast('itemSelected');
  };

  this.deselect = function(item){
    var ind = selected.indexOf(item);
    if(ind < 0){
      return;
    }

    selected.splice(ind, 1);
    item.status.selected = false;

    $rootScope.$broadcast('itemDeselected');
  };

  this.rejectAll = function(){
    RejectService.addMultRejected(selected).then(function(data){

      for(var i = 0; i < selected.length; i++){
        selected[i].status.rejected = true;

        if(this.config.hideRejected){
          this.entries.removeItem(selected[i]);
        }
      }

      this.deselectAll();

    }.bind(this), function(reason){
      Notification.error(reason);
    });
  }.bind(this);

}]);