angular.module('MeanStarter.services', [])
// angular.module('MeanStarter.services', ...)
.filter('match_text', function() {
  return function(x) {
    console.log("x", x);
    var i = 0; var c = ""; var txt = "";
    for (i = 0; i < x.length; i++) {
      c = x[i];
      if (i % 2 == 0) {
        c = c.toUpperCase();
      }
      txt += c;
    }
    return txt;
  };
})

// angular.module('MeanStarter.services', ...)
.factory("match_factory", function() {
  return {
    "match_text" : match_text,
    "match_filter" : match_firebase };

  var match_text = undefined;
  function match_firebase(firebase_inputs, filter_text)
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
})
// angular.module('MeanStarter.services', ...)
.factory('mean_filter', function() {
  var self = this;
  self.filter_text = "";

  return {
    "select_text" : self.filter_text,
    "select_firebase" : self.filter_firebase };
  
  self.filter_firebase = function(firebase_inputs, filter_text)
  {
    filter_text = filter_text || self.filter_text || "";
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
  }
  
})
         
; // angular.module('MeanStarter.services', [])