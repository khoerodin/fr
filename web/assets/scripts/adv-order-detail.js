$('#dtInvoicedAt, #inputInvoicedAt').datetimepicker({
    locale: 'id',
    defaultDate: '{{ order.invoicedAt }}'
}).on('dp.change', function(e){
    var tgl = e.date.format('YYYY-MM-DD HH:mm:ss');
    $('#invoicedAt').val(tgl);
});
idFormatInputInvoicedAt = $('#inputInvoicedAt').val();
$('#invoicedAt').val(moment(idFormatInputInvoicedAt, 'DD/MM/YYYY HH.mm').format('YYYY-MM-DD HH:mm:ss'));

$('#dtBookedAt, #inputBookedAt').datetimepicker({
    locale: 'id',
    defaultDate: '{{ order.bookedAt }}'
}).on('dp.change', function(e){
    var tgl = e.date.format('YYYY-MM-DD HH:mm:ss');
    $('#bookedAt').val(tgl);
});
idFormatInputBookedAt = $('#inputInvoicedAt').val();
$('#bookedAt').val(moment(idFormatInputBookedAt, 'DD/MM/YYYY HH.mm').format('YYYY-MM-DD HH:mm:ss'));

getJumlahBayar();
getNetto();

$(document).on('click', '#btn-order-update', function () {
    var id = $('input[name="id"]').val();
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/orders/' + id,
            method: 'PUT',
            params: $('#orderForm').serializeArray()
        },
        success: function (data, textStatus, jqXHR) {
            if (jqXHR.status === 200) {
                bootbox.alert({
                    message: "SUKSES MEMPERBARUI ORDER",
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
                    message: "GAGAL MEMPERBARUI ORDER",
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
                message: "GAGAL MEMPERBARUI ORDER",
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