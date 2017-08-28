/**
 * Created by mispc3 on 10/07/17.
 */

//DETAIL TIKET (UNTUK ADMIN)
$(document).on('click', '.detail-my-tic', function () {
    var ticketId = $(this).closest('tr').attr('id');
    $('#tiketModal .modal-body').attr('data-ticketid', ticketId);

    var staffId = $(this).closest('tr').attr('staff');
    $('#tiketModal .modal-body').attr('data-staffid', staffId);

    var clientId = $(this).closest('tr').attr('client');
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
        trueClientId = '/api/users/'+clientId;
    }

    if ($('#tiketModal .modal-body').data('clientid') === $('#currentUser').val()) {

        trueClientId = trueClientId;

    } else {
        trueTicketId = null;
    }

    if ($('#tiketModal .modal-body').data('staffid') !== $('#currentUser').val()) {

        trueStaffId = trueStaffId;

    } else {
        trueStaffId = null;
    }

    if(text !== ''){
        postTicketData(responseId, trueStaffId, trueTicketId, trueClientId, text);
    }else{
        // alert('Teks tidak boleh kosong bro..');
        toastr.error('Error! Teks tidak boleh kosong!');
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

// //<----------------- IS TYPING A MESSAGE -------------->
// var textarea = $('#chatMessage');
// var typingStatus = $('#typing_on');
// var lastTypedTime = moment().format("ddd, D MMM YYYY, h:mm A");
// var typingDelayMillis = 4000;
//
//
// function refreshTypingStatus() {
//     if (!textarea.is(':focus') || textarea.val() == '' || new Date().getTime() - lastTypedTime.getTime() > typingDelayMillis) {
//         typingStatus.html('<span style="visibility: hidden">.</span>');
//     } else {
//         typingStatus.html('someone is typing...');
//     }
// }
// function updateLastTypedTime() {
//     lastTypedTime = new Date();
// }
//
// setInterval(refreshTypingStatus, 100);
// textarea.keypress(updateLastTypedTime);
// textarea.blur(refreshTypingStatus);
// //<----------------- END IS TYPING A MESSAGE -------------->

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

//<----------------- GET DETIL TIKET UNTUK TIKET RESPON-------------->
function getTicketData(ticketId) {

    var client = $('tbody#allTicketList tr#'+ticketId+' td:nth-child(2)').text();
    var staff = $('tbody#allTicketList tr#'+ticketId+' td:nth-child(3)').text();
    var title = $('tbody#allTicketList tr#'+ticketId+' td:nth-child(5)').text();
    var category = $('tbody#allTicketList tr#'+ticketId+' td:nth-child(4)').text();
    var momentPost = $('tbody#allTicketList tr#'+ticketId+' td:nth-child(8)').text();
    var msg = $('#allTickets tr#'+ticketId).data('msg');
    // var message = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(6)').text();
    // var message = $('#msg').text();

    $('#tiketModal .listDetail #list-title').text(title);
    $('#tiketModal .listDetail #list-client').text(client);
    $('#tiketModal .listDetail #list-tgl-post').text(momentPost);
    // $('#tiketModal #chatHistory').text(message);
    $('#tiketModal .listDetail #list-cat').text(category);


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
        success: function (data, value) {
            var data = JSON.parse(data);
            // console.log(data);
            var finalData = data['hydra:member'];

            // if(('#currentUser').val()){
                var tr = '<div class="media" id="mediaForum"><div class="media-left"><img src="http://enadcity.org/enadcity/wp-content/uploads/2017/02/profile-pictures.png" class="media-object" style="width:60px"></div><div class="media-body"><h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  '+moment(value.createdAt).format('LLLL')+'</h6><h4 class="media-heading">'+client+'</h4><p>'+msg+'</p></div></div><hr>';
            // } else {
            //     var tr = '<div class="media" id="mediaForum"><div class="media-left"><img src="http://enadcity.org/enadcity/wp-content/uploads/2017/02/profile-pictures.png" class="media-object" style="width:60px"></div><div class="media-body"><h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  ' + moment(value.createdAt).format('LLLL') + '</h6><h4 class="media-heading">' + client + '</h4><p>' + value.message + '</p></div></div><hr>';
            // }

            $.each(finalData, function (index, value) {

                // console.log(data);

                tr += '<div class="media" id="mediaForum" data-id="/api/helpdesk/ticket-responses/'+value.id+'"';

                if (value.ticket) {
                    tr += 'data-ticket="/api/helpdesk/tickets/'+value.ticket.id+'"';
                }

                if (value.client) {
                    tr += 'data-client="/api/users/' + value.client.id + '"';
                }

                if (value.staff) {
                    tr += 'data-staff="/api/helpdesk/staffs/'+value.staff.user.id+'"';
                }

                tr += ' data-time="'+value.createdAt+'"';

                tr += '>';
                tr += '<div class="media-left">';
                // if (value.client) {
                //     tr += '<img src="/api/helpdesk/ticket-responses/'+value.client.profileImage+'" class="media-object" style="width:60px">';
                // }

                tr += '<img src="http://enadcity.org/enadcity/wp-content/uploads/2017/02/profile-pictures.png" class="media-object" style="width:60px">';
                tr += '</div>';
                tr += '<div class="media-body">';
                tr += '<h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  '+moment(value.createdAt).format('LLLL')+'</h6>';


                if(value.client.id === $('#currentUser').val() ) {
                    tr += '<h4 class="media-heading">'+value.client.fullname+'</h4>';
                } else {
                    tr += '<h4 class="media-heading">'+value.staff.user.fullname+'</h4>';
                }

                tr += '<p>'+value.message+'</p>';
                tr += '</div>';
                tr += '</div>';
                tr += '<hr>';
            });


            $('#chatHistory').html(tr); //tbody result

        }
    });
}
//<----------------- END DETIL TIKET UNTUK TIKET RESPON -------------->

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

            if(data === 401) {

            } else {
                // if (ticket) {
                    //$("#replyMessage").val('');
                    // var ticketId =  ticket.split("/").pop();
                // }

                // if (value.staff) {
                //     tr += 'data-staff="/api/helpdesk/staffs/'+value.staff.user.id+'"';
                // }

                var result = '<div class="media" id="mediaForum" data-id="/api/helpdesk/ticket-responses/'+data.id+'"';

                if (data.ticket) {
                    result += 'data-ticket="/api/helpdesk/tickets/'+data.ticket.id+'"';
                }

                if (data.client) {
                    result += 'data-client="/api/users/' + data.client.id + '"';
                }

                if (data.staff) {
                    result += 'data-staff="/api/helpdesk/staffs/'+data.staff.user.id+'"';
                }

                result += ' data-time="'+data.createdAt+'">';
                result += '<div class="media-body">';
                result += '<h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  '+moment(data.createdAt).format('LLLL')+'</h6>';

                if(data.staff.user.id === $('#currentUser').val()) {
                    result += '<h4 class="media-heading">'+data.staff.user.fullname+'</h4>';
                } else {
                    result += '<h4 class="media-heading">'+data.client.fullname+'</h4>';
                }

                console.log($('#currentUser').val());
                console.log(data.staff.user.id);

                result += '<p>'+data.message+'</p>';
                result += '</div>';
                result += '<div class="media-right">';
                // if(data.client) {
                    result += '<img src="http://enadcity.org/enadcity/wp-content/uploads/2017/02/profile-pictures.png" class="media-object" style="width:60px">';
                // }
                result += '</div>';
                result += '</div>';
                result += '<hr>';

                $('#chatHistory').append(result);
                $('#chatMessage').val('');

                //---------------- send notifikasi ---------------

                $.ajax({
                    url: '/api',
                    type: 'POST',
                    data: {
                        module: 'notifications',
                        method: 'POST',
                        params: [
                            {
                                name: 'domain',
                                value: 'Helpdesk Tiket - Post Forum'
                            },
                            {
                                name: 'receiver',
                                value: $('#currentUser').val() //klien menerima pesan dari staff sebagai sender
                            },
                            {
                                name: 'sender',
                                value: data.staff.user.id //staff terpilih berkomunikasi dengan klien sebagai receiver
                            },
                            {
                                name: 'message',
                                value: data.message
                            },
                            {
                                name: 'read',
                                value: false
                            }
                        ],
                        success: function (data, textStatus, jqXHR) {

                        }
                    }
                });

            }
        }
    });
}
//<----------------- END POST TIKET DAN POST FORUM-------------->

