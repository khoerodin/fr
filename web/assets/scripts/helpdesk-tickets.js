/**
 * Created by mispc3 on 10/07/17.
 */

$(document).on('click', '.detail-tic', function (e) {
    $('#tiketModal').modal({show: true, backdrop: 'static'});
    //console.log(e);
});



$(document).on('keypress', '#enter', function (e) {
    if (e.which === 13) {
        //tampilUser();
        // var isi = $(this).val();
        // alert(isi);
        // console.log(e);
        return false;
    }
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

