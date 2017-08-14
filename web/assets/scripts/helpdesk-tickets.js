/**
 * Created by mispc3 on 10/07/17.
 */

//DETAIL TIKET (UNTUK ADMIN)
$(document).on('click', '.detail-tic', function () {
    var ticketId = $(this).closest('tr').attr('id');
    $('#tiketModal .modal-body').attr('data-ticketid', ticketId);

    var staffId = $(this).closest('tr').data('staff');
    $('#tiketModal .modal-body').attr('data-staffid', staffId);

    var clientId = $(this).closest('tr').data('client');
    $('#tiketModal .modal-body').attr('data-clientid', clientId);

    var staffUserId = $(this).closest('tr').data('staff-user');
    $('#tiketModal .modal-body').attr('data-staff-userid', staffUserId);

    var timeId = $(this).closest('tr').data('waktu');
    $('.list-post-date').html(moment(timeId).format("D MMM 'YY - HH:mm a"));


    getTicketData(ticketId);
    $('#tiketModal').modal({show: true, backdrop: 'static'});



});

//CHAT klik send button
$(document).on('click', '#send', function () {
    var waktu = moment().format("ddd, D MMM YYYY, h:mm A");
    var text = $('#chatMessage').val();
    //var html = '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">Nama</span><span class="direct-chat-timestamp pull-right">'+waktu+'</span></div><div class="direct-chat-msg right"><div class="direct-chat-text">'+text+'</div></div>';
    //$(document).find('#chatHistory').append(html);
    var responseId = $('#chatHistory:last').data('id');
    var staff = $('#chatHistory:last').data('staff');
    var ticket = $('#chatHistory:last').data('ticket');
    var client = $('#chatHistory:last').data('client');

    var ticketId = $('#tiketModal .modal-body').data('ticketid');
    var staffId = $('#tiketModal .modal-body').data('staffid');
    var clientId = $('#tiketModal .modal-body').data('clientid');

    var trueTicketId;
    if(typeof ticket !== 'undefined'){
        trueTicketId = ticket;
    } else {
        trueTicketId = '/api/helpdesk/tickets/'+ticketId;
    }

    var trueStaffId;
    if(typeof staff !== 'undefined'){
        trueStaffId = staff;
    } else {
        if (typeof staffId === 'undefined') {
            trueStaffId = null;
        } else {
            trueStaffId = '/api/helpdesk/staffs/'+staffId;
        }

    }

    var trueClientId;
    if(typeof client !== 'undefined'){
        trueClientId = client;
    } else {
        trueClientId = '/api/users/'+clientId
    }

    if(text !== ''){
        postTicketData(responseId, trueStaffId, trueTicketId, trueClientId, text);
    }else{
        alert('Teks tidak boleh kosong bro..');
    }

});

//FORUM klik send button - (BELUM DIPAKAI)
$(document).on('click', '.btn-reply-tic', function () {
    var responseId = $('.mediaForum:last').data('id');
    var staff = $('.mediaForum:last').data('staff');
    var ticket = $('.mediaForum:last').data('ticket');
    var client = $('.mediaForum:last').data('client');
    //var staffUser = $('.mediaForum:last').data('staff-user');


    var ticketId = $('#tiketModal .modal-body').data('ticketid');
    var staffId = $('#tiketModal .modal-body').data('staffid');
    var clientId = $('#tiketModal .modal-body').data('clientid');
    var staffUserId = $('#tiketModal .modal-body').data('staff-userid');

    var trueTicketId;
    if(typeof ticket !== 'undefined'){
        trueTicketId = ticket;
    } else {
        trueTicketId = '/api/helpdesk/tickets/'+ticketId;
    }

    var trueStaffId;
    if(typeof staff !== 'undefined'){
        trueStaffId = staff;
    } else {
        trueStaffId = '/api/helpdesk/staffs/'+staffId;
    }

    var trueClientId;
    if(typeof client !== 'undefined'){
        trueClientId = client;
    } else {
        trueClientId = '/api/clients/'+clientId
    }

    var text = $('#replyMessage').val(); //clear text

    $('#replyMessage').focus(
        function(){
            $(this).val('');
        });

    //
    // var currentUser = $('#currentUser').val();
    // console.log(currentUser, staffUserId);
    //
    // if (currentUser === staffUserId) {
    //
    //     postTicketData(responseId, trueStaffId, trueTicketId, trueClientId, text);
    //
    // } else {
    //     // alert('anda tidak berhak');
    // }
    if(text !== ''){
        postTicketData(responseId, trueStaffId, trueTicketId, trueClientId, text);
    }else{
            alert('Teks tidak boleh kosong bro..');
    }

    $( this ).replaceWith( "<div class='btn btn-reply-tic' disabled='true'>" + $( this ).text() + "</div>" );
});

