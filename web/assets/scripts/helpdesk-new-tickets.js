// --------------------------------- 01 Agustus 2017 ------------------------------------------

getTicketList();

function getTicketList() {

    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/tickets',
            method: 'get',
            params: [
                {
                    'client.id' : $('#currentUser').val()
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {

            var data = JSON.parse(data);
            var memberData = data['hydra:member'];

            var tr = '';
            if (memberData.length > 0) {
                var no = 1;
                $.each(memberData, function (index, value) {

                    tr += '<tr id="'+value.id+'">';
                    tr += '<td>'+no+'</td>'
                    tr += '<td>'+value.category.name+'</td>'
                    tr += '<td>'+value.title+'</td>'
                    tr += '<td>'+value.message+'</td>'
                    tr += '<td>'+value.status+'</td>'
                    tr += '<td>'+value.priority+'</td>'
                    tr += '<td>'+moment(value.createdAt).format('LLLL')+'</td>'
                    tr += '<td>'
                    tr += '<button data-id="' + value.id + '" class="detail-tic btn btn-default btn-xs btn-flat" title="EDIT TIKET"><i class="fa fa-eye"></i></button>';
                    tr += '<button data-id="' + value.id + '" class="delete-tic btn btn-default btn-xs btn-flat" title="HAPUS TIKET"><i class="fa fa-times"></i></button>';
                    tr += '</td>';
                    tr += '</tr>';

                    no++;
                });

            } else {

                tr += '<tr><td colspan="6">TIDAK ADA DATA</td></tr>'

            }

            $('#ticketList').html(tr);

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

}


$("#category").select2({
    theme: "bootstrap"
});

$(document).on('click', '#btnSave', function () {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/tickets',
            method: 'POST',
            params: $('#formTiket').serializeArray()
        },
        beforeSend: function () {
            jQuery('div .has-error').removeClass('has-error');
            jQuery('p.help-block').remove();
        },
        success: function (data, textStatus, jqXHR) {

            if ( jqXHR.status === 200 ) {

                var data = JSON.parse(data);

                if ("violations" in data) {

                    $.each(data, function (index, value) {
                        if(index === 'violations'){
                            $.each(value, function (idx, val) {
                                $('div#newTicketModal form #'+val.propertyPath).parent('div').addClass('has-error');
                                $( '<p class="help-block">'+val.message+'</p>' ).insertAfter( 'div#newTicketModal form #'+val.propertyPath);
                            });
                        }
                    });

                    toastr.error('Error mengirim tiket');

                } else {
                    getTicketList();
                    toastr.success('Sukses mengirim tiket');
                    $('#newTicketModal').modal('hide');

                }

            } else {
                toastr.error('Error mengirim tiket');
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error mengirim tiket');
        }
    });
});

$(document).on('click', '.detail-tic', function () {
    var id = $(this).data('id');
    var title = $('#ticketList tr#'+id+' td:nth-child(3)').text();
    var message = $('#ticketList tr#'+id+' td:nth-child(4)').text();

    $('#formTiket #title').val(title);
    $('#formTiket #message').val(message);

    // ajax ticket by id
    $.ajax({
        url: '',
        type: '',
        data: {},
        success: function () {

            // ajax helpdesk categories
            $.ajax({
                url: '',
                type: '',
                data: {},
                success: function () {

                }
            });


        }
    });


    $('#detailNewTicketModal').modal({show: true, backdrop: 'static'});

});