$('#dtInvoicedAt, #inputInvoicedAt').datetimepicker({
    locale: 'id',
    format: "dddd, DD MMMM YYYY",
    ignoreReadonly: true,
    defaultDate: moment()
}).on('dp.change', function(e){
    var tgl = e.date.format('YYYY-MM-DD HH:mm:ss');
    $('#invoicedAt').val(tgl);
}).on('dp.hide', function(e){
    $('[name="pemasang"]').focus();
});

$('#invoicedAt').val(moment().format('YYYY-MM-DD HH:mm:ss'));

$('#inputBookedAt').val(moment().format('dddd, DD MMMM YYYY'));
$('#bookedAt').val(moment().format('YYYY-MM-DD HH:mm:ss'));

$("#orderFrom").select2({
    theme: 'bootstrap'
});

$("#orderFrom").select2('open');

function paddy(number, pad, char) {
    var pad_char = typeof char !== 'undefined' ? char : '0';
    var pad = new Array(1 + pad).join(pad_char);
    return (pad + number).slice(-pad.length);
}

function getOrderId() {

    var id = $("#orderFrom option:selected").val();
    var text = $("#orderFrom option:selected").text();
    var code = text.split(" ")[0];

    var currentTime = new Date();
    var month = paddy(currentTime.getMonth() + 1, 2);
    var year = currentTime.getFullYear();

    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'last-id/order'+month+year,
            method: 'get'
        },
        success: function (data) {
            var urutan = paddy(data.id, 3);
            var orderNumber = 'OI/'+urutan+'/'+code+'/'+month+'/'+year;
            $('#orderNumber').val(orderNumber);

            saveOrder(orderNumber);
        }
    });
}

function saveOrder() {
    var params = $('#orderForm').serializeArray();
    var tags = String($('#orderTag').val());

    params.push({
        name: 'orderTag',
        value: tags
    });


    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/orders',
            method: 'POST',
            params: params
        },
        beforeSend: function () {
            $('div.has-error').removeClass('has-error');
            $('p.help-block').remove();
            $('#btn-order').text('MENYIMPAN ORDER ...').prop('disabled', true);
        },
        success: function (data, textStatus, jqXHR) {
            if ( jqXHR.status === 200 ) {

                if ("violations" in data) {

                    $.each(data, function (index, value) {
                        if(index === 'violations'){
                            $.each(value, function (idx, val) {
                                $('form#orderForm #'+val.propertyPath).parent('div').addClass('has-error');
                                $( '<p class="help-block">'+val.message+'</p>' ).insertAfter( 'form#orderForm #'+val.propertyPath);
                            });
                        }
                    });

                    toastr.error("Gagal Menyimpan Order");
                    $('#btn-order').text('ORDER SEKARANG').prop('disabled', false);

                } else if (data.file) {
                    toastr.error("Gagal Menyimpan Order");
                    $('#btn-order').text('ORDER SEKARANG').prop('disabled', false);
                } else {

                    var orderId = data.id;
                    var data = localStorage.getItem('jenisEdisi');

                    if (data === 'DATES') {
                        saveByDates(orderId);
                    } else if (data === 'DAYS') {
                        saveByDays(orderId);
                    }

                }

            } else {
                toastr.error("Gagal Menyimpan Order");
                $('#btn-order').text('ORDER SEKARANG').prop('disabled', false);
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
            $('#btn-order').text('ORDER SEKARANG').prop('disabled', false);
        }
    });
}

$(document).on('click', '#btn-order', function () {
    saveOrder();
});

function saveByDates(orderId) {
    var data = getDatesByDates();
    var tanggal = [];

    $.each(data, function (index, value) {
        tanggal.push({
            publishDate: value
        });
    });

    $.ajax({
        url: '/advertising/orders/publish-ads',
        type: 'post',
        data: {
            tanggal: tanggal,
            orderId: orderId
        },
        success: function (data, textStatus, jqXHR) {

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
                        window.location.href = '/advertising/orders/new';
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
}

function saveByDays(orderId) {
    if ($('#startDate').val() && $('#endDate').val()) {

        var data = getDatesByDays();
        var tanggal = [];
        $.each(data, function (index, value) {
            tanggal.push({
                publishDate: value
            });
        });

        $.ajax({
            url: '/advertising/orders/publish-ads',
            type: 'post',
            data: {
                tanggal: tanggal,
                orderId: orderId
            },
            success: function (data, textStatus, jqXHR) {

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
                            window.location.href = '/advertising/orders/new';
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
    }
}