//SEND CHAT - KEYBOARD ENTER
$(document).find('#chatMessage').on('keypress', function(e){

    if ( e.which == 13 ) {
        e.preventDefault();
        $('#send').trigger('click');
    }

});

//<----------------- IS TYPING A MESSAGE -------------->
var textarea = $('#chatMessage');
var typingStatus = $('#typing_on');
var lastTypedTime = moment().format("ddd, D MMM YYYY, h:mm A");
var typingDelayMillis = 4000;


function refreshTypingStatus() {
    if (!textarea.is(':focus') || textarea.val() == '' || new Date().getTime() - lastTypedTime.getTime() > typingDelayMillis) {
        typingStatus.html('<span style="visibility: hidden">.</span>');
    } else {
        typingStatus.html('someone is typing...');
    }
}
function updateLastTypedTime() {
    lastTypedTime = new Date();
}

setInterval(refreshTypingStatus, 100);
textarea.keypress(updateLastTypedTime);
textarea.blur(refreshTypingStatus);
//<----------------- END IS TYPING A MESSAGE -------------->

//<----------------- DATE TIME MOMENT JS -------------->
var currentDay = moment().format("D MMM YYYY");
var html = '<div><span class="current-date">'+currentDay+'</span></div>';
$(document).find('.current-date').append(html);


var currentTime = moment().format("kk.mm a");
var html = '<span class="current-time">&nbsp;'+currentTime+'</span>';
$(document).find('.current-time').append(html);

var forumChat = moment().format('LLLL');
var html = '<span class="wkt direct-chat-timestamp pull-right">'+forumChat+'</span>';
$(document).find('.wkt').append(html);
//<----------------- END DATE TIME MOMENT JS -------------->

