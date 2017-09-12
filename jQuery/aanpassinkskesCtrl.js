// regel 155
function controleerEindeSpel(klik) {
    if (spel.einde) {
        timer.stoppen();
        if (klik == "links") {
            // $("#divSpelbord").html("YOU LOOOSE !!!");
            $("#divSpelbord").prepend($('<img>').attr("src", "Images/lose.jpg"));
            $("#speelveld").hide();


        } else {
            // $("#divSpelbord").html("YOU WIN !!!")
            $("#divSpelbord").prepend($('<img>').attr("src", "Images/win.jpg"));
            $("#speelveld").hide();
        }
    }
}