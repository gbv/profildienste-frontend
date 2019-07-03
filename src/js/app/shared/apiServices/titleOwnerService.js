pdApp.service('TitleOwnerService', ['$http', function ($http) {

    this.changeOwner = function (item, colleague) {
        return $http({
            method: 'PATCH',
            url: '/api/titles/'+item.id+'/user',
            data: $.param({
                colleague: colleague._id
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };

}]);
