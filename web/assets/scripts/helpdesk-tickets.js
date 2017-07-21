/**
 * Created by mispc3 on 10/07/17.
 */

$(document).on('click', '.detail-tic', function () {
    var ticketId = $(this).closest('tr').attr('id');
    $('#tiketModal .modal-body').attr('data-ticketid', ticketId);

    var staffId = $(this).closest('tr').data('staff');
    $('#tiketModal .modal-body').attr('data-staffid', staffId);

    var clientId = $(this).closest('tr').data('client');
    $('#tiketModal .modal-body').attr('data-clientid', clientId);

    getTicketData(ticketId);
    $('#tiketModal').modal({show: true, backdrop: 'static'});

});


$(document).on('click', '#send', function () { //CHAT klik send button
    var waktu = moment().format("ddd, D MMM YYYY, h:mm A");
    var text = $('#chatMessage').val();
    var html = '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">Test</span><span class="direct-chat-timestamp pull-right">'+waktu+'</span></div><div class="direct-chat-msg right"><div class="direct-chat-text">'+text+'</div></div>';
    $(document).find('#chatHistory').append(html);
    $('#chatMessage').val('');
});

$(document).on('click', '.btn-reply-tic', function () { //FORUM klik send button
    var responseId = $('.mediaForum:last').data('id');
    var staff = $('.mediaForum:last').data('staff');
    var ticket = $('.mediaForum:last').data('ticket');
    var client = $('.mediaForum:last').data('client');


    var ticketId = $('#tiketModal .modal-body').data('ticketid');
    var staffId = $('#tiketModal .modal-body').data('staffid');
    var clientId = $('#tiketModal .modal-body').data('clientid');

    var trueTicketId;
    if(typeof ticket !== 'undefined'){
        trueTicketId = ticket;
    } else {
        trueTicketId = '/api/helpdesk/tickets/'+ticketId
    }

    var trueStaffId;
    if(typeof staff !== 'undefined'){
        trueStaffId = staff;
    } else {
        trueStaffId = '/api/helpdesk/staffs/'+staffId
    }

    var trueClientId;
    if(typeof client !== 'undefined'){
        trueClientId = client;
    } else {
        trueClientId = '/api/clients/'+clientId
    }


    //console.log(ticketId, ticket, trueTicketId);
    // var waktu = moment().format("ddd, D MMM YYYY, h:mm A");
    var text = $('#replyMessage').val();
    // var html2 = '<div class="media mediaForum"  style="margin-top: 20px; margin-bottom: 20px; border: #dedede solid 1px;padding: 26px" data-id="/api/helpdesk/ticket-responses/'+value.id+'" data-staff="/api/helpdesk/staffs/'+value.staff.id+'"  data-ticket="/api/helpdesk/tickets/'+value.ticket.id+'" data-client="/api/clients/'+value.client.id+'" >';
    // html2 += '<div class="media-left media-middle">';
    // html2 += '<div class="pull-right"></div><img class="direct-chat-img img-xs" src="../img/photo1.png"></div>';
    // html2 += '<div class="media-body"><h4 class="media-heading"></h4><h5>'+value.message+'</h5></div></div>';
    // $(document).find('.tableForum').append(html2);

    postTicketData(responseId, trueStaffId, trueTicketId, trueClientId, text);

});



$('.ticket-status').select2({
    theme: "bootstrap",
    minimumResultsForSearch: -1,
    placeholder: "Status tiket",
    allowClear: true

});

$('.ticket-priority').select2({
    theme: "bootstrap",
    minimumResultsForSearch: -1,
    placeholder: "Pilih prioritas tiket",
    allowClear: true

});

$(document).find('#chatMessage').on('keypress', function(e){

    if ( e.which == 13 ) {
        e.preventDefault();
        $('#send').trigger('click');
    }

});

var textarea = $('#chatMessage');
var typingStatus = $('#typing_on');
var lastTypedTime = moment().format("ddd, D MMM YYYY, h:mm A");
var typingDelayMillis = 4000;

function refreshTypingStatus() {
    if (!textarea.is(':focus') || textarea.val() == '' || new Date().getTime() - lastTypedTime.getTime() > typingDelayMillis) {
        typingStatus.html('');
    } else {
        typingStatus.html('someone is typing...');
    }
}
function updateLastTypedTime() {
    lastTypedTime = new Date();
};

setInterval(refreshTypingStatus, 100);
textarea.keypress(updateLastTypedTime);
textarea.blur(refreshTypingStatus);

var currentDay = moment().format("D MMM YYYY");
var html = '<div><span class="current-date">'+currentDay+'</span></div>';
$(document).find('.current-date').append(html);


var currentTime = moment().format("kk.mm a");
var html = '<span class="current-time">&nbsp;'+currentTime+'</span>';
$(document).find('.current-time').append(html);

var postingTime = moment({}.timeClicked,["kk.mm a"]).fromNow(true);
var html = '<div><span class="post-time">'+postingTime+'</span></div>';
$(document).find('.post-time').append(html);

function getTicketData(ticketId) {

    // var title = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(5)').text();
    // var client = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(2)').text();
    // var message = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(6)').text();
    // var category = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(4)').text();
    // // var time = $('tbody[data-list="helpdesk/tickets"] tr#'+param+' td:nth-child(4)').text();
    //
    // $('#tiketModal .timeline-header-title').text(title);
    // $('#tiketModal .media-heading-client-name').text(client);
    // $('#tiketModal .posted-message').text(message);
    // $('#tiketModal .timeline-header-category').text(category);

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
            console.log(finalData);

            var dataForum = '';

            $.each(finalData, function (index, value) {

                dataForum += '</div>';
                dataForum += '<div class="media mediaForum" data-id="/api/helpdesk/ticket-responses/'+value.id+'" data-staff="/api/helpdesk/staffs/'+value.staff.id+'"  data-ticket="/api/helpdesk/tickets/'+value.ticket.id+'" data-client="/api/clients/'+value.client.id+'" style="margin-top: 20px; margin-bottom: 20px; border: #dedede solid 1px;padding: 26px">';
                dataForum += '<div class="media-left media-middle">';

                // dataForum += '<div class="pull-right">'+value.order.createdAt+'</div>';
                dataForum += '<img class="direct-chat-img img-lg" src="../img/photo1.png">';
                dataForum += '</div>';
                dataForum += '<div class="media-body">';
                dataForum += '<h4 class="media-heading">'+value.client.user.fullname+'</h4>'; //clientName
                dataForum += '<h5>Staff bertugas: '+value.staff.user.fullname+'</h5>'; //staffName
                dataForum += '<div style="margin-top: 10px; margin-bottom: 2px; border: #dedede solid 1px;padding: 5px">'+value.message+'</div>'; //forumMessage

                dataForum += '</div>';
                dataForum += '</div>';

            });


            $('.tableForum').html(dataForum); //tbody userData contoh di Sublime
            console.log(finalData);
        }
    });
}

function postTicketData(responseFor, staff, ticket, client, message, ticketId) {
    var params;
    if (responseFor) {
        params = [
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
    } else {
        params = [
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
        ];;
    }

    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/ticket-responses',
            method: 'post',
            params: params
        },
        success: function (data) {
            var data = JSON.parse(data);

            if(data == 401) {

            } else {
                // if (ticket) {
                    var ticketId =  ticket.split("/").pop();
                    getTicketData(ticketId)
                // }
            }
        }
    });
}

