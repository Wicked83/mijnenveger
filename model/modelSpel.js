'use strict';

var exports = module.exports = {};
/* spel: default params voorzien indien géén "local storage" */

function Spel(spelersnaam = "Joske", bommen = 10, rijen = 10, kolommen = 10) {
    this.spelersnaam = spelersnaam;
    this.bommen = bommen;
    this.rijen = rijen;
    this.kolommen = kolommen;
    this.speltijd = 0; // nodig wegens mog pauzeren
    this.bord = this.initialiseren();
<<<<<<< HEAD
    // this.bord = this.verdelingBommen();
    this.timer = new MijnTimer();
}

Spel.prototype.stuurData = function () {
    fetch('http://192.168.23.15', {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            naam: this.spelersnaam,
            tijd: this.timer.seconden,
            rijen: this.rijen,
            kolommen: this.kolommen,
            bommen: this.bommen
        })
    }).then(res => res.json())
        .then(res => console.log(res));
};

Spel.prototype.getTopDrie = function () {
    fetch('http://192.168.23.15')
        .then(res => res.json())
        .then(json => console.log(json));
};

Spel.prototype.initialiseren = function () {
    console.log("rijen: " + this.rijen);
    console.log("kolommen: " + this.kolommen)
=======
    this.verdelingBommen();
    // this.bomBurenTellen();
    this.timer = new MijnTimer();
}

// Spel.prototype.stuurData = function() {
//     fetch('http://192.168.23.15', {
//             method: 'post',
//             headers: {
//                 'Accept': 'application/json, text/plain, */*',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 naam: this.spelersnaam,
//                 tijd: this.timer.seconden,
//                 rijen: this.rijen,
//                 kolommen: this.kolommen,
//                 bommen: this.bommen
//             })
//         }).then(res => res.json())
//         .then(res => console.log(res));
// };
//
// Spel.prototype.getTopDrie = function() {
//     fetch('http://192.168.23.15')
//         .then(res => res.json())
//         .then(json => console.log(json));
// };


Spel.prototype.ontdekVeiligVakjes = function (rij, kolom) {

};


Spel.prototype.vakjeOmdraaien = function (rij, kolom) {
  this.bord[rij][kolom].omdraaien();
};

Spel.prototype.bomBurenTellen = function () {
  this.bord.forEach((rij, i)=> {
    rij.forEach((vak, j) => {
      vak.bomBuren = this.contoleerBuren(i, j)
    });
  });
};

Spel.prototype.contoleerBuren = function (rij, kolom) {
  var buurBommen = 0;
  // var veilig = [];
  for (var i = rij - 1; i <= rij + 1; i++) {
    if (this.bord[i]) {
      for (var j = kolom - 1; j <= kolom + 1; j++) {
        if (this.bord[i][j] && this.bord[i][j].bom) {
          buurBommen++;
          // veilig.push([i, j]);
        }
      }
    }
  }
  return buurBommen;
};

Spel.prototype.initialiseren = function() {
    // console.log("rijen: " + this.rijen);
    // console.log("kolommen: " + this.kolommen)
>>>>>>> 71d98d72ab57b4ace9b832b8f7b5e446a3c82b61
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
            // console.log("bom op " + this.bord[a][b])
        }
    }
    while (aantal);
    // console.log("klaar met bommen: " + this.bord)
}

<<<<<<< HEAD
Spel.prototype.saveConfig = function () {
    var config = {
        rijen: this.rijen,
        kolommen: this.kolommen,
        bommen: this.bommen
    };
    localStorage.setItem('bordConfig', JSON.stringify(config));
};

Spel.prototype.loadConfig = function () {
    var config = JSON.parse(localStorage.getItem('bordConfig'));
    if (config) {
        this.rijen = config.rijen;
        this.kolommen = config.kolommen;
        this.bommen = config.bommen;
    }
};
=======
// Spel.prototype.saveConfig = function() {
//     var config = {
//         rijen: this.rijen,
//         kolommen: this.kolommen,
//         bommen: this.bommen
//     };
//     localStorage.setItem('bordConfig', JSON.stringify(config));
// };
//
// Spel.prototype.loadConfig = function() {
//     var config = JSON.parse(localStorage.getItem('bordConfig'));
//     if (config) {
//         this.rijen = config.rijen;
//         this.kolommen = config.kolommen;
//         this.bommen = config.bommen;
//     }
// };
>>>>>>> 71d98d72ab57b4ace9b832b8f7b5e446a3c82b61

function Vak() {
    this.bomBuren = 0;
    this.bom = false;
    this.teller = 0;
    this.omgedraaid = false;
}

Vak.prototype.symboolBepalen = function () {
    /* ??werkt dit?? */
    var mod = ++this.teller % 3;
    return mod ? mod == 1 ? 'v' : '?' : '';
};

Vak.prototype.omdraaien = function () {
    if (this.bom) {
        //end of the game
        //alert('You are LOOOOOSEEEEER!!!');
        return false;
    } else {
      this.omgedraaid = true;

      return true;
    }
}

<<<<<<< HEAD
Vak.prototype.vlag = function () {
    this.teller++;
=======
Vak.prototype.vlag = function() {
  this.teller++;
>>>>>>> 71d98d72ab57b4ace9b832b8f7b5e446a3c82b61
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

<<<<<<< HEAD
var spelletje = new Spel("Jef", 1, 2, 5);
spelletje.verdelingBommen()
// console.log("op einde: " + this.bord)
console.log("spelletje: " + spelletje.bord)
module.exports = Spel;
=======
// var spelletje = new Spel("Jef", 1, 2, 5);
// spelletje.verdelingBommen()
    // console.log("op einde: " + this.bord)
// console.log("spelletje: " + spelletje.bord)
module.exports = Spel;
>>>>>>> 71d98d72ab57b4ace9b832b8f7b5e446a3c82b61
