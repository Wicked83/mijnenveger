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
    // this.bord = this.verdelingBommen();
    this.timer = new Timer();
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
      tijd: this.timer.eindtijd,
      rijen: this.rijen,
      kolommen: this.kolommen,
      bommen: this.bommen
    })
  }).then(res=>res.json())
    .then(res => console.log(res));
  };

Spel.prototype.getTopDrie = function () {
  fetch('http://192.168.23.15')
    .then(res=>res.json())
    .then(json => console.log(json));
  };
};

Spel.prototype.initialiseren = function() {
    console.log("rijen: " + this.rijen);
    console.log("kolommen: " + this.kolommen)
    var arr = [];
    for (var i = 0; i < this.rijen; i++) {
        arr[i] = [];
        for (var y = 0; y < this.kolommen; y++) {
            arr[i][y] = new Vak();
        }
    }
    return arr;
}

Spel.prototype.verdelingBommen = function() {
    // random bommen in vakjes steken
    var aantal = this.bommen;
    do {
        var a = Math.floor(Math.random() * this.rijen);
        var b = Math.floor(Math.random() * this.kolommen);
        if (!this.bord[a][b].bom) {
            aantal--;
            this.bord[a][b].bom = true;
            console.log("bom op " + this.bord[a][b])
        }
    }
    while (aantal);
    console.log("klaar met bommen: " + this.bord)
}

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

function Vak() {
    this.bom = false;
    this.teller = 0;
    this.omgedraaid = false;
}

Vak.prototype.symboolBepalen = function () {
  var mod = this.teller % 3;
  return mod ? mod == 1 ? 'v' : '?' : ''
};

Vak.prototype.omdraaien = function() {
    if (this.bom) {
      //end of the game
      alert('You are LOOOOOSEEEEER!!!');
    } else {
      this.omgedraaid = true;
    }
}

Vak.prototype.vlag = function() {
  this.teller++;
}

function Timer() {
  this.timer = timerStoppen();

}

Timer.prototype.timerStarten = function() {
    /* speltijd++ elke sec */
    console.log("Hello vanuit model");
    return ("Nog eens hello");
    /* starten/stoppen */
}

Timer.prototype.timerStoppen = function() {

}


var spelletje = new Spel("Jef", 1, 2, 5);
spelletje.verdelingBommen()
    // console.log("op einde: " + this.bord)
console.log("spelletje: " + spelletje.bord)
module.exports = Spel;
