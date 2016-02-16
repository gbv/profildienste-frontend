pdApp.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {

    // Authentication function
    var checkAuth = function ($location, $q, $window, LogoutService) {
      var deferred = $q.defer();
      if (!$window.sessionStorage.token) {
        deferred.reject();
        $location.path('/');
        LogoutService.destroySession('Bitte melden Sie sich an um fortzufahren.');
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    };
    checkAuth.$inject = ['$location', '$q', '$window', 'LogoutService'];

    // Routes
    $routeProvider.when('/main', {
      templateUrl: '/main/mainView.html',
      resolve: {checkAuth: checkAuth}
    }).when('/cart', {
      templateUrl: '/cart/cartView.html',
      resolve: {checkAuth: checkAuth}
    }).when('/watchlist/:id', {
      templateUrl: '/watchlist/watchlistView.html',
      resolve: {checkAuth: checkAuth}
    }).when('/rejected', {
      templateUrl: '/rejected/rejectedView.html',
      resolve: {checkAuth: checkAuth}
    }).when('/pending', {
      templateUrl: '/pending/pendingView.html',
      resolve: {checkAuth: checkAuth}
    }).when('/done', {
      templateUrl: '/done/doneView.html',
      resolve: {checkAuth: checkAuth}
    }).when('/manage', {
      templateUrl: '/manage/manageView.html',
      resolve: {checkAuth: checkAuth}
    }).when('/login/:isil', {
      templateUrl: '/login/loginView.html'
    }).when('/logout', {
      templateUrl: '/logout/logoutView.html',
      resolve: {checkAuth: checkAuth}
    }).when('/search', {
      templateUrl: '/search/searchView.html',
      resolve: {checkAuth: checkAuth}
    }).when('/order', {
      templateUrl: '/order/orderView.html',
      resolve: {checkAuth: checkAuth}
    }).when('/', {
      templateUrl: '/landing/landingView.html'
    }).otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
  }]);