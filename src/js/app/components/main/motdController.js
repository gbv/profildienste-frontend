pdApp.controller('MOTDController', ['$scope', 'UserService', '$q', function ($scope, UserService, $q) {

    UserService.getUserData().then(function (data) {
        $scope.motd = data.motd;
    });
    
    $scope.motdSeen = UserService.getMOTDSeen();

    this.closeMOTD = function () {
        UserService.setMOTDSeen();
    };

}]);