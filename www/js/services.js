'use strict';
angular.module('conFusion.services', ['ngResource'])
  .constant("baseURL", "http://localhost:3000/")

  .factory('$localStorage', ['$window', function($window) {
    return {
      store: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      storeObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key, defaultValue) {
        console.log('getting ' + key);
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
    };
  }])

  .factory('caseFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    return $resource(baseURL + "cases/:id", null, { 'update': { method: 'PUT' }});
  }])

  .factory('lawyerFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    return $resource(baseURL + "lawyers/:id");
  }])

  .factory('favoriteFactory', ['$resource', '$localStorage', 'baseURL', function ($resource, $localStorage, baseURL) {
    console.log('loading');
    var favFac = {};
    var favorites = $localStorage.getObject('favorites', '[]');
    console.log(favorites);

    favFac.addToFavorites = function(index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id === index) {
          console.log("favorite already selected " + index);
          return;
        }
      }
      favorites.push({id: index});
      $localStorage.storeObject('favorites', favorites);
    };

    favFac.deleteFromFavorites = function(index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id === index)
          favorites.splice(i, 1);
      }
      $localStorage.storeObject('favorites', favorites);
    };

    favFac.getFavorites = function() {
      return favorites;
    };

    return favFac;

  }])
;
