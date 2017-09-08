
app.controller('mijnenCtrl', ['$interval', '$http', function($interval, $http) {
  var self = this;
  this.naam = '';
  this.spel = null;
  this.tijd = 0;
  this.interval = null;
  this.running = true;
  this.top3 = [];
  this.showCtrl1 = true;
  this.showCtrl2 = false;
  this.fullLijst = {};
  this.sortOptie = 'naam';
  this.toggleViewCtrl = function(tabNum) {
    switch (tabNum) {
      case 1:
        this.showCtrl1 = true;
        this.showCtrl2= false;
        break;
      case 2:
        this.showCtrl1 = false;
        this.showCtrl2= true;
        break;
      default:
    }
  };
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
  this.tableFlaten = function() {
    var flatArr = [];
    this.spel.bord.forEach((rij, i) => {rij.forEach((vak, j) => {
      vak.x = i;
      vak.y = j;
      flatArr.push(vak);
    })});
    return flatArr;
  };
  this.rijSelChange = function() {
    $http.get('http://192.168.23.124:1111/kolommen?rij=' + this.rijenSel)
    .then(function(response) {
      // console.log(response.data);
      self.fullLijst.kolommen = response.data.map(val => val._id);
    });
  };
  this.kreegNamenEnRijen = function() {
    $http.get('http://192.168.23.124:1111/namenlijst')
    .then(function(response) {
      // console.log(response.data);
      self.fullLijst.namen = response.data;
    });
    $http.get('http://192.168.23.124:1111/rijen')
    .then(function(response) {
      // console.log(response.data);
      self.fullLijst.rijen = response.data;
    });
  };
  this.kreegTop3 = function(naam, rijen, kolommen, bommen) {
    var url = 'http://192.168.23.124:1111/deelnemers' +
      (naam ? '?naam=' + naam : '') +
      (rijen && kolommen && bommen ? '?rijen=' + rijen + '&kolommen=' + kolommen + '&bommen=' + bommen : '');
    $http.get(url)
    .then(function(response) {
      // console.log(response.data);
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
    // this.spel.zoek(x, y);
    if (this.spel.boem || this.spel.win) {
      this.stopTimer();
      if (this.spel.win) {
        this.stuurData();

        this.toggleViewCtrl(2);
        this.kreegTop3('', this.rijen,this.kolommen,this.bommen);
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
  this.kreegNamenEnRijen();

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
