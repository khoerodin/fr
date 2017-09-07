/**
 * Created by mispc3 on 10/07/17.
 */

//DETAIL TIKET (UNTUK ADMIN)
$(document).on('click', '.detail-my-tic', function () {
    var ticketId = $(this).closest('tr').attr('id');
    $('#tiketModal .modal-body').attr('data-ticketid', ticketId);

    var staffId = $(this).closest('tr').data('staff');
    $('#tiketModal .modal-body').attr('data-staffid', staffId);

    var clientId = $(this).closest('tr').data('client');
    $('#tiketModal .modal-body').attr('data-clientid', clientId);

    var categoryId = $(this).closest('tr').attr('category');
    $('#tiketModal .modal-body').attr('data-category', categoryId);

    var staffUserId = $(this).closest('tr').data('staff-user');
    $('#tiketModal .modal-body').attr('data-staff-userid', staffUserId);

    var pict = $(this).closest('tr').data('img');
    $('#tiketModal .modal-body').attr('data-img', pict);

    getTicketData(ticketId);
    $('#tiketModal').modal({show: true, backdrop: 'static'});

    //----------------------- READ / UNREAD NOTIF INSIDE DETAIL-MY-TIC -------------------------

    var params = [
        {
            name: 'read',
            value: true

        }
    ];

    var idTicket = ticketId;
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/tickets/' + idTicket,
            method: 'put', //put berarti update
            params: params
        },
        success: function (data, textStatus, jqXHR) {

            if (jqXHR.status === 200) {


                var data = JSON.parse(data);

                if($('#currentUser').val() === data.staff.user.id && $('#currentUser').val() !== data.client.id) {
                    // console.log('sudah dibaca =',data.read); //jangan dihapus
                    data.read = true;
                }

                // console.log('sudah dibaca =',data.read); //jangan dihapus
            }
        }
    });
    //----------------------- END READ / UNREAD NOTIF INSIDE DETAIL-MY-TIC -------------------------


});

//<----------------- GET DETIL TIKET UNTUK TIKET RESPON-------------->
function getTicketData(ticketId) {

    var client = $('tbody#allTicketList tr#'+ticketId+' td:nth-child(2)').text();
    var staff = $('tbody#allTicketList tr#'+ticketId+' td:nth-child(3)').text();
    var title = $('tbody#allTicketList tr#'+ticketId+' td:nth-child(5)').text();
    var category = $('tbody#allTicketList tr#'+ticketId+' td:nth-child(4)').text();
    var momentPost = $('tbody#allTicketList tr#'+ticketId+' td:nth-child(8)').text();
    var msg = $('#allTickets tr#'+ticketId).data('msg');
    var img = $('#allTickets #allTicketList tr#'+ticketId).attr('data-img').split(".");


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

            var finalData = data['hydra:member'];

            if($('#currentUser').val()){
                var tr = '<div class="media" id="mediaForum"><div class="media-left"><img src="/api/images/'+img[0]+'?ext='+img[1]+'" class="media-object" style="width:60px"></div><div class="media-body"><h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  '+momentPost+'</h6><h4 class="media-heading">'+client+'</h4><p>'+msg+'</p></div></div><hr>';
            } else {
                var tr = '<div class="media" id="mediaForum"><div class="media-left"><img src="/api/images/'+img[0]+'?ext='+img[1]+'" class="media-object" style="width:60px"></div><div class="media-body"><h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  ' +momentPost+ '</h6><h4 class="media-heading">' + client + '</h4><p>' + value.message + '</p></div></div><hr>';
            }

            $.each(finalData, function (index, value) {
                // console.log(value);
                tr += '<div class="media" id="mediaForum" data-id="/api/helpdesk/ticket-responses/'+value.id+'"';

                if (value.ticket) {
                    tr += 'data-ticket="/api/helpdesk/tickets/'+value.ticket.id+'"';
                }

                if (value.client) {
                    tr += 'data-client="/api/users/' + value.client.id + '"';
                }

                if (value.staff) {
                    tr += 'data-staff="'+value.staff.user.id+'"';
                }

                tr += ' data-time="'+value.createdAt+'"';

                tr += '>';
                tr += '<div class="media-left">';
                // value.ticket.staff.user.id === $('#currentUser').val() &&
                    if( value.staff) {
                        var img = (value.ticket.staff.user.profileImage).split(".");
                        tr += '<img src="/api/images/'+img[0]+'?ext='+img[1]+'" class="media-object" style="width:60px">';
                    } else if(value.ticket.client){
                        // '+img[0]+'?ext='+img[1]+'
                        var img2 = (value.ticket.client.profileImage).split(".");
                        tr += '<img src="/api/images/'+img2[0]+'?ext='+img2[1]+'" class="media-object" style="width:60px">';
                    }

                tr += '</div>';
                tr += '<div class="media-body">';
                tr += '<h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  '+moment(value.createdAt).format('LLLL')+'</h6>';
                // value.ticket.staff.user.id === $('#currentUser').val()
                    if (value.staff) {
                        tr += '<h4 class="media-heading">' + value.ticket.staff.fullname + '</h4>';
                    } else {//if (value.ticket.client.id === $('#currentUser').val()){
                        tr += '<h4 class="media-heading">' + value.ticket.client.fullname + '</h4>';
                    }

                tr += '<p>'+value.message+'</p>';
                tr += '</div>';
                tr += '</div>';
                tr += '<hr>';
            });


            $('#chatHistory').html(tr); //tbody result

            //------------------------- READ / UNREAD NOTIF GET TICKET DATA ------------------------->>

            var params = [
                {
                    name: 'read',
                    value: true
                }
            ];

            var tiketID = ticketId;
            $.ajax({
                url: '/api',
                type: 'POST',
                data: {
                    module: 'helpdesk/tickets/' + tiketID,
                    method: 'put', //put berarti update
                    params: params
                },
                success: function (data, textStatus, jqXHR) {

                    if (jqXHR.status === 200) {

                        var data = JSON.parse(data);
                        // console.log(data);
                        if($('#currentUser').val() === data.staff.user.id) {
                            // console.log($('#currentUser').val());
                            // console.log(data.staff.user.id);
                            // console.log(data);
                            data.read = true;
                        }

                        // console.log(data.read); //jangan dihapus
                    }
                }
            });

            //-------------------------  END READ / UNREAD NOTIF GET TICKET DATA ---------------------->>
        }
    });
}
//<----------------- END DETIL TIKET UNTUK TIKET RESPON -------------->

