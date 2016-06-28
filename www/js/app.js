// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('MeanStarter', ['ionic', 'MeanStarter.controllers'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    init_cordova();
    init_status_bar();
  });

  function init_cordova()
  {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      window.cordova.plugins.Keyboard.disableScroll(true);
    }
    // console.log("hello cordova");      
  }

  function init_status_bar()
  {
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }
    // console.log("hello status bar");
  }

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
    url: '/browse',
    views: {
      'menuContent': {
        templateUrl: 'templates/browse.html'
      }
    }
  })

  .state('app.meanstuffs', {
    url: '/meanstuffs',
    views: {
      'menuContent': {
        templateUrl: 'templates/meanstuffs.html',
        controller: 'MeanStuffsCtrl'
      }
    }
  })

  .state('app.todolist', {
    url: '/todolist',
    views: {
      'menuContent': {
        templateUrl: 'templates/todolist.html',
        controller: 'ToDoListCtrl'
      }
    }
  })

  ;


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/meanstuffs');
})

;