//<----------------- GET DETIL TIKET -------------->
function getTicketData(ticketId) {

    var client = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(2)').text(); //ok
    var title = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(5)').text(); //ok
    var message = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(6)').text(); //ok
    var category = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(4)').text(); //ok
    var momentPost = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(9)').text(); //ok

    $('#tiketModal .list-title').text(title);
    $('#tiketModal .list-client').text(client);
    $('#tiketModal .list-tgl-post').text(momentPost);
    $('#tiketModal .list-msg').text(message);
    $('#tiketModal .list-cat').text(category);

    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/ticket-responses',
            method: 'get',
            params: [
                {
                    'ticket.id': ticketId
                }
            ]
        },
        success: function (data) {
            var data = JSON.parse(data);
            var finalData = data['hydra:member'];

            var dataForum = '';

            $.each(finalData, function (index, value) {

                dataForum += '<div class="direct-chat-msg" data-id="/api/helpdesk/ticket-responses/'+value.id+'"  data-ticket="/api/helpdesk/tickets/'+value.ticket.id+'" data-client="/api/users/'+value.client.id+'" data-time="'+value.createdAt+'">';
                dataForum += '<div class="direct-chat-info clearfix">';
                dataForum += '<span class="direct-chat-name pull-left">'+value.client.fullname+'</span>';
                dataForum += '<span class="wkt direct-chat-timestamp pull-right">'+moment(value.createdAt).format('LLLL')+'</span>';
                dataForum += '</div>';
                dataForum += '<img class="direct-chat-img" src="../img/user4-128x128.jpg" alt="message user image">';
                dataForum += '<div class="direct-chat-text">'+value.message+'</div>';
                dataForum += '</div>';


                // dataForum += '<div id="Forum" style="background-color: #efefef">';
                // dataForum += '<div class="media mediaForum"  data-id="/api/helpdesk/ticket-responses/'+value.id+'" data-staff="/api/helpdesk/staffs/'+value.staff.id+'"  data-ticket="/api/helpdesk/tickets/'+value.ticket.id+'" data-client="/api/clients/'+value.client.id+'" style="margin-top: 10px; margin-bottom: 10px; border: #3e3b42 solid 1px;padding: 12px" data-time="/api/helpdesk/ticket-responses/'+value.responseFor+'">';
                // dataForum += '<div class="media-left media-top" style="">';
                //
                // dataForum += '<img class="direct-chat-img img-lg" src="../img/user4-128x128.jpg">';
                // // dataForum += '<img class="direct-chat-img img-lg" src="../img/user7-128x128.jpg">';
                // dataForum += '</div>';
                // dataForum += '<div class="media-body"><span class="date-post pull-right"><span class="glyphicon glyphicon-time"></span> diposting pada '+moment(value.createdAt).format("D MMM 'YY - HH:mm a")+'</span>';
                // dataForum += '<h4 class="media-heading">'+value.client.user.fullname+'</h4>'; //clientName
                // dataForum += '<h5 class="text-muted">'+value.staff.user.fullname+'</h5>'; //staffName
                // dataForum += '</div>';
                //
                // dataForum += '<div style="background-color: white; margin-left: 1px; margin-top: 10px; margin-bottom: 2px; border: #3e3b42 solid 1px;padding: 5px">'+value.message+''; //forumMessage
                //
                // dataForum += '</div>';
                // dataForum += '</div>';
                // dataForum += '</div>';
                // dataForum += '</div>';

            });


            $('#chatHistory').html(dataForum); //tbody result

        }
    });
}
//<----------------- END DETIL TIKET -------------->

//<----------------- POST TIKET DAN POST FORUM-------------->
function postTicketData(responseFor, staff, ticket, client, message, time) {
    var params = [
        {
            name: 'responseFor',
            value: responseFor
        },
        {
            name: 'staff',
            value: staff
        },
        {
            name: 'ticket',
            value: ticket
        },
        {
            name: 'client',
            value: client
        },
        {
            name: 'message',
            value: message
        },
        {
            name: 'time',
            value: ''
        }
    ];

    var parameter = [];
    $.each(params, function (index, value) {
        if (value.value) {
            parameter.push(value);
        }
    });

    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/ticket-responses',
            method: 'post',
            params: parameter
        },
        success: function (data) {
            var data = JSON.parse(data);

            if(data == 401) {

            } else {
                // if (ticket) {
                    //$("#replyMessage").val('');
                    var ticketId =  ticket.split("/").pop();
                // }

                var result = '<div class="direct-chat-msg" data-id="/api/helpdesk/ticket-responses/'+data.id+'"  data-ticket="/api/helpdesk/tickets/'+data.ticket.id+'" data-client="/api/users/'+data.client.id+'" data-time="'+data.createdAt+'"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'+data.client.fullname+'</span><span class="wkt direct-chat-timestamp pull-right">'+moment(data.createdAt).format('LLLL')+'</span></div><img class="direct-chat-img" src="../img/user4-128x128.jpg" alt="message user image"><div class="direct-chat-text">'+data.message+'</div></div>';
                $('#chatHistory').append(result);
                $('#chatMessage').val('');
            }
        }
    });
}
//<----------------- END POST TIKET DAN POST FORUM-------------->

// --------------------------------- 01 Agustus 2017 ------------------------------------------ by: dpr

