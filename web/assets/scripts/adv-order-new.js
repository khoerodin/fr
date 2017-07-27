$('#dtInvoicedAt, #inputInvoicedAt').datetimepicker({
    locale: 'id'
}).on('dp.change', function(e){
    var tgl = e.date.format('YYYY-MM-DD HH:mm:ss');
    $('#invoicedAt').val(tgl);
});

$('#dtBookedAt, #inputBookedAt').datetimepicker({
    locale: 'id'
}).on('dp.change', function(e){
    var tgl = e.date.format('YYYY-MM-DD HH:mm:ss');
    $('#bookedAt').val(tgl);
});

$(document).on('click', '#btn-order', function () {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/orders',
            method: 'POST',
            params: $('#orderForm').serializeArray()
        },
        success: function (data, textStatus, jqXHR) {

            if ( jqXHR.status === 200 ) {
                bootbox.alert({
                    message: "SUKSES MENYIMPAN ORDER",
                    animate: false,
                    buttons: {
                        ok: {
                            className: 'btn-danger btn-flat'
                        }
                    },
                    callback: function (result) {
                        window.location.href = '/advertising/orders';
                    }
                });
            } else {
                bootbox.alert({
                    message: "GAGAL MENYIMPAN ORDER",
                    animate: false,
                    buttons: {
                        ok: {
                            className: 'btn-danger btn-flat'
                        }
                    }
                });
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            bootbox.alert({
                message: "GAGAL MENYIMPAN ORDER",
                animate: false,
                buttons: {
                    ok: {
                        className: 'btn-danger btn-flat'
                    }
                }
            });
        }
    });
});