pdApp.service('SelectService', ['$rootScope', 'Notification', 'PageConfigService', 'CartService', 'RejectService', function ($rootScope, Notification, PageConfigService, CartService, RejectService) {

    var selected = [];

    var selectView = false;
    var selectAll = false;

    var loading = false;

    $rootScope.$on('siteChanged', function (ev, data) {
        this.resetSelection();
        this.entries = data.entries;
        this.config = PageConfigService.getConfig(data.site);
    }.bind(this));

    $rootScope.$on('siteLoadingFinished', function (ev, data) {
        if (selectView) {
            selected = [];
            for (var i = 0; i < this.entries.items.length; i++) {
                selected.push(this.entries.items[i]);
            }
        }
    }.bind(this));

    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
       this.resetSelection();
    }.bind(this));

    this.getSelected = function () {
        return selected;
    };

    this.viewSelected = function () {
        return selectView;
    };

    this.getSelectedNumber = function () {
        if (selectView) {
            return this.entries.total;
        } else {
            return selected.length;
        }
    };

    this.selectAll = function () {

        if (this.loading) {
            return;
        }

        this.resetSelection(false);
        selectView = false;
        selectAll = true;
        for (var i = 0; i < this.entries.items.length; i++) {
            this.entries.items[i].status.selected = true;
            selected.push(this.entries.items[i]);
        }

        $rootScope.$broadcast('allSelected');
    };

    this.selectView = function () {

        if (this.loading) {
            return;
        }

        this.resetSelection(false);
        selectAll = false;
        selectView = true;
        for (var i = 0; i < this.entries.items.length; i++) {
            this.entries.items[i].status.selected = true;
            selected.push(this.entries.items[i]);
        }

        $rootScope.$broadcast('viewSelected');
    };


    this.resetSelection = function (hardReset) {

        if (this.loading) {
            return;
        }

        if (typeof hardReset === 'undefined' || hardReset) {
            selectView = false;
            selectAll = false;
        }

        for (var i = 0; i < selected.length; i++) {
            selected[i].status.selected = false;
        }

        selected = [];
        $rootScope.$broadcast('allDeselected');

    };

    this.select = function (item) {

        if (this.loading) {
            return;
        }

        if (item.status.selected) {
            return;
        }
        selected.push(item);
        item.status.selected = true;
        $rootScope.$broadcast('itemSelected');
    };

    this.deselect = function (item) {

        if (this.loading) {
            return;
        }

        var ind = selected.indexOf(item);
        if (ind < 0) {
            return;
        }

        selected.splice(ind, 1);
        item.status.selected = false;
        selectView = false;

        $rootScope.$broadcast('itemDeselected');
    };

    this.getSelectionIds = function () {
        var ids = [];
        for (var i = 0; i < selected.length; i++) {
            ids.push(selected[i].id);
        }
        return ids;
    };

    this.selectionInCart = function (site) {

        var s = '';
        var ids = [];
        if(selectView){
            s = site;
        }else{
            ids = this.getSelectionIds();
        }

        this.loading = true;
        CartService.addToCart(ids, s).then(function(){

            for(var i = 0; i < selected.length; i++){
                selected[i].status.selected = false;
                if(this.config.actionConfig.hideCart && !selectView){
                    this.entries.removeItem(selected[i]);
                }
            }

            if(this.config.actionConfig.hideCart && selectView){
                this.entries.items = [];
                this.entries.loadMore();
            }

            this.loading = false;
            this.resetSelection();
        }.bind(this), function(reason){
            Notification.error(reason);
            this.loading = false;
        }.bind(this));
    };

    this.selectionRemoveFromCart = function (site) {

        var s = '';
        var ids = [];
        if(selectView){
            s = site;
        }else{
            ids = this.getSelectionIds();
        }

        this.loading = true;
        CartService.removeFromCart(ids, s).then(function(){

            for(var i = 0; i < selected.length; i++){
                selected[i].status.selected = false;
                if(this.config.actionConfig.hideCart && !selectView){
                    this.entries.removeItem(selected[i]);
                }
            }

            if(this.config.actionConfig.hideCart && selectView){
                this.entries.items = [];
                this.entries.loadMore();
            }

            this.loading = false;
            this.resetSelection();
        }.bind(this), function(reason){
            Notification.error(reason);
            this.loading = false;
        }.bind(this));
    };

    this.selectionReject = function (site){

        var s = '';
        var ids = [];
        if(selectView){
            s = site;
        }else{
            ids = this.getSelectionIds();
        }

        this.loading = true;
        RejectService.addRejected(ids, s).then(function(){

                for(var i = 0; i < selected.length; i++){
                    selected[i].status.selected = false;
                    if(this.config.actionConfig.hideRejected && !selectView){
                        this.entries.removeItem(selected[i]);
                    }
                }

                if(this.config.actionConfig.hideRejected && selectView){
                    this.entries.items = [];
                    this.entries.loadMore();
                }

                this.loading = false;
                this.resetSelection();

        }.bind(this),
        function(reason){
            Notification.error(reason);
            this.loading = false;
        }.bind(this));

    };

    this.selectionRemoveReject = function (site){

        var s = '';
        var ids = [];
        if(selectView){
            s = site;
        }else{
            ids = this.getSelectionIds();
        }

        this.loading = true;
        RejectService.removeRejected(ids, s).then(function(){

                for(var i = 0; i < selected.length; i++){
                    selected[i].status.selected = false;
                    if(this.config.actionConfig.hideRejected && !selectView){
                        this.entries.removeItem(selected[i]);
                    }
                }

                if(this.config.actionConfig.hideRejected && selectView){
                    this.entries.items = [];
                    this.entries.loadMore();
                }

                this.loading = false;
                this.resetSelection();

            }.bind(this),
            function(reason){
                Notification.error(reason);
                this.loading = false;
            }.bind(this));

    };


}]);