//<----------------- GET LIST/DAFTAR TIKET -------------->
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

                    if (value.status === 'closed') {

                    } else if(value.status !== 'closed') {

                        tr += '<tr>';
                        tr += '<td>' + no + '</td>'
                        tr += '<td>' + value.category.name + '</td>'
                        tr += '<td>' + value.title + '</td>'
                        tr += '<td>' + value.message + '</td>'
                        tr += '<td>' + value.status + '</td>'
                        tr += '<td>' + value.priority + '</td>'
                        tr += '<td>' + moment(value.createdAt).format('LLLL') + '</td>'
                        tr += '<td>'
                        // tr += '<button data-id="' + value.id + '" class="detail-tic btn btn-default btn-xs btn-flat" title="TICKET ACTIONS"><i class="fa fa-eye"></i></button>';
                        // tr += '<button data-id="' + value.id + '" class="delete-tic btn btn-default btn-xs btn-flat" title="TICKET ACTIONS"><i class="fa fa-times"></i></button>';
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
//<----------------- END GET LIST/DAFTAR TIKET -------------->

//<----------------- KATEGORI DROPDOWN BOOTSTRAP -------------->
$("#category").select2({
    theme: "bootstrap"
});
//<----------------- KATEGORI DROPDOWN BOOTSTRAP -------------->


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

//<----------------- KONFIRMASI TIKET UNTUK STAFF -------------->
$(document).on('click', 'button.confirm-tic', function () {
    var id = $(this).data('id');

    // 7 Agustus 2017 - Detail tiket
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

            // ajax helpdesk staffs
            $.ajax({
                url: '/api',
                type: 'POST',
                data: {
                    module: 'helpdesk/staffs',
                    method: 'get'
                },
                success: function (data, textStatus, jqXHR) {
                    var data = JSON.parse(data)['hydra:member'];
                    var staff = '<option selected disabled class="text-muted">PILIH STAFF YANG AKAN DITUGASKAN.. </option>';
                    $.each(data, function (index, value) {

                        //console.log(value.id, ticketData.staff.id);

                        if (ticketData.staff) {

                            if ( value.id === ticketData.staff.id ) {
                                staff += '<option selected value="/api/helpdesk/staffs/'+value.id+'">'+value.user.fullname+'</option>';
                            } else {
                                staff += '<option value="/api/helpdesk/staffs/'+value.id+'">'+value.user.fullname+'</option>';
                            }

                        } else {
                            staff += '<option value="/api/helpdesk/staffs/'+value.id+'">'+value.user.fullname+'</option>';
                        }



                    });


                    $('#confirm-tic #formKonfirmasiTiket #id').val(id);
                    $('#confirm-tic #formKonfirmasiTiket #staff').html(staff);
                }
            });


        }
    });


    $("#formKonfirmasiTiket #staff").select2({
        theme: "bootstrap"
    });

    $('#confirm-tic').modal({show: true, backdrop: 'static'});

});
//<----------------- END KONFIRMASI TIKET UNTUK STAFF -------------->

