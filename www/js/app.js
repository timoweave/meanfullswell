
angular.module('MeanStarter', ['ionic',
                               'MeanStarter.controllers',
                               'MeanStarter.services'])

// angular.module('MeanStarter', ...)
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

// angular.module('MeanStarter', ...)
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  // $locationProvider.html5Mode(true).hashPrefix('!');

  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  // $stateProvider
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })
  // $stateProvider
  .state('app.browse', {
    url: '/browse',
    views: {
      'menuContent': {
        templateUrl: 'templates/browse.html'
      }
    }
  })
  // $stateProvider
  .state('app.meanstuffs', {
    url: '/meanstuffs',
    views: {
      'menuContent': {
        templateUrl: 'templates/meanstuffs.html',
        controller: 'MeanStuffsCtrl'
      }
    }
  })
  // $stateProvider
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

// angular.module('MeanStarter', ...)
;
