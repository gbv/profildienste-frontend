pdApp.service('SelectService', ['$rootScope', 'RejectService', 'Notification', function ($rootScope, RejectService, Notification) {

    var selected = [];

    var selectView = false;
    var selectAll = false;

    $rootScope.$on('siteChanged', function (ev, data) {
        this.resetSelection();
        this.entries = data.entries;
    }.bind(this));

    $rootScope.$on('siteLoadingFinished', function (ev, data) {
        if(selectView){
            selected = [];
            for(var i = 0; i < this.entries.items.length; i++){
                selected.push(this.entries.items[i]);
            }
        }
    }.bind(this));

    this.getSelected = function () {
        return selected;
    };

    this.viewSelected = function(){
        return selectView;
    };

    this.getSelectedNumber = function(){
      if(selectView){
          return this.entries.total;
      }else{
          return selected.length;
      }
    };

    this.selectAll = function (){
        this.resetSelection(false);
        selectView = false;
        selectAll = true;
        for(var i = 0; i < this.entries.items.length; i++){
            this.entries.items[i].status.selected = true;
            selected.push(this.entries.items[i]);
        }

        $rootScope.$broadcast('allSelected');
    };

    this.selectView = function(){
        this.resetSelection(false);
        selectAll = false;
        selectView = true;
        for(var i = 0; i < this.entries.items.length; i++){
            this.entries.items[i].status.selected = true;
            selected.push(this.entries.items[i]);
        }

        $rootScope.$broadcast('viewSelected');
    };


    this.resetSelection = function(hardReset){

        if(typeof hardReset === 'undefined' && hardReset) {
            selectView = false;
            selectAll = false;
        }

        for(var i = 0; i < selected.length; i++){
            selected[i].status.selected = false;
        }

        selected = [];
        $rootScope.$broadcast('allDeselected');

    };

    this.select = function (item) {

        if (item.status.selected) {
            return;
        }
        selected.push(item);
        item.status.selected = true;
        $rootScope.$broadcast('itemSelected');
    };

    this.deselect = function (item) {

        var ind = selected.indexOf(item);
        if (ind < 0) {
            return;
        }

        selected.splice(ind, 1);
        item.status.selected = false;
        selectView = false;

        $rootScope.$broadcast('itemDeselected');
    };

    this.selectionInCart = function(){
        alert('Im Sel Service!');
    }

    this.rejectAll = function () {
        RejectService.addMultRejected(selected).then(function (data) {

            for (var i = 0; i < selected.length; i++) {
                selected[i].status.rejected = true;

                //if (this.config.hideRejected) {
                //    this.entries.removeItem(selected[i]);
                //}
            }

            this.deselectView();

        }.bind(this), function (reason) {
            Notification.error(reason);
        });
    }.bind(this);

}]);