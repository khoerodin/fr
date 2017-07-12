/**
 * Created by mispc3 on 10/07/17.
 */

<<<<<<< HEAD
$(document).on('click', '.detail-tic', function () {
=======
$(document).on('click', '.detail-tic', function (e) {
>>>>>>> 48854f74ff894adf4c8591da5edfb40e5a2d7efe
    $('#tiketModal').modal({show: true, backdrop: 'static'});

});

<<<<<<< HEAD
$(document).on('keypress', '#enter', function (e) {
    if (e.which === 13) {
        //tampilUser();
        // var isi = $(this).val();
        // alert(isi);
        // console.log(e);
        return false;
    }
=======
// $(document).on('click', '#chatHistory', function (e) {
//     $('#send').modal({
//         show: true,
//         backdrop: 'static'});
//
// });


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

>>>>>>> 48854f74ff894adf4c8591da5edfb40e5a2d7efe
});

$(document).find('#chatMessage').on('keypress', function(e){
    if ( e.which == 13 ) {
        e.preventDefault();
        var text = $(this).val();
        var html = '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">Test</span><span class="direct-chat-timestamp pull-right">23 Jan 2:00 pm</span></div><div class="direct-chat-msg right"><div class="direct-chat-text">'+text+'</div></div>';
        $(document).find('#chatHistory').append(html);
        $(this).val('');
    }
});
