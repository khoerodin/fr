$('#dtInvoicedAt, #inputInvoicedAt').datetimepicker({
    locale: 'id',
    format: "dddd, DD MMMM YYYY",
    defaultDate: $('[name="orderInvoicedAt"]').val(),
    ignoreReadonly: true
}).on('dp.change', function(e){
    var tgl = e.date.format('YYYY-MM-DD HH:mm:ss');
    $('#invoicedAt').val(tgl);
}).on('dp.hide', function () {
    $('[name="pemasang"]').focus();
});
idFormatInputInvoicedAt = $('#orderInvoicedAt').val();
$('#invoicedAt').val(moment(idFormatInputInvoicedAt).format('YYYY-MM-DD HH:mm:ss'));

// $('#dtBookedAt, #inputBookedAt').datetimepicker({
//     locale: 'id',
//     format: "dddd, DD MMMM YYYY",
//     defaultDate: $('[name="orderBookedAt"]').val(),
//     ignoreReadonly: true
// }).on('dp.change', function(e){
//     var tgl = e.date.format('YYYY-MM-DD HH:mm:ss');
//     $('#bookedAt').val(tgl);
// });

idFormatInputBookedAt = $('#orderBookedAt').val();
$('#inputBookedAt').val(moment(idFormatInputBookedAt).format('dddd, DD MMMM YYYY'));
$('#bookedAt').val(moment(idFormatInputBookedAt).format('YYYY-MM-DD HH:mm:ss'));

$(document).ready(function () {
    $("#orderNumber").focus();
});

$(document).on('click', '#btn-order-update', function () {

    bootbox.confirm({
        message: "YAKIN AKAN MEMPERBARUI ORDER?",
        animate: false,
        buttons: {
            confirm: {
                label: 'OK',
                className: 'btn-danger btn-flat'
            },
            cancel: {
                label: 'CANCEL',
                className: 'btn-default btn-flat'
            }
        },
        callback: function (result) {
            if (result) {

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

                            var updateForm = $('#dateForm input.put');
                            var arrData = [];
                            $.each(updateForm, function (index, value) {
                                arrData.push({id: value.id, type: 'put', publishDate: value.value});
                            });

                            var postForm = $('#dateForm input.post');
                            $.each(postForm, function (index, value) {
                                arrData.push({id: value.id, orderId: id, type: 'post', publishDate: value.value});
                            });

                            var deleteForm = $('#dateForm input.delete');
                            $.each(deleteForm, function (index, value) {
                                arrData.push({id: value.id, orderId: id, type: 'delete', publishDate: value.value});
                            });

                            $.ajax({
                                url: '/advertising/orders/publish-ads/update',
                                type: 'post',
                                data: {data: arrData},
                                success: function (data) {

                                    if (data.length) {
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
                                    }

                                },
                                error: function () {
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

            }else {
                // $('#btn-order-update').prop('disabled', true);
            }
        }
    });

});