// --------------------------------- 01 Agustus 2017 ------------------------------------------
//<----------------- GET LIST/DAFTAR TIKET (MY TICKET)-------------->
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

                    // tr += 'data-client="/api/users/' + value.client.id + '"';

                    if (value.staff) {
                        tr += 'data-staff="/api/helpdesk/staffs/'+value.staff.user.id+'"';
                    }
                        tr += '<tr id="'+ value.id +'" data-ticket="/api/helpdesk/tickets/'+value.id+'" data-client="/api/users/'+value.client.id+'">';
                        tr += '<td>' + no + '</td>';
                        tr += '<td>' + value.category.name + '</td>';
                        tr += '<td>' + value.title + '</td>';
                        // tr += '<td>' + value.message + '</td>';

                        if(value.status === 'open') {

                            tr += '<td align="center"><div class="fa fa-ticket fa-2x" data-toggle="tooltip" data-placement="bottom" title="Open" style="color: orange;"></div></td>'

                        } else if (value.status === 'assignment') {

                            tr += '<td align="center"><div class="fa fa-tag fa-2x" data-toggle="tooltip" data-placement="bottom" title="Assignment" style="color: cornflowerblue;"></div></td>'

                        } else if (value.status === 'closed') {

                            tr += '<td align="center"><div class="fa fa-close fa-2x" data-toggle="tooltip" data-placement="bottom" title="Closed" style="color: indianred"></div></td>';

                        } else if (value.status === 'onprogress') {

                            tr += '<td align="center"><div class="fa fa-pencil fa-2x" data-toggle="tooltip" data-placement="bottom" title="On Progress" style="color: gold"></div></td>';

                        } else if (value.status === 'resolved') {

                            tr += '<td align="center"><div class="fa fa-check fa-2x" data-toggle="tooltip" data-placement="bottom" title="Resolved" style="color: lawngreen"></div></td>';

                        }

                        if(value.priority === 'very_urgent') {

                            tr += '<td align="center"><div class="fa fa-fighter-jet fa-2x" data-toggle="tooltip" data-placement="bottom" title="Very Urgent" style="color: red;"></div></td>'

                        } else if (value.priority === 'urgent') {

                            tr += '<td align="center"><div class="fa fa-car fa-2x" data-toggle="tooltip" data-placement="bottom" title="Urgent" style="color: orangered;"></div></td>'

                        } else if (value.priority === 'normal') {

                            tr += '<td align="center"><div class="fa fa-motorcycle fa-2x" data-toggle="tooltip" data-placement="bottom" title="Normal" style="color: orange"></div></td>';

                        } else if (value.priority === 'low') {

                            tr += '<td align="center"><div class="fa fa-blind fa-2x" data-toggle="tooltip" data-placement="bottom" title="Low" style="color: darkorange"></div></td>';
                        }


                        tr += '<td>' + moment(value.createdAt).format('LLLL') + '</td>';
                        tr += '<td>';

                        if(value.staff){
                            tr += '<button data-id="' + value.id + '" class="detail-my-tic btn btn-default btn-xs btn-flat" title="KIRIM PESAN"><i class="fa fa-envelope"></i></button>';
                        }

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
//<----------------- END GET LIST/DAFTAR TIKET (MY TICKET)-------------->

