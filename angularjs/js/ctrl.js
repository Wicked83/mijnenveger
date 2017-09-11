
app.controller('mijnenCtrl', ['$interval', '$http', '$mdDialog', function($interval, $http, $mdDialog) {
  var self = this;
  this.naam = '';
  this.spel = null;
  // this.tijd = 0;
  this.interval = null;
  this.running = true;
  this.top3 = [];
  this.activeTab = 0;
  // this.showCtrl1 = true;
  // this.showCtrl2 = false;
  this.fullLijst = {};
  this.sortOptie = 'naam';
  this.apiUrl = 'http://192.168.23.124:1111';
  // this.toggleViewCtrl = function(tabNum) {
  //   switch (tabNum) {
  //     case 1:
  //       this.showCtrl1 = true;
  //       this.showCtrl2= false;
  //       break;
  //     case 2:
  //       this.showCtrl1 = false;
  //       this.showCtrl2= true;
  //       break;
  //     default:
  //   }
  // };
  this.changeActiveTab = function(tabNum) {
    // angular.element(document.getElementsByTagName('md-tabs')[0]).attr('md-selected', tabNum);
    this.activeTab = tabNum;
  };
  this.stuurData = function() {
    $http({
      method: 'post',
      url: this.apiUrl + '/nieuw',
      data:  {
        naam: this.spel.spelersnaam,
        tijd: this.spel.speltijd,
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
    $http.get(this.apiUrl + '/kolommen?rij=' + this.rijenSel)
    .then(function(response) {
      // console.log(response.data);
      self.fullLijst.kolommen = response.data.map(val => +val._id);
    });
  };
  this.kolSelChange = function() {
    $http.get(this.apiUrl + '/bommen?rij=' + this.rijenSel + '&kolom=' + this.kolommenSel)
    .then(function(response) {
      // console.log(response.data);
      self.fullLijst.bommen = response.data.map(val => +val._id);
    });
  };
  this.kreegNamenEnRijen = function() {
    $http.get(this.apiUrl + '/namenlijst')
    .then(function(response) {
      // console.log(response.data);
      self.fullLijst.namen = response.data;
    });
    $http.get(this.apiUrl + '/rijen')
    .then(function(response) {
      // console.log(response.data);
      self.fullLijst.rijen = response.data;
    });
  };
  this.kreegTop3 = function(naam, rijen, kolommen, bommen) {
    var url = this.apiUrl + '/deelnemers' +
      (naam ? '?naam=' + naam : '') +
      (rijen && kolommen && bommen ? '?rijen=' + rijen + '&kolommen=' + kolommen + '&bommen=' + bommen : '');
    $http.get(url)
    .then(function(response) {
      // console.log(response.data);
      self.top3 = response.data.slice(0, 3);
    });
  };
  this.reload = function() {
    location.reload();
  };
  this.startGame = function() {
    this.spel = new Spel(this.naam, this.bommen, this.rijen, this.kolommen);
    this.saveConfig();
    this.changeActiveTab(2);
    // this.naam = '';
    this.running = true;
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
    if (this.running) {
      this.startTimer(this.spel.timer.starten);
      this.spel.vakjeOmdraaien(x, y);
      // this.spel.zoek(x, y);
      if (this.spel.einde) {
        this.stopTimer();
        this.showAlert('Booommmmmm!!!', 'You lose!!!');
      }
    }
  };
  this.handleRC = function(vak) {
    if (this.running) {
      var currVal = vak.symboolBepalen();
      vak.vlag();
      if (vak.symboolBepalen() == 'v') {
        this.spel.markedVakjes++;
      } else {
        if (currVal == 'v') {
          this.spel.markedVakjes--;
        }
      }
      if (this.spel.winControle()) {
        this.stopTimer();
        this.showAlert('Congratulations!!!', 'You win!!!');
        this.stuurData();
        this.changeActiveTab(1);
        this.kreegTop3('', this.rijen,this.kolommen,this.bommen);
      }
    }
  };
  this.startTimer = function (func) {
    this.running = true;
    if (!this.interval) {
      func();
      this.interval = $interval(() => {
              this.spel.speltijd = this.spel.timer.seconden;
          }, 1000)
    }
  };
  this.stopTimer = function () {
    this.spel.timer.stoppen();
    $interval.cancel(this.interval);
    this.interval = null;
    this.running = false;
  };

  this.showAlert = function(title, text) {
      alert = $mdDialog.alert({
        title: title,
        textContent: text,
        ok: 'Close'
      });

      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });
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
