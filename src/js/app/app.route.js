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
        controller: 'CartController'
      }).
      when('/phones/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
      otherwise({
        redirectTo: '/main'
      });
  }]);