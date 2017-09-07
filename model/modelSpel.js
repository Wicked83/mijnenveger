'use strict';

// var exports = module.exports = {};
/* spel: default params voorzien indien géén "local storage" */

function Spel(spelersnaam = "Joske", bommen = 10, rijen = 10, kolommen = 10) {
    this.spelersnaam = spelersnaam;
    this.bommen = bommen;
    this.rijen = rijen;
    this.kolommen = kolommen;
    this.speltijd = 0; // nodig wegens mog pauzeren
    this.bomCoords = [];
    this.bord = this.initialiseren();
    this.verdelingBommen();
    this.timer = new MijnTimer();
    this.boem = false;
    this.win = false;
    this.omgedraaideVakjes = 0;
}


Spel.prototype.ontdekVeiligVakjes = function (rij, kolom) {
  var self = this;
  if (this.bord[rij][kolom].bomBuren != null) {
    return false;
  }
  var veiligeBuren = this.contoleerBuren(rij, kolom);

  veiligeBuren.forEach(koords => {
    this.vakjeOmdraaien(koords[0], koords[1]);

    // (function f(index, array) {
    //   if (index < array.length) {
    //     var vak = self.bord[array[index][0]][array[index][1]];
    //     setTimeout(function() {
    //       if (!vak.omgedraaid) {
    //         if (vak.bom) {
    //           self.boem = true;
    //         } else {
    //           vak.omgedraaid = true;
    //           self.omgedraaideVakjes++;
    //
    //           self.ontdekVeiligVakjes(array[index][0], array[index][1]);
    //           f(index + 1, array);
    //         }
    //       }
    //     }, 200);
    //   }
    // })(0, veiligeBuren);

  });
  this.winControle();
};



Spel.prototype.winControle = function () {
  this.win = (this.omgedraaideVakjes == this.kolommen * this.rijen - this.bommen);
};

// Spel.prototype.zoek = function (rij, kolom, vakjes) {
//
//   var veiligeBuren = this.contoleerBuren(rij, kolom);
//
//   if (veiligeBuren.length == 0) {
//     console.log(vakjes.length);
//   }
//   veiligeBuren.forEach(koords => {
//
//     if (this.bord[koords[0]][koords[1]].bomBuren == null) {
//       if (!this.bord[koords[0]][koords[1]].bom) {
//
//         vakjes.push(this.bord[koords[0]][koords[1]]);
//         this.zoek(koords[0], koords[1], vakjes);
//       }
//     }
//   });


  // this.winControle();


  // var buren = [];
  // var r = rij;
  // var k = kolom;
  // while (this.bord[r][k].bomBuren == null) {
  //   var veiligeBuren = this.contoleerBuren(r, k);
  //   buren = buren.concat(veiligeBuren);
  //   veiligeBuren.forEach(koords => {
  //     if (!this.bord[rij][kolom].omgedraaid) {
  //       if (!this.bord[koords[0]][koords[1]].bom) {
  //         r = koords[0];
  //         k = koords[1];
  //       }
  //     }
  //   });
  // }
  // buren.forEach(koords => {
  //   this.vakjeOmdraaien(koords[0], koords[1])
  // });
  // console.log(buren);
  // return buren;
// };



Spel.prototype.vakjeOmdraaien = function (rij, kolom) {
  if (!this.bord[rij][kolom].omgedraaid) {
    if (this.bord[rij][kolom].bom) {
      this.boem = true;
      return false;
    } else {
      this.bord[rij][kolom].omgedraaid = true;
      this.omgedraaideVakjes++;
      this.ontdekVeiligVakjes(rij, kolom);
      return true;
    }
  }
};

Spel.prototype.contoleerBuren = function (rij, kolom) {
  var buurBommen = 0;
  var veiligeBuren = [];
  for (var i = rij - 1; i <= rij + 1; i++) {
    if (this.bord[i]) {
      for (var j = kolom - 1; j <= kolom + 1; j++) {
        if (this.bord[i][j]) {
          if (this.bord[i][j].bom) {
            buurBommen++;
          } else {
            if (!this.bord[i][j].omgedraaid) {
              veiligeBuren.push([i, j]);
            }
          }
        }
      }
    }
  }
  this.bord[rij][kolom].bomBuren = buurBommen;
  return !buurBommen ? veiligeBuren : [];
};

Spel.prototype.initialiseren = function() {
    var arr = [];
    for (var x = 0; x < this.rijen; x++) {
        arr[x] = [];
        for (var y = 0; y < this.kolommen; y++) {
            arr[x][y] = new Vak();
        }
    }
    return arr;
}

Spel.prototype.verdelingBommen = function () {
    // random bommen in vakjes steken
    var aantal = this.bommen;
    do {
        var a = Math.floor(Math.random() * this.rijen);
        var b = Math.floor(Math.random() * this.kolommen);
        if (!this.bord[a][b].bom) {
            aantal--;
            this.bord[a][b].bom = true;
            this.bomCoords.push([a, b]);
        }
    }
    while (aantal);
}

function Vak() {
    this.bomBuren = null;
    this.bom = false;
    this.teller = 0;
    this.omgedraaid = false;
}

Vak.prototype.symboolBepalen = function () {
    var mod = this.teller % 3;
    return mod ? mod == 1 ? 'v' : '?' : '';
};

Vak.prototype.omdraai = function() {
  if (this.bom) {
    this.boem = true;
    return false;
  } else {
    this.omgedraaid = true;
    return true;
  }
};

Vak.prototype.vlag = function () {
    this.teller++;
}

function MijnTimer() {
    var self = this;
    self.interval = null;
    self.seconden = 0;


    self.starten = function () {
        self.seconden = 0;
        self.interval = setInterval(self.tellen, 1000);
    }


    self.tellen = function () {
        self.seconden += 1;
    }

    self.stoppen = function () {
        if (self.interval != null)
            clearTimeout(self.interval);
    }

    self.hernemen = function () {
        self.interval = setInterval(self.tellen, 1000);
    }

}

// module.exports = Spel;
