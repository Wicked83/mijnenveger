/* Tip verder werker: NodeJSvoorFEO, p. 13:
Property query van de eerste parameter van de callback functie van methode get stelt de waarden van de doorgestuurde invoervelden voor. (of juister: van de querystring, dit is in de url van een request het gedeelte na het vraagteken, dat bestaat uit key-value paren)
Om hetzelfde te doen als de form naar de server gestuurd is via een POST, moeten we vooraf module body-parser installeren (npm install body-parser) en gebruiken: */


$(function () {

    // Perform other work here ...

    // Set another completion function for the request above

    /* standaard XMLHttpRequest
        $('#getIt').click(function () {
            console.log('knopke')
    
            standaard XMLHttpRequest
            var xml = new XMLHttpRequest();
            xml.onload = function () {
                if (xml.status == 200) {
                    verwerkGegevens(xml.responseText)
                }
            }
            xml.open('GET', 'http://localhost:1111/deelnemers')
            xml.send() 
    }) */

    $('#getIt').click(function () {

        var naam = $("#dnNaam").val(),
            bom = $("#dnBom").val(),
            rij = $("#dnRij").val(),
            kolom = $("#dnKolom").val();

        // var param = {
        //     "naam": naam,
        //     "bommen": bom,
        //     "rijen": rij,
        //     "kolommen": kolom
        // };
        // console.log('voor fie: ' + param);

        $.ajax({
            url: "http://localhost:1111/deelnemers",
            async: true, // overbodig
            /* success: function (param) {
                verwerkGegevens(param)
            }, */
            data: {
                "naam": naam,
                "bommen": bom,
                "rijen": rij,
                "kolommen": kolom
            },
            dataType: 'json'
        }).done(function (param) {
            console.log("naam: " + naam)
            console.log(param)
            verwerkGegevens(param)
        })
    })

    function verwerkGegevens(data) {


        // if ($("#tabelDeelnrs")) {
        $("#tabelDeelnrs").remove()
        // }  // test blijkbaar niet nodig...?
        console.log('data fie is ' + data)
        var arr = data

        $('#getIt').after(($('<table>').attr('id', 'tabelDeelnrs'))
            .append($('<thead>')
                .append($('<th>').html('Naam'))
                .append($('<th>').html('Tijd'))
                .append($('<th>').html('Bommen'))
                .append($('<th>').html('Rijen'))
                .append($('<th>').html('Kolommen')
                )).append($('<tbody>').attr('id', 'dlns')))

        /* $(pakKapstok).after($(tabel).append($(thead).append($(th)).append($(th)).append($(th))))
        after => er achter toevoegen SVGScriptElement. append => er in steken 
        append($('<th>').html('teTonen').attr('id','willekeurigID').attr('class','willekeurigeClass')) */

        console.log(arr)
        arr.forEach(function (deelnemer) {
            $('#dlns').append($('<tr>')
                .append($('<td>').html(deelnemer.naam))
                .append($('<td>').html(deelnemer.tijd))
                .append($('<td>').html(deelnemer.bommen))
                .append($('<td>').html(deelnemer.rijen))
                .append($('<td>').html(deelnemer.kolommen)))
        }, this);
    }

    $('#btnSubmit').click(function (e) {
        console.log("let's go!: " + e)
        var naam = $("#naam").val(),
            bom = $("#bom").val(),
            rij = $("#rij").val(),
            kolom = $("#kolom").val(),
            tijd = 0;
        // $.post(url [, data ] [, success ] [, dataType ] )
        /*     var url = "http://localhost:1111/nieuw";
            var data = {
                "naam": naam,
                "bommen": bom,
                "rijen": rij,
                "kolommen": kolom
            } */
        $.post({
            url: "http://localhost:1111/nieuw",
            data: {
                "naam": naam,
                "bommen": bom,
                "rijen": rij,
                "kolommen": kolom,
                "tijd": tijd
            },
            success: function () {
                console.log('ok')
            }
        })

        $("#naam").val("");
        $("#bom").val("");
        $("#rij").val("");
        $("#kolom").val("");
    })


});