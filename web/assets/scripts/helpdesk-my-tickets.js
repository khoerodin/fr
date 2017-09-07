// --------------------------------- 01 Agustus 2017 ------------------------------------------

//DETAIL TIKET-KU (Forum)
$(document).on('click', '.detail-my-tic', function () {
    var ticketId = $(this).closest('tr').attr('id');
    $('#tiketModal .modal-body').attr('data-ticketid', ticketId);

    var staffId = $(this).closest('tr').data('staff');
    $('#tiketModal .modal-body').attr('data-staffid', staffId);

    var clientId = $(this).closest('tr').data('client');
    $('#tiketModal .modal-body').attr('data-clientid', clientId);

    var staffUserId = $(this).closest('tr').data('staff-user');
    $('#tiketModal .modal-body').attr('data-staff-userid', staffUserId);

    var catName = $(this).closest('tr').data('category-name');
    $('#tiketModal .modal-body').attr('data-category-name', catName);

    var titleName = $(this).closest('tr').data('title');
    $('#tiketModal .modal-body').attr('data-title', titleName);

    var timeId = $(this).closest('tr').data('waktu');
    $('.list-post-date').html(moment(timeId).format("D MMM 'YY - HH:mm a"));

    var msg = $(this).closest('tr'+ticketId).data('msg');
    // $('#tiketModal .modal-body #chatHistory').html(msg);

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
    //----------------------- END READ / UNREAD NOTIF INSIDE DETAIL-MY-TIC -------------------------


});

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
                    // console.log(value);
                    if(value.read === false){ //kalau notif belum di read atau read = false
                        if(value.status !== 'closed') {

                            tr += '<tr id="' + value.id + '"';
                            if (value.staff) {
                                tr += ' staff="/api/users/' + value.staff.id + '"';
                            }

                            if (value.client) {
                                tr += ' data-client="/api/users/' + value.client.id + '"';

                                tr += ' data-client-fullname="' + value.client.fullname + '"'; // !! penting !!
                            }

                            if (value.ticket) {
                                tr += ' data-ticket="/api/helpdesk/tickets/' + value.ticket.id + '"';
                            }

                            if (value.message) {
                                tr += ' data-msg="' + value.message + '"';
                            }
                            tr += 'data-category-name="' + value.category.name + '"';
                            tr += 'data-title="' + value.title + '"';
                            tr += 'data-time="' + value.createdAt + '"';
                            tr += 'data-img="' + value.client.profileImage + '"';
                            tr += '>';

                            tr += '<td><b>' + no + '</b></td>';
                            tr += '<td><b>' + value.category.name + '</b></td>';
                            tr += '<td><b>' + value.title + '</b></td>';
                            // tr += '<td>'+value.message+'</td>'

                            if (value.status === 'open') {

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

                            if (value.priority === 'very_urgent') {

                                tr += '<td align="center"><div class="fa fa-fighter-jet fa-2x" data-toggle="tooltip" data-placement="bottom" title="Very Urgent" style="color: red;"></div></td>'

                            } else if (value.priority === 'urgent') {

                                tr += '<td align="center"><div class="fa fa-car fa-2x" data-toggle="tooltip" data-placement="bottom" title="Urgent" style="color: orangered;"></div></td>'

                            } else if (value.priority === 'normal') {

                                tr += '<td align="center"><div class="fa fa-motorcycle fa-2x" data-toggle="tooltip" data-placement="bottom" title="Normal" style="color: orange"></div></td>';

                            } else if (value.priority === 'low') {

                                tr += '<td align="center"><div class="fa fa-blind fa-2x" data-toggle="tooltip" data-placement="bottom" title="Low" style="color: darkorange"></div></td>';
                            }

                            tr += '<td><b>' + moment(value.createdAt).format('LLLL') + '</b></td>';

                            if (value.staff) {
                                tr += '<td><button data-id="' + value.id + '" class="detail-my-tic btn btn-default btn-xs btn-flat" title="KIRIM PESAN"><i class="fa fa-envelope"></i></button></td>';
                            }

                            tr += '</tr>';

                            no++;

                        }
                    } else { //kalau notif sudah di read atau read = true
                            if(value.status !== 'closed') {

                                tr += '<tr id="' + value.id + '"';
                                if (value.staff) {
                                    tr += ' staff="/api/users/' + value.staff.id + '"';
                                }

                                if (value.client) {
                                    tr += ' data-client="/api/users/' + value.client.id + '"';

                                    tr += ' data-client-fullname="' + value.client.fullname + '"'; // !! penting !!
                                }

                                if (value.ticket) {
                                    tr += ' data-ticket="/api/helpdesk/tickets/' + value.ticket.id + '"';
                                }

                                if (value.message) {
                                    tr += ' data-msg="' + value.message + '"';
                                }
                                tr += 'data-category-name="' + value.category.name + '"';
                                tr += 'data-title="' + value.title + '"';
                                tr += 'data-time="' + value.createdAt + '"';
                                tr += 'data-img="' + value.client.profileImage + '"';
                                tr += '>';

                                tr += '<td>' + no + '</td>';
                                tr += '<td>' + value.category.name + '</td>';
                                tr += '<td>' + value.title + '</td>';
                                // tr += '<td>'+value.message+'</td>'

                                if (value.status === 'open') {

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

                                if (value.staff) {
                                    tr += '<td><button data-id="' + value.id + '" class="detail-my-tic btn btn-default btn-xs btn-flat" title="KIRIM PESAN"><i class="fa fa-envelope"></i></button></td>';
                                }

                                tr += '</tr>';

                                no++;

                                $("b").remove(); //menghilangkan element b (bold)
                            }
                    }
                });

            } else {

                tr += '<tr><td colspan="10">TIDAK ADA DATA</td></tr>'

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
                // var newtic = $('#ticketList #tr:first-child').text();
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
                    if(data.read === false) {
                        getTicketList();
                        var notif = $('tbody#ticketList tr:first-child').text();

                        // $('#ticketList').html(notif);
                        // var category = $('tbody#ticketList tr#'+ticketId+' td:nth-child(2)').text();
                        // var result = '<div class="media" id="mediaForum"><div class="media-left"><img src="/api/images/'+img[0]+'?ext='+img[1]+'" class="media-object" style="width:60px"></div><div class="media-body"><h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  '+tgl+'</h6><h4 class="media-heading">'+client+'</h4><p>'+msg+'</p></div></div><hr>';
                        // $('#chatHistory').html(result);
                    }else {
                        getTicketList();
                    }

                    $("#newTicketModal #message").val('');
                    $("#newTicketModal #title").val('');

                    $("#newTicketModal #category #pilih").prop('selected', true);

                    resetDropDown();
                    $('#newTicketModal').modal('hide');

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
                                    value: 'Helpdesk Ticket - Add New Ticket'
                                },
                                {
                                    name: 'receiver',
                                    value: $('#admin').val() // Admin menerima Tiket untuk diteruskan / assign ke Staff
                                },
                                {
                                    name: 'sender',
                                    value: $('#currentUser').val() //Klien mengirim permohonan pemrosesan tiket ke Admin
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
                        // tr += '<td>'+value.message+'</td>';
                        // tr += '<td class="text-danger">'+value.status+'</td>';
                        tr += '<td align="center"><div class="fa fa-close fa-2x" data-toggle="tooltip" data-placement="bottom" title="Closed" style="color: indianred"></div></td>';

                        if(value.priority === 'very_urgent') {

                            tr += '<td align="center"><div class="fa fa-fighter-jet fa-2x" data-toggle="tooltip" data-placement="bottom" title="Very Urgent" style="color: darkgray;"></div></td>'

                        } else if (value.priority === 'urgent') {

                            tr += '<td align="center"><div class="fa fa-car fa-2x" data-toggle="tooltip" data-placement="bottom" title="Urgent" style="color: darkgray;"></div></td>'

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



//SEND CHAT - KEYBOARD ENTER
$(document).find('#chatMessage').on('keypress', function(e){

    if ( e.which == 13 ) {
        e.preventDefault();
        $('#send').trigger('click');
    }

});

//<----------------- IS TYPING A MESSAGE -------------->
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
//<----------------- END IS TYPING A MESSAGE -------------->

//<----------------- DATE TIME MOMENT JS -------------->
var currentDay = moment().format("D MMM YYYY");
var html = '<div><span class="current-date">'+currentDay+'</span></div>';
$(document).find('.current-date').append(html);


var currentTime = moment().format("kk.mm a");
var html1 = '<span class="current-time">&nbsp;'+currentTime+'</span>';
$(document).find('.current-time').append(html1);

var forumChat = moment().format('LLLL');
var html2 = '<span class="wkt direct-chat-timestamp pull-right">'+forumChat+'</span>';
$(document).find('.wkt').append(html2);
//<----------------- END DATE TIME MOMENT JS -------------->

//<----------------- GET DETIL TIKET-KU UNTUK TIKET RESPON-------------->
function getTicketData(ticketId) {

    // var title = $('#tableTicket #ticketList tr#'+ticketId).attr('data-title');
    var category = $('tbody#ticketList tr#'+ticketId+' td:nth-child(2)').text();
    var title = $('tbody#ticketList tr#'+ticketId+' td:nth-child(3)').text();
    var momentPost = $('tbody#ticketList tr#'+ticketId).attr('data-time');
    var tgl = moment(momentPost).format('LLLL');
    var user = $('#tableTicket #ticketList tr#'+ticketId).data('client-fullname');
    // var img = $('#myTickets #tableTicket #ticketList tr#'+ticketId).attr('data-img');
    var client = $('tbody#ticketList tr#'+ticketId).data('client-fullname');
    var img = $('tbody#ticketList tr#'+ticketId).attr('data-img').split(".");

    $('#tiketModal .listDetail #list-title').text(title);
    $('#tiketModal .listDetail #list-tgl-post').text(tgl);
    // $('#tiketModal .list-msg').text(message);
    $('#tiketModal .listDetail #list-cat').text(category);
    var msg = $('div#myTickets tr#'+ticketId).data('msg');

    // console.log(ticketId);
    // console.log(msg);

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
            // console.log(data);
            var finalData = data['hydra:member'];

            if($('#currentUser').val()){
                var result = '<div class="media" id="mediaForum"><div class="media-left"><img src="/api/images/'+img[0]+'?ext='+img[1]+'" class="media-object" style="width:60px"></div><div class="media-body"><h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  '+tgl+'</h6><h4 class="media-heading">'+client+'</h4><p>'+msg+'</p></div></div><hr>';
            } else {
                var result = '<div class="media" id="mediaForum"><div class="media-left"><img src="/api/images/'+img[0]+'?ext='+img[1]+'" class="media-object" style="width:60px"></div><div class="media-body"><h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  ' +tgl+ '</h6><h4 class="media-heading">' + client + '</h4><p>' + data.message + '</p></div></div><hr>';
            }

                // var result = '';
            $.each(finalData, function (index, value) {
                // console.log(value);
                result += '<div class="media" id="mediaForum" data-id="/api/helpdesk/ticket-responses/'+value.id+'"';

                if (value.ticket) {
                    result += 'data-ticket="/api/helpdesk/tickets/'+value.ticket.id+'"';
                }

                if (value.client) {
                    result += 'data-client="/api/users/' + value.client.id + '"';
                }

                if (value.staff) {
                    result += 'data-staff="/api/helpdesk/staffs/'+value.staff.user.id+'"';
                }
                result += 'data-img="'+value.ticket.client.profileImage+'"';
                result += 'data-time="'+value.createdAt+'">';
                result += '<div class="media-left">';
//Before
//                 if(value.ticket.staff.user.id === $('#currentUser').val()) {
//
//                     var img = (value.ticket.staff.user.profileImage).split(".");
//                     result += '<img src="/api/images/'+img[0]+'?ext='+img[1]+'" class="media-object" style="width:60px">';
//                     // '+img[0]+'?ext='+img[1]+'
//                 } else {
//                     var img2 = (value.ticket.client.profileImage).split(".");
//                     result += '<img src="/api/images/'+img2[0]+'?ext='+img2[1]+'" class="media-object" style="width:60px">';
//                 }
//                 result += '</div>';
//                 result += '<div class="media-body">';
//                 result += '<h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  '+moment(value.createdAt).format('LLLL')+'</h6>';
//
//                 if (value.ticket.staff.user.id === $('#currentUser').val()) {
//                     result += '<h4 class="media-heading">' + value.ticket.staff.fullname + '</h4>';
//                 } else if (value.ticket.client.id === $('#currentUser').val()){
//                     result += '<h4 class="media-heading">' + value.ticket.client.fullname + '</h4>';
//                 }
//End Before

//After
                if(value.staff === null) {
                    var img2 = (value.ticket.client.profileImage).split(".");
                    result += '<img src="/api/images/'+img2[0]+'?ext='+img2[1]+'" class="media-object" style="width:60px">';
                    // '+img[0]+'?ext='+img[1]+'
                } else {
                    var img = (value.ticket.staff.user.profileImage).split(".");
                    result += '<img src="/api/images/'+img[0]+'?ext='+img[1]+'" class="media-object" style="width:60px">';
                }

                result += '</div>';
                result += '<div class="media-body">';
                result += '<h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  '+moment(value.createdAt).format('LLLL')+'</h6>';
                if(value.staff === null) {
                    result += '<h4 class="media-heading">' + value.ticket.client.fullname + '</h4>';
                } else {
                    result += '<h4 class="media-heading">' + value.ticket.staff.user.fullname + '</h4>';
                }
//End After
                result += '<p>'+value.message+'</p>';
                result += '</div>';
                result += '</div>';
                result += '<hr>';

            });

            $('#chatHistory').html(result);

        }
    });
}
//<----------------- END DETIL TIKET-KU UNTUK TIKET RESPON -------------->

