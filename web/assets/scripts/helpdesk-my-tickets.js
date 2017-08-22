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

                    if(value.status !== 'closed') {

                        tr += '<tr id="'+value.id+'">';
                        tr += '<td>'+no+'</td>';
                        tr += '<td>'+value.category.name+'</td>';
                        tr += '<td>'+value.title+'</td>';
                        // tr += '<td>'+value.message+'</td>'

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

                        tr += '<td>'+moment(value.createdAt).format('LLLL')+'</td>';

                        if(value.staff){
                            tr += '<td><button data-id="' + value.id + '" class="detail-my-tic btn btn-default btn-xs btn-flat" title="KIRIM PESAN"><i class="fa fa-envelope"></i></button></td>';
                        }

                        tr += '</tr>';

                        no++;
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
                                    value: 'helpdesk/tickets/' + data.id
                                },
                                {
                                    name: 'receiver',
                                    value: $('#admin').val()
                                },
                                {
                                    name: 'sender',
                                    value: $('#currentUser').val()
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

// Melihat detil tiket (BELUM DIPAKAI)
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

    var timeId = $(this).closest('tr').data('waktu');
    $('.list-post-date').html(moment(timeId).format("D MMM 'YY - HH:mm a"));


    getTicketData(ticketId);
    $('#tiketModal').modal({show: true, backdrop: 'static'});



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

//<----------------- GET DETIL TIKET-KU UNTUK TIKET RESPON-------------->
function getTicketData(ticketId) {


    var title = $('tbody#ticketList tr#'+ticketId+' td:nth-child(3)').text();
    // var message = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(6)').text();
    var category = $('tbody#ticketList tr#'+ticketId+' td:nth-child(2)').text();
    var momentPost = $('tbody#ticketList tr#'+ticketId+' td:nth-child(6)').text();

    $('#tiketModal .listDetail #list-title').text(title);
    $('#tiketModal .listDetail #list-tgl-post').text(momentPost);
    // $('#tiketModal .list-msg').text(message);
    $('#tiketModal .listDetail #list-cat').text(category);

    // console.log(ticketId);

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

            });


            $('#chatHistory').html(dataForum); //tbody result

        }
    });
}
//<----------------- END DETIL TIKET-KU UNTUK TIKET RESPON -------------->

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
            name: 'user',
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
                var ticketId =  ticket.split("/").pop();
                // }

                var result = '<div class="direct-chat-msg" data-id="/api/helpdesk/ticket-responses/'+data.id+'"  data-ticket="/api/helpdesk/tickets/'+data.ticket.id+'" data-staff="/api/users/'+data.staff.user.id+'" data-time="'+data.createdAt+'"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'+data.staff.user.fullname+'</span><span class="wkt direct-chat-timestamp pull-right">'+moment(data.createdAt).format('LLLL')+'</span></div><img class="direct-chat-img" src="../img/user4-128x128.jpg" alt="message user image"><div class="direct-chat-text">'+data.message+'</div></div>';
                $('#chatHistory').append(result);
                $('#chatMessage').val('');
            }
        }
    });
}
//<----------------- END POST TIKET DAN POST FORUM-------------->

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