//<----------------- POST TIKET DAN POST FORUM (STAFF)-------------->
function postTicketData(responseFor, staff, ticket, message, time) {
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
            name: 'message',
            value: message
        }
    ];
    // console.log(message);
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
            // console.log(data);
            if(data === 401) {

            } else {

                var result = '<div class="media" id="mediaForum" data-id="/api/helpdesk/ticket-responses/'+data.id+'"';

                if (data.ticket) {
                    result += 'data-ticket="/api/helpdesk/tickets/'+data.ticket.id+'"';
                }

                if (data.staff) {
                    result += 'data-staff="'+data.staff.user.id+'"';
                }
                if(data.client){
                    result += 'data-client="'+data.client.id+'"';
                    }
                result += 'data-time="'+data.createdAt+'">';
                result += '<div class="media-left">';

                    var img = (data.ticket.staff.user.profileImage).split(".");
                    result += '<img src="/api/images/'+img[0]+'?ext='+img[1]+'" class="media-object" style="width:60px">';
                // '+img[0]+'?ext='+img[1]+'
                result += '</div>';
                result += '<div class="media-body">';
                result += '<h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  '+moment(data.createdAt).format('LLLL')+'</h6>';
                result += '<h4 class="media-heading">' + data.ticket.staff.user.fullname + '</h4>';
                result += '<p>'+data.message+'</p>';
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
                                value: data.ticket.staff.user.id //staff terpilih berkomunikasi dengan klien sebagai receiver
                            },
                            {
                                name: 'message',
                                value: message
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

                //----------------------- READ / UNREAD NOTIF INSIDE POST TIKET  -------------------------

                var readParams = [
                    {
                        name: 'read',
                        value: false

                    }
                ];
                // console.log('ini di post ticket data',data);
                var idTicket = data.ticket.id;
                // console.log(idTicket);
                $.ajax({
                    url: '/api',
                    type: 'POST',
                    data: {
                        module: 'helpdesk/tickets/' + idTicket,
                        method: 'put', //put berarti update
                        params: readParams
                    },
                    success: function (data, textStatus, jqXHR) {

                        if (jqXHR.status === 200) {

                            var data = JSON.parse(data);
                            // console.log(data);
                            if($('#currentUser').val() === data.client.id) {
                                // console.log(data.read);
                                data.read = false;
                            }

                            // console.log(data.read);
                        }
                    }
                });
                //----------------------- END READ / UNREAD NOTIF INSIDE POST TIKET -------------------------
            }
        }
    });

}
//<----------------- END POST TIKET DAN POST FORUM-------------->

