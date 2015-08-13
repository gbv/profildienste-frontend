pdApp.controller('RejectedController', ['$scope', 'Entries', 'ConfigService', '$http', '$location', 'Notification', function($scope, Entries, ConfigService, $http, $location, Notification) {

  $scope.entries = new Entries('rejected');
  
  var config = {
    hideWatchlist: false,
    hideCart: true,
    hideRejected: true,
    rejectPossible: false
  };

  ConfigService.setConfig(config);
  ConfigService.setEntries($scope.entries);

  this.showDeletePermanently = function(){
    return ($scope.entries.total > 0);
  }

  this.deletePermanently = function(){
    $http({
      method: 'POST',
      url: '/api/delete',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(json){
      if(!json.success){
        Notification.error(json.errormsg);
      }else{
        $location.path('/main');
      }
    }.bind(this));
  }

}]);