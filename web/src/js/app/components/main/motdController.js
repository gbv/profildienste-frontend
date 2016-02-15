pdApp.controller('MOTDController', ['$scope', 'UserService', '$q', function($scope, UserService, $q) {

    UserService.getUserData().then(function(data){
        $scope.motd = data.motd;
    });

    this.showMOTD = function(){
        return ($scope.motd !== '' && !UserService.getMOTDSeen());
    };

    this.closeMOTD = function(){
        UserService.setMOTDSeen();
    };

}]);