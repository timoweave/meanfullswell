angular.module('MeanStarter.services', [])
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
});