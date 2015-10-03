pdApp.service('SaveService', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

    var save = function (id, type, content){

        var def = $q.defer();

        $http({
            method: 'POST',
            url: '/api/save',
            data: $.param({
                id: id,
                type: type,
                content: content
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(json){
            if(!json.success){
                def.reject(json.errormsg);
            }else{
                def.resolve();
            }
        }.bind(this));

        return def.promise;

    };

    this.saveComment = function(item){
        return save(item.id, 'comment', item.comment);
    };

    this.saveLieft = function(item){
        return save(item.id, 'lieft', item.lft);
    };

    this.saveSelcode = function(item){
        return save(item.id, 'selcode', item.selcode);
    };

    this.saveSSGNr = function(item){
        return save(item.id, 'ssgnr', item.ssgnr);
    };

    this.saveBudget = function(item){
        return save(item.id, 'budget', item.budget);
    };

}]);
