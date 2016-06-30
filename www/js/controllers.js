
angular.module('MeanStarter.controllers', ['ionic' // 'ionic-material'
                                          ])

.filter('filter_text', function() { return filter_text; })

.filter("mean_items_filter", function() { return filter_firebase; })

.controller('AppCtrl', ["$scope", "$ionicModal", "$timeout", AppCtrl])

.controller('MeanStuffsCtrl', ['$scope', '$ionicPopover', '$ionicModal', MeanStuffsCtrl])

.controller('ToDoListCtrl', ['$scope', '$ionicModal', ToDoListCtrl])

; // angular.module('MeanStarter.controllers', [])

function filter_firebase(firebase_inputs, filter_text)
{
  filter_text = filter_text || "";
  if (filter_text === "") { return firebase_inputs; }
  var input_keys = Object.keys(firebase_inputs);
  var firebase_outputs = Object.assign({}, firebase_inputs);
  input_keys.reduce(select_matched_value, firebase_outputs);
  function select_matched_value(result, key)
  {
    var item = firebase_inputs[key];
    var item_str = JSON.stringify(item);
    var matched = item_str.match(filter_text) ? true : false;
    // console.log("matched", matched, "item_str", item_str);
    if (!matched) {
      delete result[key];
    }
    return result
  }
  var output_keys = Object.keys(firebase_outputs);
  // console.log("result", firebase_outputs, "outputs", output_keys.length, "inputs", input_keys.length);
  return firebase_outputs;
}

function filter_text(firebase_inputs, filter_text)
{
  filter_text = filter_text || "";
  if (filter_text === "") { return firebase_inputs; }
  var firebase_keys = Object.keys(firebase_inputs);
  var firebase_outputs = firebase_keys.reduce(select_matched_value, []);
  function select_matched_value(result, key)
  {
    var item = firebase_inputs[key];
    var item_str = JSON.stringify(item);
    if (item_str.match(filter_text)) {
      result[key] = item;
    }
    return result
  }
  return firebase_outputs;
}

function ToDoListCtrl($scope, $ionicModal)
{
  $scope.todo_icon_color = {
    "ion-lightbulb" : { "icon" : "ion-lightbulb", "color" : "grey", "checkbox_color" : "checkbox-calm", "text" : "idea" },
    "ion-bug" : { "icon" : "ion-bug", "color" : "red", "checkbox_color" : "checkbox-assertive", "text" : "bug" },
    "ion-wrench" : { "icon" : "ion-wrench", "color" : "orange", "checkbox_color" : "checkbox-energized", "text" : "fixing" },
    "ion-beaker" : { "icon" : "ion-beaker", "color" : "dark", "checkbox_color" : "checkbox-dark", "text" : "testing" },
    "ion-checkmark" : { "icon" : "ion-checkmark", "color" : "green", "checkbox_color" : "checkbox-balanced", "text" : "done" }
  };

  $scope.todo_color = function(icon) {
    var todo_color_default = 'brown';
    return $scope.todo_icon_color[icon]['color'] || todo_color_default;
  }

  $scope.todo_list = undefined;
  var todo_list = firebase.database().ref("todos");
  todo_list.once('value').then(read_in("todo_list"));
  todo_list.on('value', read_in("data_list"));

  function read_in(lhs) {
    return function(rhs) {
      $scope[lhs] = rhs.val();
    }
  }

  function push_out(lhs) {
    todo_list.push(lhs);
  }

  function save_out(lhs) {
    firebase.database().ref().push();
  }
  
  $scope.todo = undefined; // todo data form to add/edit todos on the firebase
  $ionicModal.fromTemplateUrl('templates/todolist_form.html', {
    scope : $scope,
    animation : 'slide-in-up'
  }).then(function(modal) {
    var default_title = "Issue Detail";
    $scope.todo = {
      form : modal,
      title : default_title,
      input : {}, // data form modal for firebase todos
      add : function() {
        $scope.todo.title = "New Issue";
        $scope.todo.input = {};
        $scope.todo.form.show();        
      },
      edit : function(input) {
        $scope.todo.input =  input || $scope.todo.input;
        $scope.todo.title = "Edit Issue";
        $scope.todo.form.show();
      },
      close : function() {
        $scope.todo.form.hide();
        $scope.todo.title = default_title;
      },
      save : function(input) {
        // update existing data to firebase
        // todo_list.save();
      },
      submit : function(input) {
        // save new data to firebase
        input = input || $scope.todo.input;
        console.log("Submit todo issue: ", JSON.stringify(input));
        todo_list.push(input);
      },
      init_handlers : (
        function() {
          $scope.$on('$destory', function() {
            $scope.todo.form.remove();
          });
          $scope.$on('modal.hidden', function() {
            // TBD
          });
          $scope.$on('modal.removed', function() {
            // TBD
          });
          return undefined;
        }
      )()
    }
  });
}

