pdApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/main', {
        templateUrl: '/dist/html/mainView.html',
        controller: 'MainController'
      }).
      when('/cart', {
        templateUrl: '/dist/html/cartView.html',
        controller: 'CartController'
      }).
      when('/watchlist/:id', {
        templateUrl: '/dist/html/watchlistView.html',
        controller: 'WatchlistController'
      }).
      when('/rejected', {
        templateUrl: '/dist/html/rejectedView.html',
        controller: 'RejectedController'
      }).
      when('/pending', {
        templateUrl: '/dist/html/pendingView.html',
        controller: 'PendingController'
      }).
      when('/done', {
        templateUrl: '/dist/html/doneView.html',
        controller: 'DoneController'
      }).
      when('/manage', {
        templateUrl: '/dist/html/manageView.html',
        controller: 'ManageController'
      }).
      when('/login/:isil', {
        templateUrl: '/dist/html/loginView.html',
        controller: 'LoginController'
      }).
      when('/', {
        templateUrl: '/dist/html/landingView.html',
        controller: 'LandingController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);