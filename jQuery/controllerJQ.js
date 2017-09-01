$(function () {

    $('#getIt').click(function () {
        console.log('knopke')

        /* var xml = new XMLHttpRequest();

        xml.onload = function () {
            if (xml.status == 200) {
                verwerkGegevens(xml.responseText)
            }
        }
        xml.open('GET', 'http://localhost:1111/deelnemers')
        xml.send() */

        var x = $.ajax({
            url: 'http://localhost:1111/deelnemers',
            /* beforeSend =function () {
                console.log('start')
            },
            complete=function () {
                console.log('success: ')
            } */

        })

        $(document).ajaxSuccess(function (event, xhr, settings) {
            // if (settings.url == "http://localhost:1111/deelnemers") {
            {
                var data = xhr.responseText
                console.log("json parse =>" + JSON.parse(xhr.responseText))
                var tekst = xhr.responseJSON
                console.log("json response =>" + tekst)
                verwerkGegevens(tekst, data)

            }
        });

        // .then(console.log(this.ajax))

        // console.log(x)
    })

    function verwerkGegevens(json, txt) {
        /* test met json laten teruggeven doo ajax faalde
        console.log("txt = " + txt)
        console.log("json = " + json) */

        var arr = JSON.parse(txt)
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

});