function MeanStuffsCtrl($scope, $ionicPopover, $ionicModal)
{
  // console.log("hello mean stuffs controller function", $scope.items);

  $scope.mean_items = [];
  $scope.mean_tags = undefined;
  $scope.mean_items_filter_text = ""; // use with mean_items_filter() ...

  var items = firebase.database().ref("items");
  items.once('value').then(read_in("mean_items"));
  items.on('value', read_in("mean_items"));

  var tags = firebase.database().ref("tags");
  tags.once('value').then(read_in("mean_tags"));
  tags.on('value', read_in("mean_tags"));  

  function read_in(lhs) {
    return function(rhs) {
      $scope[lhs] = rhs.val();
    }
  }

  $scope.search_input = {
    visible : false,
    show : function() {
      var search_input_box = document.getElementById("search_input_box");
      if (search_input_box) {
        if ($scope.search_input.visible) {
          search_input_box.focus();
        } else {
          search_input_box.blur();
        }
      }
      return $scope.search_input.visible;
    },
    toggle : function() {
      return $scope.search_input.visible = !$scope.search_input.visible; }
  };

  $scope.ion_refresher_revive = function () {
    // TBD : <ion-refresher> ... </ion-refresher>
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.goto_url = function(url) {
    if ((url === undefined)  || (url.length === 0)) {
      alert("ALERT: donot know where to go (url undefined), please fill in this field");
      return;
    }
    window.location.href = url;
  }

  $scope.more = undefined; // popover menu
  $ionicPopover.fromTemplateUrl('templates/meanstuff_more.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.more = {
      popover : popover,
      title : "",
      input : undefined, // filled in when ng-click
      pop : function($event, input) {
        $scope.more.input = input;
        $scope.more.title = input.name;
        $scope.more.popover.show($event);
      },
      goto_url : function(url) {
        // console.log("url", url);
        $scope.goto_url(url);
        $scope.more.close();
      },
      remove : function(data) {
        alert("remove data " + JSON.stringify(data));
        $scope.more.close();
      },
      close : function() {
        $scope.more.popover.hide();
      },
      init_handlers : (function() {
                         $scope.$on('$destroy', function() {
                           $scope.more.popover.remove();
                         });

                         $scope.$on('popover.hidden', function() {
                           delete $scope.input;
                           // Execute action
                         });

                         $scope.$on('popover.removed', function() {
                           // Execute action
                         });
                         return undefined;
                       })()
    };
    
  });

  $scope.data = undefined; // data form to add/edit mean tiles, and interface with firebase
  $ionicModal.fromTemplateUrl('templates/meanstuff_form.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    var default_title = "Mean Detail";
    $scope.data = {
      form : modal,
      title : default_title,
      input : {}, // data form modal input
      add : function() {
        $scope.data.title = "New Entry";
        $scope.data.input = {};
        $scope.data.form.show();
        // add data
      },
      edit : function(inputs) {
        $scope.data.input = inputs || $scope.more.input;
        $scope.data.input.tags = $scope.data.input.tag.join(" ");
        // console.log("edit", JSON.stringify($scope.data.input));
        $scope.data.title = "Edit " + $scope.data.input.name;
        $scope.data.form.show();
        $scope.more.close();
      },
      close : function() {
        $scope.data.form.hide();
        $scope.data.title = default_title;
      },
      init_handlers : (
        function() {
          $scope.$on('$destroy', function() {
            $scope.data.form.remove();
          });
          
          $scope.$on('modal.hidden', function() {
            // Execute action
          });
          
          $scope.$on('modal.removed', function() {
            // Execute action
          });
          return undefined;
        }
      )()
    };
  });

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
