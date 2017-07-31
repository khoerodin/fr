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

    var staffUserId = $(this).closest('tr').data('staff-user');
    $('#tiketModal .modal-body').attr('data-staff-userid', staffUserId);

    var timeId = $(this).closest('tr').data('waktu');
    $('.list-post-date').html(moment(timeId).format("D MMM 'YY - HH:mm a"));


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
    //var staffUser = $('.mediaForum:last').data('staff-user');


    var ticketId = $('#tiketModal .modal-body').data('ticketid');
    var staffId = $('#tiketModal .modal-body').data('staffid');
    var clientId = $('#tiketModal .modal-body').data('clientid');
    var staffUserId = $('#tiketModal .modal-body').data('staff-userid');

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
        typingStatus.html('<span style="visibility: hidden">.</span>');
    } else {
        typingStatus.html('someone is typing...');
    }
}
function updateLastTypedTime() {
    lastTypedTime = new Date();
}

function readNotif() {
    if(!textarea.is(':click')){

    }

}

setInterval(refreshTypingStatus, 100);
textarea.keypress(updateLastTypedTime);
textarea.blur(refreshTypingStatus);

var currentDay = moment().format("D MMM YYYY");
var html = '<div><span class="current-date">'+currentDay+'</span></div>';
$(document).find('.current-date').append(html);


var currentTime = moment().format("kk.mm a");
var html = '<span class="current-time">&nbsp;'+currentTime+'</span>';
$(document).find('.current-time').append(html);

var postingTime = moment().format("D MMM YYYY, kk.mm a");
var html = '<div><span class="date-post">'+postingTime+'</span></div>';
$(document).find('.date-post').append(html);


function getTicketData(ticketId) {

    var title = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(5)').text();
    var client = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(2)').text();
    // var message = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(6)').text();
    var category = $('tbody[data-list="helpdesk/tickets"] tr#'+ticketId+' td:nth-child(4)').text();
    // var momentPost = moment('value.createdAt').format("D MMM 'YY - HH:mm a");

    $('#tiketModal .list-judul').text(title);
    $('#tiketModal .list-client').text(client);
    // $('#tiketModal .list-tgl-post').text(momentPost);
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
            console.log(finalData);

            var dataForum = '';

            $.each(finalData, function (index, value) {


                dataForum += '<div id="Forum" style="background-color: #efefef">';
                dataForum += '<div class="media mediaForum" data-id="/api/helpdesk/ticket-responses/'+value.id+'" data-staff="/api/helpdesk/staffs/'+value.staff.id+'"  data-ticket="/api/helpdesk/tickets/'+value.ticket.id+'" data-client="/api/clients/'+value.client.id+'" style="margin-top: 10px; margin-bottom: 10px; border: #3e3b42 solid 1px;padding: 12px" data-time="/api/helpdesk/ticket-responses/'+value.responseFor+'">';
                dataForum += '<div class="media-left media-top" style="">';

                dataForum += '<img class="direct-chat-img img-lg" src="../img/user4-128x128.jpg">';
                // dataForum += '<img class="direct-chat-img img-lg" src="../img/user7-128x128.jpg">';
                dataForum += '</div>';
                dataForum += '<div class="media-body"><span class="date-post pull-right"><span class="glyphicon glyphicon-time"></span> diposting pada '+moment(value.createdAt).format("D MMM 'YY - HH:mm a")+'</span>';
                dataForum += '<h4 class="media-heading">'+value.client.user.fullname+'</h4>'; //clientName
                dataForum += '<h5 class="text-muted">'+value.staff.user.fullname+'</h5>'; //staffName
                dataForum += '</div>';

                dataForum += '<div style="background-color: white; margin-left: 1px; margin-top: 10px; margin-bottom: 2px; border: #3e3b42 solid 1px;padding: 5px">'+value.message+''; //forumMessage

                dataForum += '</div>';
                dataForum += '</div>';
                dataForum += '</div>';
                dataForum += '</div>';

            });


            $('.tableForum').html(dataForum); //tbody userData contoh di Sublime
            console.log(finalData);

        }
    });
}

function postTicketData(responseFor, staff, ticket, client, message, time) {
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
            },
            {
                name: 'time',
                value: responseFor
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
            },
            {
                name: 'time',
                value: responseFor
            }
        ];
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
                    $("#replyMessage").val('');
                    var ticketId =  ticket.split("/").pop();
                    getTicketData(ticketId)
                // }
            }
        }
    });
}

// --------------------------------- 28 JULI 2017 ---- GOOGLE PIE CHART

// $(function () {
//     var chart = new CanvasJS.Chart("chartContainer", {
//         theme: "theme2",
//         animationEnabled: true,
//         title: {
//             text: "Basic Column Chart using CanvasJS"
//         },
//         data: [
//             {
//                 type: "column",
//                 dataPoints: <?php echo json_encode($dataPoints, JSON_NUMERIC_CHECK); ?>
// }
// ]
// });
//     chart.render();
// });