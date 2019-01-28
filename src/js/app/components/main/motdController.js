pdApp.controller('MOTDController', ['$scope', 'UserService', '$q', function ($scope, UserService, $q) {

    UserService.getUserData().then(function (data) {
        $scope.motd = data.motd;
    });
    
    if(UserService.motdSeen){
        $scope.motdSeen = true;
    }else{
        $scope.motdSeen = false;
    }

    this.closeMOTD = function () {
        UserService.setMOTDSeen();
    };

}]);