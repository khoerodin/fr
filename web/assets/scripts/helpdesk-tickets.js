/**
 * Created by mispc3 on 10/07/17.
 */

$(document).on('click', '.detail-tic', function () {
    $('#tiketModal').modal({show: true, backdrop: 'static'});
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