//<----------------- POST TIKET DAN POST FORUM-------------->
function postTicketData(responseFor, staff, ticket, client, message) {
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
                // console.log(data);
                var result = '<div class="media" id="mediaForum" data-id="/api/helpdesk/ticket-responses/'+data.id+'"';

                if (data.ticket) {
                    result += 'data-ticket="/api/helpdesk/tickets/'+data.ticket.id+'"';
                }
                if (data.client) {
                    result += 'data-client="/api/users/' + data.client.id + '"';
                }

                if (data.staff) {
                    result += 'data-staff="'+data.staff.user.id+'"';
                }

                result += 'data-time="'+data.createdAt+'">';
                result += '<div class="media-left">';

                // console.log(data);
                if(data.ticket.staff.user.id === $('#currentUser').val() && data.staff !== null) {
                    var img = (data.ticket.staff.user.profileImage).split(".");
                    result += '<img src="/api/images/'+img[0]+'?ext='+img[1]+'" class="media-object" style="width:60px">';
                } else {
                    var img2 = (data.ticket.client.profileImage).split(".");
                    result += '<img src="/api/images/'+img2[0]+'?ext='+img2[1]+'" class="media-object" style="width:60px">';
                    // '+img[0]+'?ext='+img[1]+'
                }

                result += '</div>';
                result += '<div class="media-body">';
                result += '<h6 class="pull-right"><i class="fa fa-clock-o fa-1" aria-hidden="true"></i>  '+moment(data.createdAt).format('LLLL')+'</h6>';
                if(data.ticket.client.id === $('#currentUser').val() && data.ticket.staff !== null) {
                    // if(data.ticket.client.id === $('#currentUser').val() && data.ticket.staff !== null) {
                    result += '<h4 class="media-heading">' + data.ticket.client.fullname + '</h4>';
                } else {
                    if(data.staff) {
                        result += '<h4 class="media-heading">' + data.ticket.staff.user.fullname + '</h4>';
                    }
                }
                result += '<p>'+data.message+'</p>';
                result += '</div>';
                result += '</div>';
                result += '<hr>';

                $('#chatHistory').append(result);
                $('#chatMessage').val('');
                // console.log(result);

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
                                value: 'Helpdesk Tiket - Post Forum (Klien)'
                            },
                            {
                                name: 'receiver',
                                value: 'penerima' //data.staff.user.id //staff terpilih menerima pesan dari klien
                            },
                            {
                                name: 'sender',
                                value: $('#currentUser').val() //klien mengirim pesan ke staff
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
            trueStaffId = 'api/helpdesk/staffs/'+ staffId;
        }

    }

    var trueClientId;
    if(typeof client !== 'undefined'){
        trueClientId = client;
    } else {
        trueClientId = clientId;
    }

    if(text !== ''){
        postTicketData(responseId, trueStaffId, trueTicketId, trueClientId, text);
        // console.log('response ID = ',responseId);
        // console.log('staff ID = ',trueStaffId);
        // console.log('ticket ID = ',trueTicketId);
        // console.log('client ID = ',trueClientId);
        // console.log(text);
    }else{
        // alert('Teks tidak boleh kosong bro..');
        toastr.error('Error! Pesan tidak boleh kosong');
    }

});