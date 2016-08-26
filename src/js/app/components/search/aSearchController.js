pdApp.controller('AdvancedSearchController', ['$scope', 'Notification', 'SearchService', '$rootScope', function ($scope, Notification, SearchService, $rootScope) {

    $scope.criteria = [];

    SearchService.getSearchConfig().then(function (data) {

        $scope.searchable_fields = data.searchable_fields;
        $scope.search_modes = data.search_modes;

    }, function (reason) {
        Notification.error(reason);
    });

    this.addCriterion = function (field, mode, value) {
        $scope.criteria.push({
            field: field,
            mode: mode,
            value: value
        });
    };

    this.addDefaultCriterion = function () {
        this.addCriterion('tit', 'contains', '');
    }.bind(this);

    // add first criterion
    this.addDefaultCriterion();

    this.deleteCriterion = function (index) {
        $scope.criteria.splice(index, 1);
    };

    this.startSearch = function () {
        $rootScope.$broadcast('setSearchbox', '');
        SearchService.setSearchterm($scope.criteria, 'advanced');
    };

    $rootScope.$on('searchFinished', function (ev, data) {
        $scope.criteria = [];

        if (data.type === 'simple') {
            this.addCriterion(data.criteria.field, data.criteria.mode, data.criteria.value);
        } else if (data.type === 'advanced') {
            for (var i = 0; i < data.criteria.length; i++) {
                this.addCriterion(data.criteria[i].field, data.criteria[i].mode, data.criteria[i].value);
            }
        } else {
            this.addDefaultCriterion();
        }

    }.bind(this));

}]);