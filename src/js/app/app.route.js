pdApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {

    // Authentication function
    var checkAuth = function($location, $q, $window, LogoutService) {
      var deferred = $q.defer();
      if(!$window.sessionStorage.token) {
        deferred.reject()
        $location.path('/');
        LogoutService.destroySession('Bitte melden Sie sich an um fortzufahren.');
      }else{
        deferred.resolve()
      }
      return deferred.promise;
    };
    checkAuth.$inject = ['$location', '$q', '$window', 'LogoutService'];

    // Routes
    $routeProvider.
      when('/main', {
        templateUrl: '/dist/html/mainView.html',
        requireLogin: {checkAuth: checkAuth}
      }).
      when('/cart', {
        templateUrl: '/dist/html/cartView.html',
        resolve: {checkAuth: checkAuth}
      }).
      when('/watchlist/:id', {
        templateUrl: '/dist/html/watchlistView.html',
        resolve: {checkAuth: checkAuth}
      }).
      when('/rejected', {
        templateUrl: '/dist/html/rejectedView.html',
        resolve: {checkAuth: checkAuth}
      }).
      when('/pending', {
        templateUrl: '/dist/html/pendingView.html',
        resolve: {checkAuth: checkAuth}
      }).
      when('/done', {
        templateUrl: '/dist/html/doneView.html',
        resolve: {checkAuth: checkAuth}
      }).
      when('/manage', {
        templateUrl: '/dist/html/manageView.html',
        resolve: {checkAuth: checkAuth}
      }).
      when('/login/:isil', {
        templateUrl: '/dist/html/loginView.html'
      }).
      when('/logout', {
        templateUrl: '/dist/html/logoutView.html',
        resolve: {checkAuth: checkAuth}
      }).
      when('/search', {
        templateUrl: '/dist/html/searchView.html',
        resolve: {checkAuth: checkAuth}
      }).
      when('/order', {
        templateUrl: '/dist/html/orderView.html',
        resolve: {checkAuth: checkAuth}
      }).
      when('/', {
        templateUrl: '/dist/html/landingView.html'
      }).
      otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
  }]);