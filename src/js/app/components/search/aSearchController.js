pdApp.controller('AdvancedSearchController', ['$scope', 'Notification', 'SearchService', function($scope, Notification, SearchService){

  $scope.criteria = [];

  SearchService.getSearchConfig().then(function(data){

    $scope.searchable_fields = data.searchable_fields;
    $scope.search_modes = data.search_modes;

  }, function(reason){
    Notification.error(reason);
  });

  this.addCriterium = function(){
    $scope.criteria.push({
      field: 'tit',
      mode: 'contains',
      value: ''
    });
  };

  // add first criterium
  this.addCriterium();

  this.deleteCriterium = function(index){
    $scope.criteria.splice(index, 1);
  };

  this.startSearch = function(){
    console.log($scope.criteria);
  };

}]);