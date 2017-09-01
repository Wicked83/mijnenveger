$(function () {

    $('#getIt').click(function () {
        console.log('knopke')

        var xml = new XMLHttpRequest();

        xml.onload = function () {
            if (xml.status == 200) {
                verwerkGegevens(xml.responseText)
            }
        }
        xml.open('GET', 'http://localhost:1111/deelnemers')
        xml.send()
    })

    function verwerkGegevens(data) {
        var arr = JSON.parse(data)

        /* naam
        tijd
        bommen
        rijen
        kolommen */

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
        append($('<th>').html('teTonen').attr('id','willekeurigID').attr('class','willekeurigeClass'))
        */
        console.log(arr)
        arr.forEach(function (deelnemer) {
            $('#dlns').append($('<tr>')
                .append($('<td>').html(deelnemer.naam))
                .append($('<td>').html(deelnemer.tijd))
                .append($('<td>').html(deelnemer.bommen))
                .append($('<td>').html(deelnemer.rijen))
                .append($('<td>').html(deelnemer.kolommen))
            )


            console.log(deelnemer.naam)
        }, this);
    }



    //     var xml = new XMLHttpRequest();

    //     /*  $.ajax({
    //          method: "POST",
    //          url: "localhost:1111/deelnemers",
    //          data: { name: "John", location: "Boston" }
    //        })
    //          .done(function( msg ) {
    //            alert( "Data Saved: " + msg );
    //          }); */

    //     var jqxhr = $.ajax({
    //         method: "POST",
    //         url: "localhost:1111/deelnemers",
    //         data: { name: "John", location: "Boston" }
    //     })
    //         .done(function () {
    //             alert("success");
    //         })
    //         .fail(function () {
    //             alert("error");
    //         })
    //         .always(function () {
    //             alert("complete");
    //         });

    //     // Perform other work here ...

    //     // Set another completion function for the request above
    //     jqxhr.always(function () {
    //         alert("second complete");
    //     });

    //     console.log(jqxhr)

});