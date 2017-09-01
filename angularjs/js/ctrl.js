app.controller('mijnenCtrl', ['$interval', function($interval) {
  // var this = this;
  this.spel = new Spel();
  this.tijd = 0;
  this.interval = null;
  this.running = false;
  this.handleLC = function(x, y) {
    this.startTimer(this.spel.timer.starten);
    this.spel.vakjeOmdraaien(x, y);
  };

  this.handleRC = function(vak) {
    vak.vlag();
  };
  this.startTimer = function (f) {
    this.running = true;
    if (!this.interval) {
      f();
      this.interval = $interval(() => {
              this.tijd = this.spel.timer.seconden;
          }, 1000)
    }
  };
  this.stopTimer = function () {
    this.spel.timer.stoppen();
    $interval.cancel(this.interval);
    this.interval = null;
    this.running = false;
  };
  // this.timer = function() {
  //   var begin = new Date().getTime();
  //   if (!this.interval) {
  //     this.interval = $interval(() => {
  //         this.tijd = (new Date().getTime() - begin) / 1000;
  //       console.log(this.tijd);
  //     }, 1000)
  //   }
  // };
}]);


app.directive('ngRightClick', function($parse) {
  return function(scope, element, attrs) {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', function(event) {
      scope.$apply(function() {
        event.preventDefault();
        fn(scope);
      });
    });
  };
});
