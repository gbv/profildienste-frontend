pdApp.service('UserService', ['$http', '$q', 'LoginService', function ($http, $q, LoginService) {

  var defUser = $q.defer();

  var motdSeen = false;

  LoginService.whenLoggedIn().then(function (data) {

    // Get name and budgets
    $http.get('/api/user/').success(function (json) {
      if (!json.success) {
        defUser.reject(json.message);
      } else {

        defUser.resolve({
          name: json.data.name,
          motd: json.data.motd,
          defaults: json.data.defaults,
          budgets: json.data.budgets,
          show: {
            comments: false,
            author: true,
            pages: true,
            isbn: true,
            gvk: true,
            year: true,
            genre: true,
            dnb_number: true,
            dnb: true,
            assigned: true
          }
        });

      }
    }).error(function (reason) {
      defUser.reject(reason);
    });

  });

  this.getUserData = function () {
    return defUser.promise;
  };

  this.setMOTDSeen = function () {
    this.motdSeen = true;
  };

  this.getMOTDSeen = function () {
    return this.motdSeen;
  };

}]);pdApp.service('UserService', ['$http', '$q', 'LoginService', function ($http, $q, LoginService) {

  var defUser = $q.defer();

  var motdSeen = false;

  LoginService.whenLoggedIn().then(function (data) {

    // Get name and budgets
    $http.get('/api/user/').success(function (json) {
      if (!json.success) {
        defUser.reject(json.message);
      } else {

        defUser.resolve({
          name: json.data.name,
          motd: json.data.motd,
          defaults: json.data.defaults,
          budgets: json.data.budgets,
          show: {
            comments: false,
            author: true,
            pages: true,
            isbn: true,
            gvk: true,
            year: true,
            genre: true,
            dnb_number: true,
            dnb: true,
            assigned: true
          }
        });

      }
    }).error(function (reason) {
      defUser.reject(reason);
    });

  });

  this.getUserData = function () {
    return defUser.promise;
  };

  this.setMOTDSeen = function () {
    this.motdSeen = true;
  };

  this.getMOTDSeen = function () {
    return this.motdSeen;
  };

}]);