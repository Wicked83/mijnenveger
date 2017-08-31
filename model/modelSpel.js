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
}

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

function Vak() {
    this.bom = false;
    this.teller = 0;
    this.omgedraaid = false;
}

Vak.prototype.omdraaien = function() {
    /* omdraaien, opentrekken, resultaat omringend */
}

Vak.prototype.vlag = function() { %
    > blanco vak / "v" / "?"
}

Spel.prototype.timerStarten = function() {
    /* speltijd++ elke sec */
    console.log("Hello vanuit model");
    return ("Nog eens hello");
    /* starten/stoppen */
}

Spel.prototype.timerStoppen = function() {

}

function Timer() {
    this.timer = timerStoppen();

}

var spelletje = new Spel("Jef", 1, 2, 5);
spelletje.verdelingBommen()
    // console.log("op einde: " + this.bord)
console.log("spelletje: " + spelletje.bord)
module.exports = Spel;