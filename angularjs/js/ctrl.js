
app.controller('mijnenCtrl', ['$interval', '$http', function($interval, $http) {
  var self = this;
  this.naam = '';
  this.spel = null;
  this.tijd = 0;
  this.interval = null;
  this.running = true;
  this.top3 = [];

  this.stuurData = function() {
    $http({
      method: 'post',
      url: 'http://192.168.23.124:1111/nieuw',
      data:  {
        naam: this.spel.spelersnaam,
        tijd: this.tijd,
        rijen: this.spel.rijen,
        kolommen: this.spel.kolommen,
        bommen: this.spel.bommen
      }
    }).then(function(res) {
      // console.log(res);
    }).then(function(res) {
      // console.log(res);
    });
  };
  this.kreegData = function(naam, rijen, kolommen, bommen) {
    var url = 'http://192.168.23.124:1111/deelnemers' +
      (naam ? '?naam=' + naam : '') +
      (rijen && kolommen && bommen ? '?rijen=' + rijen + '&kolommen=' + kolommen + '&bommen=' + bommen : '');
    $http.get(url)
    .then(function(response) {
      console.log(response.data);
      self.top3 = response.data;
    });
  };
  this.reload = function() {
    location.reload();
  };
  this.startGame = function() {
    this.spel = new Spel(this.naam, this.bommen, this.rijen, this.kolommen);
    this.saveConfig();
  };
  this.loadConfig = function() {
    var config = JSON.parse(localStorage.getItem('bordConfig'));
    this.rijen = config ? config.rijen : 10;
    this.kolommen = config ? config.kolommen : 10;
    this.bommen = config ? config.bommen : 10;
  };
  this.saveConfig = function() {
    var config = {
        rijen: this.rijen,
        kolommen: this.kolommen,
        bommen: this.bommen
    };
    localStorage.setItem('bordConfig', JSON.stringify(config));
};
  this.handleLC = function(x, y) {
    this.startTimer(this.spel.timer.starten);
    this.spel.vakjeOmdraaien(x, y);
    if (this.spel.boem || this.spel.win) {
      this.stopTimer();
      if (this.spel.win) {
        this.stuurData();
        this.kreegData('', 10,10,10);
      }
    }
  };
  this.handleRC = function(vak) {
    vak.vlag();
  };
  this.startTimer = function (func) {
    this.running = true;
    if (!this.interval) {
      func();
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

  this.loadConfig();

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
