pdApp.controller('OptionController', ['$scope', 'SettingsService', 'ConfigService', '$q', 'SelectService', 'Notification', function ($scope, SettingsService, ConfigService, $q, SelectService, Notification) {

    this.selectAll = function () {
        SelectService.selectAll();
    };

    this.selectView = function () {
        SelectService.selectView();
    };

    var p = $q.all([SettingsService.getSortby(), SettingsService.getOrder(), SettingsService.getSelOptions(), ConfigService.getConfig(), ConfigService.getEntries()]);

    p.then(function (data) {

        $scope.sortby = data[0];
        $scope.order = data[1];

        $scope.selected_sorter_key = data[2].sort;
        for (var i = 0; i < data[0].length; i++) {
            if (data[0][i].value === data[2].sort) {
                $scope.selected_sorter = data[0][i].name;
                break;
            }
        }

        $scope.selected_order_key = data[2].order;
        for (i = 0; i < data[1].length; i++) {
            if (data[1][i].value === data[2].order) {
                $scope.selected_order = data[1][i].name;
                break;
            }
        }

        $scope.showSelectAll = data[3].selectionEnabled;

        $scope.entries = data[4].entries;


    }, function (reason) {
        Notification.error(reason);
    });

    this.setSorter = function (sorter) {

        if (sorter === $scope.selected_sorter_key) {
            return;
        }

        SettingsService.changeSetting('sortby', sorter).then(function (resp) {


            $scope.selected_sorter_key = resp.data.data.value;
            for (var i = 0; i < $scope.sortby.length; i++) {
                if ($scope.sortby[i].value === resp.data.data.value) {
                    $scope.selected_sorter = $scope.sortby[i].name;
                    break;
                }
            }

            $scope.entries.reset();

        }, function (reason) {
            Notification.error(reason);
        });

    };

    this.setOrder = function (order) {

        if (order === $scope.selected_order_key) {
            return;
        }

        SettingsService.changeSetting('order', order).then(function (resp) {

            $scope.selected_order_key = resp.data.data.value;
            for (var i = 0; i < $scope.order.length; i++) {
                if ($scope.order[i].value === resp.data.data.value) {
                    $scope.selected_order = $scope.order[i].name;
                    break;
                }
            }

            $scope.entries.reset();

        }, function (reason) {
            Notification.error(reason);
        });

    };

}]);