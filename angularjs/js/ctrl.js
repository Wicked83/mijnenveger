
app.controller('mijnenCtrl', ['$interval', '$http', '$mdDialog', function($interval, $http, $mdDialog) {
  var self = this;
  this.naam = '';
  this.spel = null;
  this.flatBord = [];
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
  // this.apiUrl = 'http://localhost:1111';
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
  this.kreegTop3 = function(naam, rijen, kolommen, bommen) {
    var url = this.apiUrl + '/deelnemers' +
      (naam ? '?naam=' + naam : '') +
      (rijen && kolommen && bommen ? '?rijen=' + rijen + '&kolommen=' + kolommen + '&bommen=' + bommen : '');
    $http.get(url)
    .then(function(response) {
      // console.log(url);
      // console.log(response.data);
      self.top3 = response.data.slice(0, 3);
    });
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
      self.kreegTop3('', self.rijen,self.kolommen,self.bommen);
      if (res.data[0] == 'J') {
        var spellerIndex = self.top3.findIndex( speller =>
          speller.naam == res.config.data.naam &&
          speller.rijen == res.config.data.rijen &&
          speller.kolommen == res.config.data.kolommen &&
          speller.bommen == res.config.data.bommen
         );
         self.top3[spellerIndex].bold = true;
      }
      // console.log('success', res);
    }).then(function(res) {
      // console.log('errrorr',res);
    });
  };

  //omdraien met vertraging functies
  this.tableReborn = function() {
    return this.spel.bord.map((rij, i) => rij.map((vak, j) => {
      vak.marked = false;
      vak.x = i;
      vak.y = j;
      return vak;
    }))//.reduce((a, b) => a.concat(b));
  };

  this.tableFlaten = function() {
    return this.spel ? this.spel.bord.reduce((a, b) => a.concat(b)) : null;
  };

  this.zoek = function(rij, kolom, array) {
    var buurBommen = 0;
    var veiligeBuren = [];
    for (var i = rij - 1; i <= rij + 1; i++) {
        if (this.spel.bord[i]) {
            for (var j = kolom - 1; j <= kolom + 1; j++) {
                if (this.spel.bord[i][j]) {
                    if (this.spel.bord[i][j].bom) {
                        buurBommen++;
                    } else {
                        if (!this.spel.bord[i][j].marked) {
                            veiligeBuren.push([i, j]);
                        }
                    }
                }
            }
        }
    }
    this.spel.bord[rij][kolom].bomBuren = buurBommen;
    veiligeBuren = !buurBommen ? veiligeBuren : [];
    if (veiligeBuren.length) {

      veiligeBuren.forEach(koords => {
        var r = koords[0];
        var k = koords[1];
        if (!this.spel.bord[r][k].marked && this.spel.bord[r][k].symboolBepalen() != 'v') {
          this.spel.bord[r][k].marked = true;
          array.push(this.spel.bord[r][k]);
          this.zoek(r, k, array);
        }
      });
    }

    return array;
  };

  this.draaiVakjesTrager = function(vakjes) {
    // vakjes.forEach(vak => vak.omdraai());
    (function f(index, array) {
      if (index < array.length) {
        setTimeout(function() {
            array[index].omdraai();
            this.flatBord = self.tableFlaten();
            // $('#' + array[index].id).addClass('flipOutY');
          f(index + 1, array);
        }, 10);
        // func(100)(array[index]).then(function(vak) {
        //   vak.omdraai();
        // });
        // f(index + 1, array, func);

      }
    })(0, vakjes);

  };

  // this.delay = function(milliseconds) {
  //   return function(result) {
  //     return new Promise(function(resolve, reject) {
  //       setTimeout(function() {
  //         resolve(result);
  //       }, milliseconds);
  //     });
  //   };
  // };
// end
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

  // this.reload = function() {
  //   location.reload();
  // };
  this.startGame = function() {
    this.spel = new Spel(this.naam, this.bommen, this.rijen, this.kolommen);
    this.spel.bord = this.tableReborn();
    this.flatBord = this.tableFlaten();
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

        // if (!this.spel.bord[x][y].omgedraaid && this.spel.bord[x][y].symboolBepalen() != 'v') {
        //     this.spel.bord[x][y].omdraai();
        //     // $('#' + this.spel.bord[x][y].id).addClass('flipOutY');
        //     this.draaiVakjesTrager(this.zoek(x, y, []));
        // }

      this.spel.vakjeOmdraaien(x, y);
      // this.flatBord = this.tableFlaten();
      // console.log(this.flatBord[x * this.rijen + y]);
      // console.log(this.zoek(x, y, []));
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
      this.spel.winControle();
      if (this.spel.einde) {
        this.stopTimer();
        this.showAlert('Congratulations!!!', 'You win!!!');
        this.stuurData();

        this.changeActiveTab(1);
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

}]).config(function($mdIconProvider) {
    $mdIconProvider
      .icon('play', 'images/ic_play_arrow_black_24px.svg', 24)
       .icon('pause', 'images/ic_pause_circle_filled_black_24px.svg', 24)
   });

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
