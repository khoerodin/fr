// --------------------------------- 01 Agustus 2017 ------------------------------------------

getTicketList();
//get data tiket
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

                    if(value.status === 'closed') {

                        tr += '<tr id="' + value.id + '" class="text-muted">';
                        tr += '<td>' + no + '</td>'
                        tr += '<td>' + value.category.name + '</td>'
                        tr += '<td>' + value.title + '</td>'
                        tr += '<td>' + value.message + '</td>'
                        tr += '<td class="text-danger">' + value.status + '</td>'
                        tr += '<td>' + value.priority + '</td>'
                        tr += '<td>' + moment(value.createdAt).format('LLLL') + '</td>'
                        tr += '<td>'
                        // tr += '<button data-id="' + value.id + '" class="detail-tic btn btn-default btn-xs btn-flat" title="EDIT TIKET"><i class="fa fa-eye"></i></button>';
                        // tr += '<button data-id="' + value.id + '" class="delete-tic btn btn-default btn-xs btn-flat" title="HAPUS TIKET"><i class="fa fa-times"></i></button>';
                        tr += '</td>';
                        tr += '</tr>';

                        no++;
                    } else {

                        tr += '<tr id="'+value.id+'">';
                        tr += '<td>'+no+'</td>'
                        tr += '<td>'+value.category.name+'</td>'
                        tr += '<td>'+value.title+'</td>'
                        tr += '<td>'+value.message+'</td>'
                        tr += '<td>'+value.status+'</td>'
                        tr += '<td>'+value.priority+'</td>'
                        tr += '<td>'+moment(value.createdAt).format('LLLL')+'</td>'
                        tr += '<td>'
                        // tr += '<button data-id="' + value.id + '" class="detail-tic btn btn-default btn-xs btn-flat" title="EDIT TIKET"><i class="fa fa-eye"></i></button>';
                        // tr += '<button data-id="' + value.id + '" class="delete-tic btn btn-default btn-xs btn-flat" title="HAPUS TIKET"><i class="fa fa-times"></i></button>';
                        tr += '</td>';
                        tr += '</tr>';

                        no++;
                    }
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

resetDropDown();

function resetDropDown() {
    $("#newTicketModal #category").select2({
        theme: "bootstrap"
    });
}


//save ticket
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
                    $("#newTicketModal #message").val('');
                    $("#newTicketModal #title").val('');

                    $("#newTicketModal #category #pilih").prop('selected', true);

                    resetDropDown();
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

    //3 Agustus 2017 - Detail tiket
    // ajax ticket by id
    $.ajax({
        url: '/api',
        type: 'POST',
        data:  {
            'module' : 'helpdesk/tickets/' + id,
            'method' : 'get'
        },
        success: function (ticketData, textStatus, jqXHR) {

            var ticketData = JSON.parse(ticketData);

            $('#detailNewTicketModal #formTiket #title').val(ticketData.title);
            $('#detailNewTicketModal #formTiket #message').val(ticketData.message);
            $('#detailNewTicketModal #formTiket #id').val(ticketData.id);


            // ajax helpdesk categories
            $.ajax({
                url: '/api',
                type: 'POST',
                data: {
                    module: 'helpdesk/categories',
                    method: 'get'
                },
                success: function (data, textStatus, jqXHR) {
                    var data = JSON.parse(data)['hydra:member'];
                    var category = '';
                    $.each(data, function (index, value) {

                        if ( value.id === ticketData.category.id ) {
                            category += '<option selected value="/api/helpdesk/categories/'+value.id+'">'+value.name+'</option>';
                        } else {
                            category += '<option value="/api/helpdesk/categories/'+value.id+'">'+value.name+'</option>';
                        }

                    });

                    $('#detailNewTicketModal #formTiket #category').html(category);
                }
            });


        }
    });


    $("#formTiket #category").select2({
        theme: "bootstrap"
    });

    $('#detailNewTicketModal').modal({show: true, backdrop: 'static'});

});
//update / edit
$(document).on('click', '#btnUpdate', function () {
    var id = $('#detailNewTicketModal #formTiket #id').val();

    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/tickets/' + id,
            method: 'put',
            params : $('#detailNewTicketModal #formTiket').serializeArray()
        },
        success: function (data, textStatus, jqXHR) {

            if ( jqXHR.status === 200 ) {

                var data = JSON.parse(data);

                if ("violations" in data) {

                    $.each(data, function (index, value) {
                        if(index === 'violations'){
                            $.each(value, function (idx, val) {
                                $('div#detailNewTicketModal form #'+val.propertyPath).parent('div').addClass('has-error');
                                $( '<p class="help-block">'+val.message+'</p>' ).insertAfter( 'div#detailNewTicketModal form #'+val.propertyPath);
                            });
                        }
                    });

                    toastr.error('Error memperbarui tiket');

                } else {
                    getTicketList();
                    toastr.success('Sukses memperbarui tiket');
                    $('#detailNewTicketModal').modal('hide');

                }

            } else {
                toastr.error('Error memperbarui tiket');
            }

        }
    });

});

// Delete action
$(document).on('click', '.delete-tic', function () {
    var module = window.module;
    var id = $(this).attr('data-id');
    var elm = jQuery('tbody[data-list="'+module+'"] tr#'+id);
    elm.addClass('bg-red');
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/tickets/' + id,
            method: 'delete'
        },
        success: setTimeout(function(){
            bootbox.confirm({
                message: "ARE YOU SURE YOU WANT TO DELETE THIS DATA?",
                animate: false,
                buttons: {
                    confirm: {
                        className: 'btn-danger btn-flat'
                    },
                    cancel: {
                        className: 'btn-default btn-flat'
                    }
                },
                callback: function (result) {
                    if (result === false) {
                        elm.removeClass('bg-red');
                    } else {
                        getTicketList();
                    }
                }
            });
        }, 20)

    })
});

//GET CLOSED TICKETS
getClosedTicketList();
function getClosedTicketList() {

    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/tickets',
            method: 'get',
            params: [
                {
                    'client.id' : $('#currentUser').val()
                },
                {
                    name: 'status',
                    value: 'closed'

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

                    if (value.status === 'closed') {

                        tr += '<tr id="'+value.id+'" class="text-muted">';
                        tr += '<td>'+no+'</td>';
                        tr += '<td>'+value.category.name+'</td>';
                        tr += '<td>'+value.title+'</td>';
                        tr += '<td>'+value.message+'</td>';
                        tr += '<td class="text-danger">'+value.status+'</td>';
                        tr += '<td>'+value.priority+'</td>';
                        tr += '<td>'+moment(value.createdAt).format('LLLL')+'</td>';
                        tr += '<td>';
                        tr += '</td>';
                        tr += '</tr>';

                        no++;

                    }

                });

                if (no <= 1 ) {
                    tr += '<tr><td colspan="10">TIDAK ADA DATA</td></tr>'
                }

            } else {

                tr += '<tr><td colspan="10">TIDAK ADA DATA</td></tr>'

            }
            $('#closedTicketList').html(tr);

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

}