pdApp.service('SearchService', function($rootScope){

  var searchterm;

  this.setSearchterm = function(term){
    searchterm = term;
    $rootScope.$broadcast('search');
  };

  this.getSearchterm = function(){
    return searchterm;
  };

});