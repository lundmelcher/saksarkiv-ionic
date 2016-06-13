angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.loginData = $localStorage.getObject('userinfo','{}');
  $scope.reservation = {};
  $scope.registration = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  // Create the registration modal that we will use later
  $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
  }).then(function (modal) {
      $scope.registerform = modal;
  });

  // Triggered in the registration modal to close it
  $scope.closeRegister = function () {
      $scope.registerform.hide();
  };

  // Open the registration modal
  $scope.register = function () {
      $scope.registerform.show();
  };

  // Perform the registration action when the user submits the registration form
  $scope.doRegister = function () {
    console.log('Doing registration', $scope.registration);

    // Simulate a registration delay. Remove this and replace with your registration
    // code if using a registration system
    $timeout(function () {
        $scope.closeRegister();
    }, 1000);
  };

  $ionicPlatform.ready(function() {
    var cameraOptions = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    };

    $scope.takePicture = function() {
      console.log('Taking picture');
      $cordovaCamera.getPicture(cameraOptions).then(function(imageData) {
        $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        console.log(err);
      });

      $scope.registerform.show();
    };

    var imagePickerOptions = {
      maximumImagesCount: 1,
      width: 100,
      height: 100,
      quality: 50
    };

    $scope.getPicture = function() {
      console.log('Picking picture');
      $cordovaImagePicker.getPictures(imagePickerOptions).then(function (results) {
        for (var i = 0; i < results.length; i++) {
          $scope.registration.imgSrc = results[i];
        }
      }, function(err) {
        console.log(err);
      });
    };
  });
})

.controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
  function($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

  $scope.baseURL = baseURL;
  $scope.tab = 1;
  $scope.filtText = '';
  $scope.showDetails = false;

  $scope.dishes = dishes;

  $scope.select = function(setTab) {
    $scope.tab = setTab;

    if (setTab === 2) {
      $scope.filtText = "appetizer";
    } else if (setTab === 3) {
      $scope.filtText = "mains";
    } else if (setTab === 4) {
      $scope.filtText = "dessert";
    } else {
      $scope.filtText = "";
    }
  };

  $scope.isSelected = function(checkTab) {
    return ($scope.tab === checkTab);
  };

  $scope.toggleDetails = function() {
    $scope.showDetails = !$scope.showDetails;
  };

  $scope.addFavorite = function(index) {
    console.log("index is " + index);
    favoriteFactory.addToFavorites(index);
    $ionicListDelegate.closeOptionButtons();

    $ionicPlatform.ready(function () {
      $cordovaLocalNotification.schedule({
          id: 1,
          title: "Added Favorite",
          text: $scope.dishes[index].name
      }).then(function () {
          console.log('Added Favorite ' + $scope.dishes[index].name);
      },
      function () {
          console.log('Failed to add Notification ');
      });

      $cordovaToast
        .show('Added Favorite ' + $scope.dishes[index].name, 'long', 'center')
        .then(function (success) {
          // success
        }, function (error) {
          // error
        });
    });

  };
}])

.controller('DishDetailController', ['$scope', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
  function($scope, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

  $scope.baseURL = baseURL;
  $scope.dish = dish;

  $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  $scope.closePopover = function() {
    $scope.popover.hide();
  };

  $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.commentModal = modal;
  });

  $scope.closeComment = function() {
    $scope.commentModal.hide();
  };

  $scope.comment = function() {
    $scope.closePopover();
    $scope.commentModal.show();
  };

  $scope.addToFavorites = function() {
    favoriteFactory.addToFavorites($scope.dish.id);
    $scope.closePopover();

    $ionicPlatform.ready(function () {
      $cordovaLocalNotification.schedule({
          id: 1,
          title: "Added Favorite",
          text: $scope.dish.name
      }).then(function () {
          console.log('Added Favorite ' + $scope.dish.name);
      },
      function () {
          console.log('Failed to add Notification ');
      });

      $cordovaToast
        .show('Added Favorite ' + $scope.dish.name, 'long', 'bottom')
        .then(function (success) {
          // success
        }, function (error) {
          // error
        });
    });
  };

  var emptyComment = {
    rating: 5,
    comment: "",
    author: "",
    date: ""
  };

  $scope.mycomment = angular.copy(emptyComment);

  $scope.submitComment = function() {
    $scope.mycomment.date = new Date().toISOString();

    $scope.dish.comments.push($scope.mycomment);
    menuFactory.update({ id: $scope.dish.id }, $scope.dish);

    $scope.mycomment = angular.copy(emptyComment);
    $scope.closeComment();
  };

}])

.controller('IndexController', ['$scope', 'dish', 'promotion', 'leader', 'baseURL',
  function($scope, dish, promotion, leader, baseURL) {

  $scope.baseURL = baseURL;
  $scope.leader = leader;
  $scope.dish = dish;
  $scope.promotion = promotion;

}])

.controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL) {

  $scope.baseURL = baseURL;
  $scope.leaders = leaders;

}])

.controller('FavoriteController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicPlatform', '$cordovaVibration',
  function($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicPlatform, $cordovaVibration) {

  $scope.baseURL = baseURL;
  $scope.shouldShowDelete = false;

  $scope.favorites = favorites;

  $scope.dishes = dishes;

  $scope.toggleDelete = function() {
    $scope.shouldShowDelete = !$scope.shouldShowDelete;
  };

  $scope.deleteFavorite = function(index) {
    var confirmPopup = $ionicPopup.confirm({
        title: 'Confirm Delete',
        template: 'Are you sure you want to delete this item?'
      });

    confirmPopup.then(function(response) {
      if (response) {
        console.log('Ok to delete');
        favoriteFactory.deleteFromFavorites(index);
        $ionicPlatform.ready(function() {
          $cordovaVibration.vibrate(3000);
        });
      } else {
        console.log('Canceled delete');
      }
    });

    $scope.shouldShowDelete = false;
  };

}])

.filter('favoriteFilter', function () {
  return function (dishes, favorites) {
    var out = [];
    for (var i = 0; i < favorites.length; i++) {
      for (var j = 0; j < dishes.length; j++) {
        if (dishes[j].id === favorites[i].id)
          out.push(dishes[j]);
      }
    }
    return out;
  }
})
;