//<----------------- KATEGORI DROPDOWN BOOTSTRAP -------------->
$("#category").select2({
    theme: "bootstrap"
});
//<----------------- END KATEGORI DROPDOWN BOOTSTRAP -------------->


//<------------------------- MY TICKET (DISINI GA KEPAKE) ------------------------>
$(document).on('click', '#btnSave', function () {
    alert('haloo');
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

                    $('#newTicketModal').modal('hide');
                    toastr.success('Sukses mengirim tiket');
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
//<------------------------------------------------------------------------->

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
                    $('#confirm-tic').modal('hide');

                    //---------------- send notifikasi ---------------

                    $.ajax({
                        url: '/api',
                        type: 'POST',
                        data: {
                            module: 'notifications',
                            method: 'POST',
                            params: [
                                {
                                    name: 'domain',
                                    value: 'Helpdesk Ticket - Assign Staff by Admin'
                                },
                                {
                                    name: 'receiver',
                                    value: data.staff.user.id  //staff sebagai penerima notifikasi dari Admin
                                },
                                {
                                    name: 'sender',
                                    value: $('#admin').val() //Admin sebagai pengirim notifikasi ke staff untuk tiket yang di-assign
                                },
                                {
                                    name: 'message',
                                    value: data.message
                                },
                                {
                                    name: 'read',
                                    value: false
                                }
                            ],
                            success: function (data, textStatus, jqXHR) {
                                toastr.success('Sukses mengirim tiket');
                                getAllTicketList();
                            }
                        }
                    });
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
                        // tr += '<td>'+value.message+'</td>';
                        // tr += '<td>'+value.status+'</td>';
                        tr += '<td align="center"><div class="fa fa-close fa-2x" data-toggle="tooltip" data-placement="bottom" title="Closed" style="color: #d84747"></div></td>';

                        if(value.priority === 'very_urgent') {

                            tr += '<td align="center"><div class="fa fa-fighter-jet fa-2x" data-toggle="tooltip" data-placement="bottom" title="Very Urgent" style="color: darkgray;"></div></td>';

                        } else if (value.priority === 'urgent') {

                            tr += '<td align="center"><div class="fa fa-car fa-2x" data-toggle="tooltip" data-placement="bottom" title="Urgent" style="color: darkgray;"></div></td>';

                        } else if (value.priority === 'normal') {

                            tr += '<td align="center"><div class="fa fa-motorcycle fa-2x" data-toggle="tooltip" data-placement="bottom" title="Normal" style="color: darkgray"></div></td>';

                        } else if (value.priority === 'low') {

                            tr += '<td align="center"><div class="fa fa-blind fa-2x" data-toggle="tooltip" data-placement="bottom" title="Low" style="color: darkgray"></div></td>';
                        }

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

                    if(value.status !== 'closed') {

                        tr += '<tr id="' + value.id + '"';
                        tr += 'data-id="/api/helpdesk/ticket-responses/'+value.id+'"';

                        if (value.ticket) {
                            tr += 'data-ticket="/api/helpdesk/tickets/'+value.ticket.id+'"';
                        }

                        if (value.client) {
                            tr += 'data-client="/api/users/' + value.client.id + '"';
                        }

                        if (value.staff) {
                            tr += 'data-staff="/api/helpdesk/staffs/'+value.staff.user.id+'"';
                        }

                        tr += ' data-time="'+value.createdAt+'"';

                        tr += '>';
                        tr += '<td>' + no + '</td>';
                        tr += '<td>' + value.category.name + '</td>';
                        tr += '<td>' + value.title + '</td>';
                        // tr += '<td>'+value.message+'</td>';
                        // tr += '<td>'+value.status+'</td>';

                        if (value.status === 'open') {

                            tr += '<td align="center"><div class="fa fa-ticket fa-2x" data-toggle="tooltip" data-placement="bottom" title="Open" style="color: orange;"></div></td>'

                        } else if (value.status === 'assignment') {

                            tr += '<td align="center"><div class="fa fa-tag fa-2x" data-toggle="tooltip" data-placement="bottom" title="Assignment" style="color: cornflowerblue;"></div></td>'

                            // } else if (value.status === 'closed') {
                            //
                            //     tr += '<td align="center"><div class="fa fa-close fa-2x" data-toggle="tooltip" data-placement="bottom" title="Closed" style="color: indianred"></div></td>';

                        } else if (value.status === 'onprogress') {

                            tr += '<td align="center"><div class="fa fa-pencil fa-2x" data-toggle="tooltip" data-placement="bottom" title="On Progress" style="color: gold"></div></td>';

                        } else if (value.status === 'resolved') {

                            tr += '<td align="center"><div class="fa fa-check fa-2x" data-toggle="tooltip" data-placement="bottom" title="Resolved" style="color: lawngreen"></div></td>';

                        }

                        if (value.priority === 'very_urgent') {

                            tr += '<td align="center"><div class="fa fa-fighter-jet fa-2x" data-toggle="tooltip" data-placement="bottom" title="Very Urgent" style="color: red;"></div></td>'

                        } else if (value.priority === 'urgent') {

                            tr += '<td align="center"><div class="fa fa-car fa-2x" data-toggle="tooltip" data-placement="bottom" title="Urgent" style="color: orangered;"></div></td>'

                        } else if (value.priority === 'normal') {

                            tr += '<td align="center"><div class="fa fa-motorcycle fa-2x" data-toggle="tooltip" data-placement="bottom" title="Normal" style="color: orange"></div></td>';

                        } else if (value.priority === 'low') {

                            tr += '<td align="center"><div class="fa fa-blind fa-2x" data-toggle="tooltip" data-placement="bottom" title="Low" style="color: darkorange"></div></td>';
                        }

                        tr += '<td>' + moment(value.createdAt).format('LLLL') + '</td>';
                        tr += '<td><button class="detail-my-tic btn btn-default btn-xs btn-flat" title="KIRIM PESAN"><i class="fa fa-envelope"></i></button></td>';
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
            $('#assignedToMe').html(tr);

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
            method: 'get'
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
            var msg = '';
            if (memberData.length > 0) {
                var no = 1;
                $.each(memberData, function (index, value) {

                    if(value.status !== 'closed'){

                        tr += '<tr id="'+value.id+'" data-msg="'+value.message+'"';

                        if (value.staff) {
                            tr += 'staff="' + value.staff.id + '" staff-user="' + value.staff.user.id + '"';
                        }

                        if (value.client) {
                            tr += 'client="' + value.client.id + '"';
                        }

                        tr += 'waktu="'+value.createdAt+'">';
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

                        tr += '<td>' + value.category.name +'</td>';
                        tr += '<td>' + value.title + '</td>';
                        // tr += '<td>' + value.message + '</td>';
                        // tr += '<td>' + value.status + '</td>';

                        if(value.status === 'open') {

                            tr += '<td align="center"><div class="fa fa-ticket fa-2x" data-toggle="tooltip" data-placement="bottom" title="Open" style="color: orange;"></div></td>'

                        } else if (value.status === 'assignment') {

                            tr += '<td align="center"><div class="fa fa-tag fa-2x" data-toggle="tooltip" data-placement="bottom" title="Assignment" style="color: cornflowerblue;"></div></td>'

                        } else if (value.status === 'closed') {

                            tr += '<td align="center"><div class="fa fa-close fa-2x" data-toggle="tooltip" data-placement="bottom" title="Closed" style="color: indianred"></div></td>';

                        } else if (value.status === 'onprogress') {

                            tr += '<td align="center"><div class="fa fa-pencil fa-2x" data-toggle="tooltip" data-placement="bottom" title="On Progress" style="color: gold"></div></td>';

                        } else if (value.status === 'resolved') {

                            tr += '<td align="center"><div class="fa fa-check fa-2x" data-toggle="tooltip" data-placement="bottom" title="Resolved" style="color: lawngreen"></div></td>';

                        }

                        if(value.priority === 'very_urgent') {

                            tr += '<td align="center"><div class="fa fa-fighter-jet fa-2x" data-toggle="tooltip" data-placement="bottom" title="Very Urgent" style="color: red;"></div></td>'

                        } else if (value.priority === 'urgent') {

                            tr += '<td align="center"><div class="fa fa-car fa-2x" data-toggle="tooltip" data-placement="bottom" title="Urgent" style="color: orangered;"></div></td>'

                        } else if (value.priority === 'normal') {

                            tr += '<td align="center"><div class="fa fa-motorcycle fa-2x" data-toggle="tooltip" data-placement="bottom" title="Normal" style="color: orange"></div></td>';

                        } else if (value.priority === 'low') {

                            tr += '<td align="center"><div class="fa fa-blind fa-2x" data-toggle="tooltip" data-placement="bottom" title="Low" style="color: darkorange"></div></td>';
                        }



                        tr += '<td>' + moment(value.createdAt).format('LLLL') + '</td>';
                        tr += '<td>';

                        if(value.staff){
                            tr += '<button data-id="' + value.id + '" class="detail-my-tic btn btn-default btn-xs btn-flat" title="KIRIM PESAN"><i class="fa fa-envelope"></i></button>';
                        }
                        tr += '<button data-id="' + value.id + '" class="confirm-tic btn btn-default btn-xs btn-flat" title="AMBIL TIKET"><i class="fa fa-check"></i></button>';
                        // tr += '<div class="badge badge-notify">1</div>';

                        tr += '</td>';
                        tr += '</tr>';

                        no++;

                    }


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
