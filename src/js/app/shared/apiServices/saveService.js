pdApp.service('SaveService', ['$http', function ($http) {

    var save = function (id, type, value) {
        return $http({
            method: 'POST',
            url: '/api/titles/save',
            data: $.param({
                affected: [id],
                save: [{
                    type: type,
                    value: value
                }]
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };

    this.saveComment = function (item) {
        return save(item.id, 'comment', item.comment);
    };

    this.saveSupplier = function (item) {
        return save(item.id, 'supplier', item.supplier);
    };

    this.saveSelcode = function (item) {
        return save(item.id, 'selcode', item.selcode);
    };

    this.saveSSGNr = function (item) {
        return save(item.id, 'ssgnr', item.ssgnr);
    };

    this.saveBudget = function (item) {
        return save(item.id, 'budget', item.budget);
    };

}]);