//CHAT klik send button
$(document).on('click', '#send', function () {
    var text = $('#chatMessage').val();
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
            trueStaffId = staffId;
        }

    }
    var trueClientId;
    if(typeof client !== 'undefined'){
        trueClientId = client;
    } else {
        trueClientId = '/api/users/'+clientId;
    }

    if(text !== ''){
        postTicketData(responseId, trueStaffId, trueTicketId, text);
        // console.log('response ID = ',responseId);
        // console.log('staff ID = ',trueStaffId);
        // console.log('ticket ID = ',trueTicketId);
        // console.log('client ID = ',trueClientId);
        // console.log(text);
    }else{
        // alert('Teks tidak boleh kosong bro..');
        toastr.error('Error! Teks tidak boleh kosong!');
    }

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

                        tr += '<tr id="'+ value.id +'" data-ticket="/api/helpdesk/tickets/'+value.id+'" data-client="/api/users/'+value.client.id+'" data-client-fullname="'+value.client.fullname+'"';

                        if (value.staff) {
                            tr += 'data-staff="/api/helpdesk/staffs/'+value.staff.user.id+'"';
                        }
                        tr += '>';
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
                    method: 'get',
                    params: [
                        {
                            'category.id' : ticketData.category.id
                        }
                    ]
                },
                success: function (data, textStatus, jqXHR) {
                    var data = JSON.parse(data)['hydra:member'];
                    var staff = '<option selected disabled class="text-muted">PILIH STAFF YANG AKAN DITUGASKAN.. </option>';

                    $.each(data, function (index, value) {
                        // console.log(value);
                        // console.log('value =',value.category.id);
                        // console.log('ticketData =',ticketData.category.id);

                        // $('#confirm-tic #formKonfirmasiTiket #staff').val();
                        // if(value.category.id === ticketData.category.id) {
                            if (ticketData.staff) {

                                if (value.id === ticketData.staff.id) {
                                    staff += '<option selected value="/api/helpdesk/staffs/' + value.id + '">' + value.user.fullname + '</option>';
                                } else {
                                    staff += '<option value="/api/helpdesk/staffs/' + value.id + '">' + value.user.fullname + '</option>';
                                }

                            } else {
                                staff += '<option value="/api/helpdesk/staffs/' + value.id + '">' + value.user.fullname + '</option>';
                            }
                        // }

                    });
                    // console.log($('#confirm-tic #formKonfirmasiTiket #staff :selected').text());
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
$(document).on('click', '#closedTickets', function () {
    
    getClosedTicketList();
});
function getClosedTicketList() {

    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/tickets',
            method: 'get',
            params: [
                {
                    'staff.user.id' : $('#currentUser').val()
                },
                {
                    'status' : 'closed'
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
$(document).on('click', '#assignedTo', function () {
    getMyAssignmentList();
});
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
                            tr += 'data-client="' + value.client.id + '"';
                        }

                        if (value.staff) {
                            tr += 'data-staff="/api/helpdesk/staffs/'+value.staff.id+'"';
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
$(document).on('click', '#allTickets', function () {
    getAllTicketList();
});
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
                    // console.log(value);
                    if(value.status !== 'closed'){
                        tr += '<tr id="'+value.id+'" data-msg="'+value.message+'"';

                        if (value.staff) {
                            tr += 'staff="' + value.staff.id + '" staff-user="' + value.staff.user.id + '"';
                        }

                        if (value.client) {
                            tr += 'client="' + value.client.id + '"';
                        }

                        tr += 'waktu="'+value.createdAt+'"';
                        tr += 'data-img="'+value.client.profileImage+'"';
                        tr += 'category="'+value.category.id+'"';
                        tr += '>';

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