//<----------------- ASSIGN TIKET UNTUK STAFF + UPDATE TABLE-------------->
$(document).on('click', '#assign-tic', function () {

    var params = [
        {
            name: 'staff',
            value: $('#formKonfirmasiTiket select#staff').val()

        },
        {
            name: 'status',
            value: 'assignment'

        }
    ];

    var id = $('#formKonfirmasiTiket input#id').val();
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/tickets/'+ id,
            method: 'put', //put berarti update
            params: params
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
                                $('div#confirm-tic form #'+val.propertyPath).parent('div').addClass('has-error');
                                $( '<p class="help-block">'+val.message+'</p>' ).insertAfter( 'div#confirm-tic form #'+val.propertyPath);
                            });
                        }
                    });

                    toastr.error('Error mengambil tiket');

                } else {
                    getMyAssignmentList();
                    getAll('helpdesk/tickets',[
                        'client.fullname',
                        'staff.user.fullname',
                        'category.name',
                        'title',
                        'message',
                        'priority',
                        'status',
                        'createdAt'
                    ]);
                    toastr.success('Sukses mengambil tiket');
                    $('#confirm-tic').modal('hide');

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
//<----------------- END ASSIGN TIKET UNTUK STAFF + UPDATE TABLE -------------->

//<----------------- GET LIST CLOSED TIKET-------------->
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
//<----------------- END GET LIST CLOSED TIKET-------------->

//<----------------- GET LIST ASSIGNMENT TIKET (LIST TIKET UNTUK STAFF) -------------->
getMyAssignmentList();
function getMyAssignmentList() {

    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/tickets',
            method: 'get',
            params: [
                // {
                //     'client.id' : $('#currentUser').val()
                // },
                {
                    'staff.user.id' : $('#currentUser').val()

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
                        tr += '<td>'+no+'</td>';
                        tr += '<td>'+value.category.name+'</td>';
                        tr += '<td>'+value.title+'</td>';
                        tr += '<td>'+value.message+'</td>';
                        tr += '<td>'+value.status+'</td>';
                        tr += '<td>'+value.priority+'</td>';
                        tr += '<td>'+moment(value.createdAt).format('LLLL')+'</td>';
                        tr += '<td>';
                        tr += '</td>';
                        tr += '</tr>';

                        no++;

                });

                if (no <= 1 ) {
                    tr += '<tr><td colspan="10">TIDAK ADA DATA</td></tr>'
                }

            } else {

                tr += '<tr><td colspan="10">TIDAK ADA DATA</td></tr>'

            }
            $('#assignedToMe').html(tr);
            getMyAssignmentList();

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

}
//<----------------- END LIST ASSIGNMENT TIKET (LIST TIKET UNTUK STAFF) -------------->

//<----------------- TAMPIL SEMUA TIKET KECUALI STATUS CLOSED -------------->
getAllTicketList();

function getAllTicketList() {

    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/tickets',
            method: 'get',
            // params: [
            //     // {
            //     //     'client.id' : $('#currentUser').val()
            //     // }
            // ]
        },
        success: function (data, textStatus, jqXHR) {

            var data = JSON.parse(data);
            var memberData = data['hydra:member'];

            var tr = '';
            if (memberData.length > 0) {
                var no = 1;
                $.each(memberData, function (index, value) {

                    tr += '<tr>';
                    tr += '<td>' + no + '</td>';

                    if (value.client) {
                        tr += '<td>' + value.client.fullname + '</td>'
                    } else {
                        tr += '<td>-</td>'
                    }

                    if (value.staff) {
                        tr += '<td>' + value.staff.user.fullname + '</td>'
                    } else {
                        tr += '<td>-</td>'
                    }

                    tr += '<td>' + value.category.name + '</td>';
                    tr += '<td>' + value.title + '</td>';
                    tr += '<td>' + value.message + '</td>';
                    tr += '<td>' + value.status + '</td>';
                    tr += '<td>' + value.priority + '</td>';
                    tr += '<td>' + moment(value.createdAt).format('LLLL') + '</td>';
                    tr += '<td>'
                    // tr += '<button data-id="' + value.id + '" class="detail-tic btn btn-default btn-xs btn-flat" title="TICKET ACTIONS"><i class="fa fa-eye"></i></button>';
                    // tr += '<button data-id="' + value.id + '" class="delete-tic btn btn-default btn-xs btn-flat" title="TICKET ACTIONS"><i class="fa fa-times"></i></button>';
                    tr += '</td>';
                    tr += '</tr>';

                    no++;
                });

            } else {

                tr += '<tr><td colspan="8">TIDAK ADA DATA</td></tr>'

            }

            $('#allTicketList').html(tr);

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

}
//<----------------- END TAMPIL SEMUA TIKET KECUALI STATUS CLOSED -------------->