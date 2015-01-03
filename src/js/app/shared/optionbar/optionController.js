pdApp.controller('OptionController', function($scope, DataService, ConfigService, $q, SelectService) {

  this.selectAll = function(){
    if($scope.entries === undefined){
      return;
    }

    if(SelectService.getSelected().length === $scope.entries.items.length){
      SelectService.deselectAll();
    }else{
      SelectService.selectAll();
    }
  }

  var p =  $q.all([DataService.getSortby(), DataService.getOrder(), DataService.getSelOptions(), ConfigService.getConfig(), ConfigService.getEntries()]);

  p.then(function(data){

    $scope.sortby = data[0].sortby;
    $scope.order = data[1].order;

    $scope.selected_sorter_key = data[2].sort;
    for(var i=0; i < data[0].sortby.length; i++){
      if(data[0].sortby[i].key === data[2].sort){
        $scope.selected_sorter = data[0].sortby[i].value;
        break;
      }
    }

    $scope.selected_order_key = data[2].order;
    for(var i=0; i < data[1].order.length; i++){
      if(data[1].order[i].key === data[2].order){
        $scope.selected_order = data[1].order[i].value;
        break;
      }
    }

    $scope.showSelectAll = data[3].config.rejectPossible;

    $scope.entries = data[4].entries;


  }, function(reason){
    alert('Fehler: '+reason);
  });

  this.setSorter = function (sorter){

    if(sorter === $scope.selected_sorter_key){
      return;
    }

    DataService.changeSetting('sortby', sorter).then(function(data){

      $scope.selected_sorter_key = data.value;
      for(var i=0; i < $scope.sortby.length; i++){
        if($scope.sortby[i].key === data.value){
          $scope.selected_sorter = $scope.sortby[i].value;
          break;
        }
      }

      $scope.entries.reset();

    }, function(reason){
      alert('Fehler: '+reason);
    });
    
  }

  this.setOrder = function (order){

    alert('ORDER CALLED');

    if(order === $scope.selected_order_key){
      return;
    }

    DataService.changeSetting('order', order).then(function(data){

      $scope.selected_order_key = data.value;
      for(var i=0; i < $scope.order.length; i++){
        if($scope.order[i].key === data.value){
          $scope.selected_order = $scope.order[i].value;
          break;
        }
      }

      $scope.entries.reset();

    }, function(reason){
      alert('Fehler: '+reason);
    });
    
  }

});