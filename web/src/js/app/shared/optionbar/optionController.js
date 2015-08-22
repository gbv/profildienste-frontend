pdApp.controller('OptionController', ['$scope', 'SettingsService', 'ConfigService', '$q', 'SelectService', 'Notification', function ($scope, SettingsService, ConfigService, $q, SelectService, Notification) {

    this.selectAll = function () {
        if ($scope.entries === undefined) {
            return;
        }

        if (SelectService.getSelected().length === $scope.entries.items.length) {
            SelectService.deselectAll();
        } else {
            SelectService.selectAll();
        }
    }

    var p = $q.all([SettingsService.getSortby(), SettingsService.getOrder(), SettingsService.getSelOptions(), ConfigService.getConfig(), ConfigService.getEntries()]);

    p.then(function (data) {

        $scope.sortby = data[0].sortby;
        $scope.order = data[1].order;

        $scope.selected_sorter_key = data[2].sort;
        for (var i = 0; i < data[0].sortby.length; i++) {
            if (data[0].sortby[i].key === data[2].sort) {
                $scope.selected_sorter = data[0].sortby[i].value;
                break;
            }
        }

        $scope.selected_order_key = data[2].order;
        for (var i = 0; i < data[1].order.length; i++) {
            if (data[1].order[i].key === data[2].order) {
                $scope.selected_order = data[1].order[i].value;
                break;
            }
        }

        $scope.showSelectAll = data[3].config.rejectPossible;

        $scope.entries = data[4].entries;


    }, function (reason) {
        Notification.error(reason);
    });

    this.setSorter = function (sorter) {

        if (sorter === $scope.selected_sorter_key) {
            return;
        }

        SettingsService.changeSetting('sortby', sorter).then(function (data) {

            $scope.selected_sorter_key = data.value;
            for (var i = 0; i < $scope.sortby.length; i++) {
                if ($scope.sortby[i].key === data.value) {
                    $scope.selected_sorter = $scope.sortby[i].value;
                    break;
                }
            }

            $scope.entries.reset();

        }, function (reason) {
            Notification.error(reason);
        });

    }

    this.setOrder = function (order) {

        if (order === $scope.selected_order_key) {
            return;
        }

        SettingsService.changeSetting('order', order).then(function (data) {

            $scope.selected_order_key = data.value;
            for (var i = 0; i < $scope.order.length; i++) {
                if ($scope.order[i].key === data.value) {
                    $scope.selected_order = $scope.order[i].value;
                    break;
                }
            }

            $scope.entries.reset();

        }, function (reason) {
            Notification.error(reason);
        });

    };

}]);