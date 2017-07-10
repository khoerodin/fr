/**
 * Created by mispc3 on 10/07/17.
 */

$(document).on('click', '#data-tiket', function (e) {
    $('#tiketModal').modal({show: true, backdrop: 'static'});
});

$(document).on('click', '#tiketdetail', function () {
    showDetailTiket();
});

function showDetailTiket() {
    $.ajax({
        type: 'POST',
        url: '/api',
        data: {
            module: 'helpdeskticket',
            method: 'GET'
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data);
            var aaa = memberData['hydra:member'];
            var dataTicket = '';
            $.each(aaa, function (index, val) {
                dataTicket += '<tr data-id="'+val.id+'">';
                dataTicket += '<td>'+val.client.name+'</td>';
                dataTicket += '<td>'+val.staff.name+'</td>';
                dataTicket += '<td>'+val.category+'</td>';
                dataTicket += '<td>'+val.title+'</td>';
                dataTicket += '<td>'+val.message+'</td>';
                dataTicket += '<td><label class="label label-danger delete-user">DELETE</label></td>';
                dataTicket += '<tr>';
            });

            $('#data-tiket').html(dataTicket);
        },
        error: function () {

        }
    });
}

$(document).on('keypress', '#enter', function (e) {
    if (e.which === 13) {
        tampilUser();
        // var isi = $(this).val();
        // alert(isi);
        // console.log(e);
        return false;
    }
});
