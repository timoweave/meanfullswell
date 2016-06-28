angular.module('MeanStarter.controllers', [])

.controller('AppCtrl', ["$scope", "$ionicModal", "$timeout", AppCtrl])

.controller('MeanStuffsCtrl', ['$scope', MeanStuffsCtrlFunc])

.controller('ToDoListCtrl', ['$scope', ToDoListCtrl])

.filter('match_text', function() {
    return function(firebase_inputs, filter_text) {
      filter_text = filter_text || "";
      if (filter_text === "") { return firebase_inputs; }
      var firebase_keys = Object.keys(firebase_inputs);
      var firebase_outputs = firebase_keys.reduce(select_matched_value, []);
      function select_matched_value(result, key) {
        var item = firebase_inputs[key];
        var item_str = JSON.stringify(item);
        if (item_str.match(filter_text)) {
          result[key] = item;
        }
        return result
      }
      return firebase_outputs;
    };
})

;

function ToDoListCtrl($scope)
{
  var todo_list = [
    '"search-input", at the header, animates and slides from right to left',
    '"search-input", at the header, is not getting value, different scope perhaps',
    '"more-button" show popover to choose news, source code, delete, github-update, documentation',
    '"add-button" show a modal to add new entry, name, url, image, github-url, ...',
    '"image click" goes to the documentation/API site',
    '"left-side-menu" need to be reorganized',
    '"first load" doesnot seem load data from firebase....',
    '"login" use oauth/social, so that user can add, modified, delete items to/from the mean full swell firebase',
    '"image" should be fetched from the firebase storage',
    '"materialize" the theme or look, instead of default ionic',
    '"responsive sm icon", just show icon and caption for small screen, hide the right hand side'
  ];

  $scope.todo_list = todo_list;
}

function MeanStuffsCtrlFunc($scope)
{
  // console.log("hello mean stuffs controller function", $scope.items);

  $scope.mean_items = [];
  $scope.mean_items_valued = [];
  $scope.mean_tags = undefined;
  $scope.mean_filter_text = "";

  var items = firebase.database().ref("items");
  items.once('value').then(save_data("mean_items"));
  items.on('value', save_data("mean_items"));

  var tags = firebase.database().ref("tags");
  tags.once('value').then(save_data("mean_tags"));
  tags.on('value', save_data("mean_tags"));  

  function save_data(lhs) {
    return function(rhs) {
      $scope[lhs] = rhs.val();
    }
  }

  // console.log("firebase ...");
  $scope.filterBarInstance = undefined;
  $scope.searchInputVisible = false;
  $scope.shouldShowSearchInput = function () {
    return $scope.searchInputVisible;
  };
  $scope.showSearchInput =  function() {
    $scope.searchInputVisible = !$scope.searchInputVisible;
    console.log($scope.mean_filter_text);
    return $scope.searchInputVisible;
  };

  $scope.refresh_items = function () {
    // TBD
    $scope.$broadcast('scroll.refreshComplete');
  }
}

function AppCtrl($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    // console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
}
