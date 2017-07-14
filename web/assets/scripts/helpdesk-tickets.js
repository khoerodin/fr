/**
 * Created by mispc3 on 10/07/17.
 */

$(document).on('click', '.detail-tic', function (e) {
    var ticketId = $(this).closest('tr').attr('id');
    getTicketData(ticketId);
    $('#tiketModal').modal({show: true, backdrop: 'static'});

});

$(document).on('click', '#send', function (e) {
    var waktu = moment().format("ddd, D MMM YYYY, h:mm A");
    var text = $('#chatMessage').val();
    var html = '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">Test</span><span class="direct-chat-timestamp pull-right">'+waktu+'</span></div><div class="direct-chat-msg right"><div class="direct-chat-text">'+text+'</div></div>';
    $(document).find('#chatHistory').append(html);
    $('#chatMessage').val('');
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
}

setInterval(refreshTypingStatus, 100);
textarea.keypress(updateLastTypedTime);
textarea.blur(refreshTypingStatus);

var currentDay = moment().format("D MMM YYYY");
var html = '<div><span class="current-date">'+currentDay+'</span></div>';
$(document).find('.current-date').append(html);

var currentTime = moment().format("kk.mm a");
var html = '<span class="current-time pull">&nbsp;'+currentTime+'</span>';
$(document).find('.current-time').append(html);

var postingTime = moment().format("kk.mm a");
var html = '<div><span class="post-time">'+postingTime+'</span></div>';
$(document).find('.current-post-time').append(html);



function getTicketData(param) {

    var title = $('tbody[data-list="helpdesk/tickets"] tr#'+param+' td:nth-child(5)').text();
    var client = $('tbody[data-list="helpdesk/tickets"] tr#'+param+' td:nth-child(2)').text();
    var message = $('tbody[data-list="helpdesk/tickets"] tr#'+param+' td:nth-child(6)').text();
    var category = $('tbody[data-list="helpdesk/tickets"] tr#'+param+' td:nth-child(4)').text();

    $('#tiketModal .timeline-header-title').text(title);
    $('#tiketModal .media-heading-client-name').text(client);
    $('#tiketModal .posted-message').text(message);
    $('#tiketModal .timeline-header-category').text(category);

    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'helpdesk/ticket-responses',
            method: 'get',
            params: [
                {
                    'ticket.id': param
                }
            ]
        },
        success: function (data) {
            var data = JSON.parse(data);
            var finalData = data['hydra:member'];
            //console.log(finalData);

            $.each(finalData, function (index, value) {
               // console.log(value.client.user.fullname);
            });
        }
    });
}