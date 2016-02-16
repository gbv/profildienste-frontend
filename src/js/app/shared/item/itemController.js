pdApp.controller('ItemController', ['$scope', '$sce', 'WatchlistService', 'CartService', '$uibModal', 'ConfigService', '$rootScope', 'SelectService', 'InfoService', 'RejectService', 'UserService', '$timeout', 'Notification', 'SaveService', function ($scope, $sce, WatchlistService, CartService, $uibModal, ConfigService, $rootScope, SelectService, InfoService, RejectService, UserService, $timeout, Notification, SaveService) {

  $scope.bibInfCollapsed = true;
  $scope.addInfCollapsed = true;
  $scope.CommentCollapsed = ($scope.item.comment === null || $scope.item.comment === '');

  $scope.loading = {
    comment: false,
    lieft: false,
    selcode: false,
    ssgnr: false,
    budget: false
  };

  // for the background fade
  $scope.saved = {
    comment: false,
    lieft: false,
    selcode: false,
    ssgnr: false,
    budget: false
  };

  $scope.item.preis = $sce.trustAsHtml($scope.item.preis);

  WatchlistService.getWatchlists().then(function (data) {
    $scope.watchlists = data.watchlists;
  });

  UserService.getUserData().then(function (data) {
    $scope.budgets = data.budgets;
    $scope.defaults = data.defaults;

    if ($scope.item.budget === null && $scope.budgets.length > 0) {
      $scope.item.budget = $scope.budgets[0].key;
      for (var i = 0; i < $scope.budgets.length; i++) {
        if ($scope.budgets[i].key === $scope.defaults.budget) {
          $scope.item.budget = $scope.budgets[i].value;
          break;
        }
      }
    }
  });

  ConfigService.getConfig().then(function (data) {
    $scope.config = data.actionConfig;
    $scope.selectionEnabled = data.selectionEnabled;
    $scope.editOrderInformation = data.editOrderInformation;
  });

  ConfigService.getEntries().then(function (data) {
    $scope.entries = data.entries;
  });

  this.addToCart = function () {

    CartService.addToCart($scope.item).then(function (data) {
        $scope.item.status.cart = true;

        SelectService.deselect($scope.item);

        if ($scope.config.hideCart) {
          $scope.entries.removeItem($scope.item);
        }
      },
      function (reason) {
        Notification.error(reason);
      });
  };

  this.addToWL = function (wl) {
    WatchlistService.addToWatchlist($scope.item, wl).then(function (data) {
        $scope.item.status.watchlist.watched = true;
        $scope.item.status.watchlist.name = data.name;
        $scope.item.status.watchlist.id = data.id;

        SelectService.deselect($scope.item);

        if ($scope.config.hideWatchlist) {
          $scope.entries.removeItem($scope.item);
        }
      },
      function (reason) {
        Notification.error(reason);
      });
  };

  this.removeFromWL = function () {
    WatchlistService.removeFromWatchlist($scope.item).then(function (data) {
        $scope.item.status.watchlist.watched = false;

        if ($scope.config.hideWatchlist) {
          $scope.entries.removeItem($scope.item);
        }
      },
      function (reason) {
        Notification.error(reason);
      });
  };

  this.removeFromCart = function () {
    CartService.removeFromCart($scope.item).then(function (data) {
        $scope.item.status.cart = false;

        if ($scope.config.hideCart) {
          $scope.entries.removeItem($scope.item);
        }
      },
      function (reason) {
        Notification.error(reason);
      });
  };

  this.toggleSelect = function () {
    if ($scope.item.status.selected) {
      SelectService.deselect($scope.item);
    } else {
      SelectService.select($scope.item);
    }
  };

  this.openOPAC = function () {
    InfoService.openOPAC($scope.item);
  };

  /*
   * Comment saving
   */

  var comment = '';

  this.saveComment = function () {
    comment = $scope.item.comment;
  };

  this.closeComment = function () {
    if ($scope.item.comment === undefined || $scope.item.comment === '') {
      $scope.CommentCollapsed = true;
    }

    if ($scope.item.comment !== comment) {
      $scope.saved.comment = false;
      $scope.loading.comment = true;
      SaveService.saveComment($scope.item).then(function () {
        $scope.loading.comment = false;
        $scope.saved.comment = true;
      }, function (reason) {
        Notification.error(reason);
      });
    }
  };

  /*
   * Lieferant saving
   */

  var lieft = '';

  this.saveLieft = function () {
    lieft = $scope.item.lft;
  };

  this.closeLieft = function () {

    if ($scope.item.lft !== lieft) {
      $scope.saved.lieft = false;
      $scope.loading.lieft = true;
      SaveService.saveLieft($scope.item).then(function () {
        $scope.loading.lieft = false;
        $scope.saved.lieft = true;
      }, function (reason) {
        Notification.error(reason);
      });
    }
  };


  /*
   * Selcode saving
   */

  var selcode = '';

  this.saveSelcode = function () {
    selcode = $scope.item.selcode;
  };

  this.closeSelcode = function () {

    if ($scope.item.selcode !== selcode) {
      $scope.saved.selcode = false;
      $scope.loading.selcode = true;
      SaveService.saveSelcode($scope.item).then(function () {
        $scope.loading.selcode = false;
        $scope.saved.selcode = true;
      }, function (reason) {
        Notification.error(reason);
      });
    }
  };

  /*
   * SSGNr saving
   */

  var ssgnr = '';

  this.saveSSGNr = function () {
    ssgnr = $scope.item.ssgnr;
  };

  this.closeSSGNr = function () {

    if ($scope.item.ssgnr !== ssgnr) {
      $scope.saved.ssgnr = false;
      $scope.loading.ssgnr = true;
      SaveService.saveSSGNr($scope.item).then(function () {
        $scope.loading.ssgnr = false;
        $scope.saved.ssgnr = true;
      }, function (reason) {
        Notification.error(reason);
      });
    }
  };


  /*
   * Budget saving
   */

  this.saveBudget = function () {
    $scope.saved.budget = false;
    $scope.loading.budget = true;
    SaveService.saveBudget($scope.item).then(function () {
      $scope.loading.budget = false;
      $scope.saved.budget = true;
    }, function (reason) {
      Notification.error(reason);
    });
  };


  this.getAddInf = function () {

    if ($scope.addInf !== undefined) {
      $scope.addInfCollapsed = !$scope.addInfCollapsed;
      return;
    }

    InfoService.getAddInf($scope.item).then(function (data) {
        if (data.type === 'html') {
          $scope.addInf = $sce.trustAsHtml(data.content);
          // dirty but needed
          $timeout(function () {
            $scope.addInfCollapsed = false;
          }, 100);
        } else {
          window.open(data.content, '_blank');
        }
      },
      function (reason) {
        Notification.error(reason);
      });
  };

  this.addRejected = function () {
    RejectService.addRejected($scope.item).then(function (data) {
      $scope.item.status.rejected = true;

      SelectService.deselect($scope.item);

      if ($scope.config.hideRejected) {
        $scope.entries.removeItem($scope.item);
      }
    }, function (reason) {
      Notification.error(reason);
    });
  };

  this.removeRejected = function () {
    RejectService.removeRejected($scope.item).then(function (data) {
      $scope.item.status.rejected = false;

      if ($scope.config.hideRejected) {
        $scope.entries.removeItem($scope.item);
      }
    }, function (reason) {
      Notification.error(reason);
    });
  };

  this.showCover = function () {

    $uibModal.open({
      templateUrl: 'coverModal.html',
      controller: 'CoverModalCtrl',
      resolve: {
        cover: function () {
          return $scope.item.cover_lg;
        }
      }
    });

  };

  this.showNoTopBtn = function () {
    return $scope.item.status.done || $scope.item.status.rejected || $scope.item.status.pending;
  };

  this.showCartBtn = function () {
    return !$scope.item.status.done && !$scope.item.status.pending && !$scope.item.status.rejected && !$scope.item.status.cart;
  };

  this.showCartBtnRem = function () {
    return !$scope.item.status.done && !$scope.item.status.rejected && !$scope.item.status.pending && $scope.item.status.cart;
  };

  this.isRejectable = function () {
    return !$scope.item.status.rejected && !$scope.item.status.cart && !$scope.item.status.watchlist.watched && !$scope.item.status.done && !$scope.item.status.pending;
  };

  this.showWatchlistBtn = function () {
    return !$scope.item.status.done && !$scope.item.status.pending && !$scope.item.status.rejected && !$scope.item.status.watchlist.watched;
  };

  this.showWatchlistRemBtn = function () {
    return !$scope.item.status.done && !$scope.item.status.pending && !$scope.item.status.rejected && $scope.item.status.watchlist.watched;
  };

  this.editOrderInformation = function () {
    return !($scope.item.status.done || $scope.item.status.pending);
  };

}]);