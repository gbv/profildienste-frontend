// Load the entries
pdApp.factory('Entries', ['$http', '$uibModal', '$rootScope', 'SelectService', '$q', function ($http, $uibModal, $rootScope, SelectService, $q) {

    // Entry object
    var Entries = function (site, id, title) {
        this.items = [];
        this.loading = false;
        this.page = 0;
        this.site = site;
        this.more = true;
        this.id = id;
        this.total = 0;
        this.error = false;
        this.additional = $q.defer();

        $rootScope.$broadcast('siteChanged', {
            site: (title !== undefined) ? title : site,
            watchlist: (id !== undefined),
            entries: this
        });
    };

    // loads more entries from the server
    Entries.prototype.loadMore = function () {

        if (!this.more || this.loading) {
            return;
        }

        this.loading = true;
        $rootScope.$broadcast('siteLoading');
        
        var url;
        if (this.id === undefined) {
            url = '/api/' + this.site + '/page/' + this.page;
        } else {
            url = '/api/' + this.site + '/' + this.id + '/page/' + this.page;
        }

        console.log(url);

        $http.get(url).success(function (resp) {

            var items = resp.data.titles;

            var selectAll = SelectService.viewSelected();

            for (var i = 0; i < items.length; i++) {
                items[i].status.selected = selectAll;
                this.items.push(items[i]);
            }
            this.page++;
            this.loading = false;
            this.more = resp.data.more;
            this.total = resp.data.total;

            if (resp.data.hasOwnProperty('additional')) {
                this.additional.resolve(data.data.additional);
            } else {
                this.additional.reject('No additional information available');
            }

            $rootScope.$broadcast('siteLoadingFinished', this.total);


        }.bind(this)).error(function (data, status, headers, config) {

            // TODO: Better error handling (check status code etc.)

            /*
             this.error = true;
             this.errorMessage = data.message;
             $rootScope.$broadcast('siteLoadingFinished', -1);
             */

            $uibModal.open({
                templateUrl: 'errorModal.html',
                controller: 'ErrorModalCtrl',
                keyboard: false
            });

        });
    };

    // removes a given item from the item collection
    Entries.prototype.removeItem = function (item) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i] === item) {
                this.items.splice(i, 1);
                break;
            }
        }

        this.total--;
        $rootScope.$broadcast('totalChanged', this.total);

        if (this.items.length === 0) {
            this.page--;
            this.loadMore();
        }
    };

    // resets the loader
    Entries.prototype.reset = function (url) {
        if (url !== undefined) {
            this.url = url;
        }
        this.page = 0;
        this.items = [];
        this.more = true;
        this.loadMore();
    };

    Entries.prototype.getAdditional = function () {
        return this.additional.promise;
    };

    return Entries;
}]);