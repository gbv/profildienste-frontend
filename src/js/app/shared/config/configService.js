pdApp.service('ConfigService', ['$q', '$rootScope', 'PageConfigService', function ($q, $rootScope, PageConfigService) {

    var config;
    var entries;
    var defConfig = $q.defer();
    var defEntries = $q.defer();

    this.getConfig = function () {
        if (config === undefined) {
            return defConfig.promise;
        } else {
            var def = $q.defer();
            def.resolve(config);
            return def.promise;
        }
    };

    this.setConfig = function (c) {
        config = c;

        defConfig.resolve(config);
    };

    this.getEntries = function () {
        if (entries === undefined) {
            return defEntries.promise;
        } else {
            var def = $q.defer();
            def.resolve({
                entries: entries
            });
            return def.promise;
        }
    };

    this.setEntries = function (e) {
        entries = e;

        defEntries.resolve({
            entries: entries
        });
    };

    $rootScope.$on('siteChanged', function (ev, site) {

        var view = site.site;

        if (site.watchlist) {
            view = 'watchlist';
        }

        this.config = undefined;
        this.setConfig(PageConfigService.getConfig(view));

    }.bind(this));

}]);