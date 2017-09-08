// dropdown menggunakan select2
$("#printAs, #paymentMethod, #printInvoiceAs").select2({
    theme: 'bootstrap'
});

$(document).on('ready', function() {
    $('#hitung').trigger('click');
});

$("#orderFrom").select2({
    theme: 'bootstrap'
}).on("select2:select", function () {

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
            var data = JSON.parse(data);
            var urutan = paddy(data.id, 3);
            var orderNumber = 'OI/'+urutan+'/'+code+'/'+month+'/'+year;
            $('#orderNumber').val(orderNumber);

            // if (text.startsWith("BIS")) {
            //     orderNumber = 'OI/'+urutan+'/'+month+'/'+year;
            //     $('#orderNumber').val(orderNumber);
            // } else {
            //     orderNumber = 'OI/'+urutan+'/'+code+'/'+month+'/'+year;
            //     $('#orderNumber').val(orderNumber);
            // }

            $('#orderNumber').focus();
        }
    });
});

function paddy(number, pad, char) {
    var pad_char = typeof char !== 'undefined' ? char : '0';
    var pad = new Array(1 + pad).join(pad_char);
    return (pad + number).slice(-pad.length);
}

//ketika klik tombol browse/pilih pemasang iklan
$(document).on('click', '#pemasang button', function () {
   getCustomers(null, 'pemasangModal');
   $('#pemasangModal').modal({show: true, backdrop: 'static'});
   $('#pemasangModal input#serachList').focus();
});

//mencari pemasang iklan
$(document).on('keyup', '#pemasangModal #serachList', function () {
    var params = $(this).val();
    getCustomers(params, 'pemasangModal');
});

//ajax mengambil data pemasang
function getCustomers(param, modalTag) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/customers',
            method: 'get',
            params: [
                {
                    name: param
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data)['hydra:member'];

            tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Kode</th><th>Nama</th><th>Kota</th></tr></thead>';
            tableData += '<tbody id="'+modalTag+'Data">';

            $.each(memberData, function (index, value) {
                tableData += '<tr style="cursor: pointer" data-id="'+value.id+'" data-address="'+value.address+' '+value.city.name+'">';
                tableData += '<td>'+value.code+'</td>';
                tableData += '<td>'+value.name+'</td>';
                tableData += '<td>'+value.city.name+'</td>';
                tableData += '</tr>';
            });

            tableData += '</tbody>';
            tableData += '<table>';
            tableData += '';

            if (memberData.length > 0) {
                tableData = tableData;
            } else {
                tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Kode</th><th>Nama</th><th>Kota</th></tr></thead>';
                tableData += '<tbody>';
                tableData += '<tr><td colspan="3" class="text-danger">TIDAK ADA DATA</td></tr>';
                tableData += '</tbody>';
                tableData += '<tbody>';
            }
            $('#'+modalTag +' .modal-body #data-list').html(tableData);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

// ketika klik tombol pilih klien
$(document).on('click', '#klien button', function () {
    getCustomers(null, 'klienModal');
    $('#klienModal').modal({show: true, backdrop: 'static'});
    $('#klienModal input#serachList').focus();
});

//cari klien
$(document).on('keyup', '#klienModal #serachList', function () {
    var params = $(this).val();
    getCustomers(params, 'klienModal');
});

// $(document).ajaxComplete(function() {
    //pilih pemasang iklan dari list dg cara double klik
    $(document).on('dblclick', '#pemasangModalData tr', function () {
        var customerId = $(this).data('id');
        $('#customer').val('/api/advertising/customers/'+customerId);
        $('input[name="pemasang"]').val($(this).find('td:eq(1)').text());
        $('#pemasangModal').modal('hide');
        $('#customerAddress').val($(this).data('address'));
    });

    //pilih klien dari list dg cara double klik
    $(document).on('dblclick', '#klienModalData tr', function () {
        var klienId = $(this).data('id');
        $('#client').val('/api/advertising/customers/'+klienId);
        $('input[name="klien"]').val($(this).find('td:eq(1)').text()+' - '+$(this).find('td:eq(2)').text());
        $('#klienModal').modal('hide');
    });
// });

// klik tombol Jenis Iklan
$(document).on('click', '#jenisIklan button', function () {
    getSpecifications();
    $('#jenisIklanModal').modal({show: true, backdrop: 'static'});
    $('#jenisIklanModal input#serachList').focus();
});

//pencarian jenis iklan
$(document).on('keyup', '#jenisIklanModal #serachList', function () {
    var params = $(this).val();
    getSpecifications(params);
});

// mengambil data jenis iklan
function getSpecifications(params) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/specifications',
            method: 'get',
            params: [
                {
                    name: params
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data)['hydra:member'];

            tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Jenis Iklan</th></tr></thead>';
            tableData += '<tbody id="jenisIklanModalData">';

            $.each(memberData, function (index, value) {
                tableData += '<tr style="cursor: pointer" data-id="'+value.id+'">';
                tableData += '<td>'+value.name+'</td>';
                tableData += '</tr>';
            });

            tableData += '</tbody>';
            tableData += '<table>';
            tableData += '';

            if (memberData.length > 0) {
                tableData = tableData;
            } else {
                tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Jenis Iklan</th></tr></thead>';
                tableData += '<tbody>';
                tableData += '<tr><td colspan="1" class="text-danger">TIDAK ADA DATA</td></tr>';
                tableData += '</tbody>';
                tableData += '<tbody>';
            }
            $('#jenisIklanModal .modal-body #data-list').html(tableData);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

// $(document).ajaxComplete(function() {
    //ketika double klik list jenis iklan
    $(document).on('dblclick', '#jenisIklanModalData tr', function () {
        var specificationId = $(this).data('id');
        $('#specification').val('/api/advertising/specifications/'+specificationId);
        $('input[name="jenisIklan"]').val($(this).find('td:eq(0)').text());
        $('#jenisIklanModal').modal('hide');

        $('#btn-order').prop('disabled', true);
        $('#btn-order-update').prop('disabled', true);

        $('#hitung').click();
        $('#tipeIklan button').prop('disabled', false);
    });
// });
// end Jenis Iklan

// klik pilih Tipe Iklan

if ( $('#specification').val() ) {
    $('#tipeIklan button').prop('disabled', false);
}

$(document).on('click', '#tipeIklan button', function () {
    var longSpcId = $('#specification').val();
    var spcId = longSpcId.split('/').pop();
    getTypes(null, spcId);
    $('#tipeIklanModal').modal({show: true, backdrop: 'static'});
    $('#tipeIklanModal input#serachList').focus();
});

//pencarian tipe iklan
$(document).on('keyup', '#tipeIklanModal #serachList', function () {
    var params = $(this).val();
    var longSpcId = $('#specification').val();
    var spcId = longSpcId.split('/').pop();
    getTypes(params, spcId);
});

//mengambil data tipe iklan
function getTypes(params, spcId) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/specification-details',
            method: 'get',
            params: [
                {
                    'type.name': params,
                    'specification.id': spcId
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data)['hydra:member'];

            tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Tipe Iklan</th></tr></thead>';
            tableData += '<tbody id="tipeIklanModalData">';

            $.each(memberData, function (index, value) {
                tableData += '<tr style="cursor: pointer" data-id="'+value.type.id+'">';
                tableData += '<td>'+value.type.name+'</td>';
                tableData += '</tr>';
            });

            tableData += '</tbody>';
            tableData += '<table>';
            tableData += '';

            if (memberData.length > 0) {
                tableData = tableData;
            } else {
                tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Tipe Iklan</th></tr></thead>';
                tableData += '<tbody>';
                tableData += '<tr><td colspan="1" class="text-danger">TIDAK ADA DATA</td></tr>';
                tableData += '</tbody>';
                tableData += '<tbody>';
            }
            $('#tipeIklanModal .modal-body #data-list').html(tableData);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

//$(document).ajaxComplete(function() {
    //ketika double klik list tipe iklan
    $(document).on('dblclick', '#tipeIklanModalData tr', function () {
        var typesId = $(this).data('id');
        $('#type').val('/api/advertising/types/'+typesId);
        $('input[name="tipeIklan"]').val($(this).find('td:eq(0)').text());
        $('#tipeIklanModal').modal('hide');
        
        $.ajax({
            type: 'post',
            url: '/api',
            data: {
                method: 'get',
                module: 'advertising/prices',
                params: [
                    {
                        'specificationDetail.type.id': typesId,
                        active: true
                    }
                ]
            },
            success: function (data) {

                var total = JSON.parse(data)['hydra:totalItems'];
                var data = JSON.parse(data)['hydra:member'];

                if (total > 0) {
                    $('#basePrice, [name="basePrice"]').val(data[0]['price']);
                } else {
                    $('#basePrice, [name="basePrice"]').val(0);
                }

            }
        });
        
    });
//});
// end Tipe Iklan

// klik pilih Media Iklan
$(document).on('click', '#mediaIklan button', function () {
    getMedia();
    $('#mediaIklanModal').modal({show: true, backdrop: 'static'});
    $('#mediaIklanModal input#serachList').focus();
});

//pencarian list media iklan
$(document).on('keyup', '#mediaIklanModal #serachList', function () {
    var params = $(this).val();
    getMedia(params);
});

//ambil data media iklan
function getMedia(params) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/media',
            method: 'get',
            params: [
                {
                    name: params
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data)['hydra:member'];

            tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Media klan</th></tr></thead>';
            tableData += '<tbody id="mediaIklanModalData">';

            $.each(memberData, function (index, value) {
                tableData += '<tr style="cursor: pointer" data-id="'+value.id+'">';
                tableData += '<td>'+value.name+'</td>';
                tableData += '</tr>';
            });

            tableData += '</tbody>';
            tableData += '<table>';
            tableData += '';

            if (memberData.length > 0) {
                tableData = tableData;
            } else {
                tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Media Iklan</th></tr></thead>';
                tableData += '<tbody>';
                tableData += '<tr><td colspan="1" class="text-danger">TIDAK ADA DATA</td></tr>';
                tableData += '</tbody>';
                tableData += '<tbody>';
            }
            $('#mediaIklanModal .modal-body #data-list').html(tableData);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

// $(document).ajaxComplete(function() {
    //double klik media iklan
    $(document).on('dblclick', '#mediaIklanModalData tr', function () {
        var mediaId = $(this).data('id');
        $('#media').val('/api/advertising/media/'+mediaId);
        $('input[name="mediaIklan"]').val($(this).find('td:eq(0)').text());
        $('#mediaIklanModal').modal('hide');
    });
// });
// end Media Iklan

// klik pilih Emiten
$(document).on('click', '#category button', function () {
    getCategory();
    $('#categoryModal').modal({show: true, backdrop: 'static'});
});

//ambil data emiten
function getCategory() {
    $.ajax({
        url: '/advertising/categories/tree',
        type: 'GET',
        success: function (data, textStatus, jqXHR) {
            var html = '<ul id="categoriesTree" style="font-size: 16px;">' +
                            '<li><span>KATEGORI IKLAN</span></a>' +
                                '<ul>' + data + '</ul>' +
                            '</li>' +
                        '</ul>';

            $('#categoryModal .modal-body').html(html);
            $('#categoriesTree').treed({openedClass:'glyphicon-folder-open', closedClass:'glyphicon-folder-close'});
            $("#categoriesTree > .branch").trigger('click');

            $('#categoriesTree li span').bind('contextmenu', function() {
                $('#categoriesTree li span').removeClass('active');
                $(this).addClass('active');
            });

            $('#categoriesTree li span').click(function () {
                $('#categoriesTree li span').removeClass('active');
                $(this).addClass('active');
            });

            $('ul#categoriesTree li span').dblclick(function () {
                $('#categoryValue').val('');

                var id = $(this).closest('li span').data('id');
                var breadCrumb = [];
                $(this).parents('li').each(function (index, value) {
                    var treeText = value.innerText;
                    var treeArr = treeText.match(/[^\r\n]+/g);
                    breadCrumb.push(treeArr[0]);
                });
                var bcArr = breadCrumb.reverse();
                var list = '';
                var total = bcArr.length;
                $.each(bcArr, function (index, value) {
                    if (index !== 0) {
                        if (index === total - 1) {
                            list += value+'  ';
                        } else {
                            list += value+' ➤ ';
                        }

                    }
                });
                $('#categoryValue').val(list);
                $('[name="category"]').val('/api/advertising/categories/'+id);
                $('#categoryModal').modal('hide');
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

// pilih PIC / accountExecutive
$(document).on('click', '#pic button', function () {
    getPIC();
    $('#PICModal').modal({show: true, backdrop: 'static'});
    $('#PICModal input#serachList').focus();
});

//cari PIC
$(document).on('keyup', '#PICModal #serachList', function () {
    var params = $(this).val();
    getPIC(params);
});

//ambil data PIC
function getPIC(params) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/account-executives',
            method: 'get',
            params: [
                {
                    name: params
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data)['hydra:member'];

            tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th width="25%">Kode</th><th>Nama PIC</th></tr></thead>';
            tableData += '<tbody id="PICModalData">';

            $.each(memberData, function (index, value) {
                tableData += '<tr style="cursor: pointer" data-id="'+value.id+'">';
                tableData += '<td>'+value.code+'</td>';
                tableData += '<td>'+value.name+'</td>';
                tableData += '</tr>';
            });

            tableData += '</tbody>';
            tableData += '<table>';
            tableData += '';

            if (memberData.length > 0) {
                tableData = tableData;
            } else {
                tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th width="25%">Kode</th><th>Nama PIC</th></tr></thead>';
                tableData += '<tbody>';
                tableData += '<tr><td colspan="2" class="text-danger">TIDAK ADA DATA</td></tr>';
                tableData += '</tbody>';
                tableData += '<tbody>';
            }
            $('#PICModal .modal-body #data-list').html(tableData);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

// $(document).ajaxComplete(function() {
    //double klik data PIC
    $(document).on('dblclick', '#PICModalData tr', function () {
        var accountExecutiveId = $(this).data('id');
        $('#accountExecutive').val('/api/advertising/account-executives/'+accountExecutiveId);
        $('input[name="pic"]').val($(this).find('td:eq(1)').text());
        $('#PICModal').modal('hide');
    });
// });
// end PIC / accountExecutive

// pilih Sisipan
$(document).on('click', '#sisipan button:not(#clearText)', function () {
    getSisipan();
    $('#sisipanModal').modal({show: true, backdrop: 'static'});
    $('#sisipanModal input#serachList').focus();
});

//cari list sisipan
$(document).on('keyup', '#sisipanModal #serachList', function () {
    var params = $(this).val();
    getSisipan(params);
});

//ambil data sisipan
function getSisipan(params) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'cities',
            method: 'get',
            params: [
                {
                    name: params
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data)['hydra:member'];

            tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Nama Kota</th></tr></thead>';
            tableData += '<tbody id="sisipanModalData">';

            $.each(memberData, function (index, value) {
                tableData += '<tr style="cursor: pointer" data-id="'+value.id+'">';
                tableData += '<td>'+value.name+'</td>';
                tableData += '</tr>';
            });

            tableData += '</tbody>';
            tableData += '<table>';
            tableData += '';

            if (memberData.length > 0) {
                tableData = tableData;
            } else {
                tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Nama Kota</th></tr></thead>';
                tableData += '<tbody>';
                tableData += '<tr><td colspan="1" class="text-danger">TIDAK ADA DATA</td></tr>';
                tableData += '</tbody>';
                tableData += '<tbody>';
            }
            $('#sisipanModal .modal-body #data-list').html(tableData);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

// $(document).ajaxComplete(function() {
    // double klik data sisipan
    $(document).on('dblclick', '#sisipanModalData tr', function () {
        var cityId = $(this).data('id');
        $('#sirculationArea').val('/api/cities/'+cityId);
        $('input[name="sisipan"]').val($(this).find('td:eq(0)').text());
        $('#sisipanModal').modal('hide');
        $('#clearText').show();
    });
// });

//tombol clear
if (!$('#sirculationArea').val()) {
    $('#clearText').hide();
}
// end Sisipan

// accounting js
accounting.settings = {
    currency: {
        symbol : "",
        format: "%s%v",
        decimal : ",",
        thousand: ".",
        precision : 2
    },
    number: {
        precision : 0,
        thousand: ".",
        decimal : ","
    }
}

function unformatMoney(formatted) {
    return parseFloat(formatted.replace(/[^0-9-,]/g, ''));
}

//menghitung biaya
function getBiaya() {
    var kolom;
    var mmBaris;
    var terbit;
    var tarif;
    var final;

    kolom = parseInt($('#columnSize').val());
    mmBaris = parseInt($('#milimeterSize').val());
    terbit = parseInt($('#totalPost').val());
    tarif = unformatMoney($('#basePrice').val());

    if (!$('#columnSize').val()) {
        kolom = parseFloat(0);
    }

    if (!$('#milimeterSize').val()) {
        mmBaris = parseFloat(0);
    }

    if (!$('#totalPost').val()) {
        terbit = parseFloat(0);
    }

    if (!$('#basePrice').val()) {
        tarif = parseFloat(0);
    }

    if (
        $('input[name="jenisIklan"]').val().toLowerCase() === 'kuping' ||
        $('input[name="jenisIklan"]').val().toLowerCase() === 'banner' ||
        $('input[name="jenisIklan"]').val().toLowerCase() === 'stapel' ||
        $('input[name="jenisIklan"]').val().toLowerCase() === 'eksposisi' ||
        $('input[name="jenisIklan"]').val().toLowerCase() === 'tarif khusus' ||
        $('input[name="jenisIklan"]').val().toLowerCase().startsWith('paket')
    ) {
        final = parseFloat(tarif);
        return final;
    } else {
        final = parseFloat((kolom * mmBaris) * terbit * tarif);
        return final;
    }
}

// menghitung diskon dalam %
function getDiscountValue() {
    var ppnRp;
    var diskonRp;

    ppnRp = unformatMoney($('#taxValue').val());
    if (!$('#taxValue').val()) {
        ppnRp = parseFloat(0);
    }

    var biaya = getBiaya() + ppnRp;

    diskonRp = unformatMoney($('#discountValue').val());
    if (!$('#discountValue').val()) {
        diskonRp = parseFloat(0);
    }

    var diskonPersen = ( diskonRp / biaya ) * 100;
    $('#discountPercentage').val(diskonPersen);
}

// menghitung diskon dalam rupiah
function getDiscountPercentage() {
    var ppnRp;
    var diskonPersen;
    ppnRp = unformatMoney($('#taxValue').val());
    if (!$('#taxValue').val()) {
        ppnRp = parseFloat(0);
    }

    var biaya = getBiaya() + ppnRp;

    diskonPersen = unformatMoney($('#discountPercentage').val());
    if (!$('#discountPercentage').val()) {
        diskonPersen = parseFloat(0);
    }

    var diskonRp = (biaya * diskonPersen) / 100;
    $('#discountValue').val(diskonRp.toString().replace('.',','));
}

$(document).on('keyup keydown change mouseup', '#discountValue', function () {
    getDiscountValue();
    getJumlahBayar();
});

$(document).on('keyup keydown change mouseup', '#discountPercentage', function () {
    $('#hitung').trigger('click');
});

// menghitung plus diskon dalam %
function getSurchargeValue() {
    var ppnRp;
    var plusDiskonRp;

    ppnRp = unformatMoney($('#taxValue').val());
    if (!$('#taxValue').val()) {
        ppnRp = parseFloat(0);
    }

    var biaya = getBiaya() + ppnRp;

    plusDiskonRp = unformatMoney($('#surchargeValue').val());
    if (!$('#surchargeValue').val()) {
        plusDiskonRp = parseFloat(0);
    }

    var plusDiskonPersen = ( plusDiskonRp / biaya ) * 100;
    $('#surchargePercentage').val(plusDiskonPersen);
}

// menghitung plus diskon dalam rupiah
function getSurchargePercentage() {
    var ppnRp;
    var plusDiskonPersen;

    ppnRp = unformatMoney($('#taxValue').val());
    if (!$('#taxValue').val()) {
        ppnRp = parseFloat(0);
    }

    var biaya = getBiaya() + ppnRp;

    plusDiskonPersen = unformatMoney($('#surchargePercentage').val());
    if (!$('#surchargePercentage').val()) {
        plusDiskonPersen = parseFloat(0);
    }

    var plusDiskonRp = (biaya * plusDiskonPersen) / 100;
    $('#surchargeValue').val(plusDiskonRp.toString().replace('.',','));
}

$(document).on('keyup keydown change mouseup', '#surchargeValue', function () {
    getSurchargeValue();
    getJumlahBayar();
});

$(document).on('keyup keydown change mouseup', '#surchargePercentage', function () {
    $('#hitung').trigger('click');
});

// menghitung min diskon dalam %
function getMinDiscountValue() {
    var ppnRp;
    var minDiskonRp;

    ppnRp = unformatMoney($('#taxValue').val());
    if (!$('#taxValue').val()) {
        ppnRp = parseFloat(0);
    }

    var biaya = getBiaya() + ppnRp;

    minDiskonRp = unformatMoney($('#minDiscountValue').val());
    if (!$('#minDiscountValue').val()) {
        minDiskonRp = parseFloat(0);
    }

    var minDiskonPersen = ( minDiskonRp / biaya ) * 100;
    $('#minDiscountPercentage').val(minDiskonPersen);
}

// menghitung min diskon dalam rupiah
function getMinDiscountPercentage() {
    var ppnRp;
    var minDiskonPersen;

    ppnRp = unformatMoney($('#taxValue').val());
    if (!$('#taxValue').val()) {
        ppnRp = parseFloat(0);
    }

    var biaya = getBiaya() + ppnRp;

    minDiskonPersen = unformatMoney($('#minDiscountPercentage').val());
    if (!$('#minDiscountPercentage').val()) {
        minDiskonPersen = parseFloat(0);
    }

    var minDiskonRp = (biaya * minDiskonPersen) / 100;
    $('#minDiscountValue').val(minDiskonRp.toString().replace('.',','));
}

$(document).on('keyup keydown change mouseup', '#minDiscountValue', function () {
    getMinDiscountValue();
    getJumlahBayar();
});

$(document).on('keyup keydown change mouseup', '#minDiscountPercentage', function () {
    $('#hitung').trigger('click');
});

// menghitung npb diskon dalam %
function getNpbDiscountValue() {
    var ppnRp;
    var npbDiskonRp;

    ppnRp = unformatMoney($('#taxValue').val());
    if (!$('#taxValue').val()) {
        ppnRp = parseFloat(0);
    }

    var biaya = getBiaya() + ppnRp;

    npbDiskonRp = unformatMoney($('#npbDiscountValue').val());
    if (!$('#npbDiscountValue').val()) {
        npbDiskonRp = parseFloat(0);
    }

    var npbDiskonPersen = ( npbDiskonRp / biaya ) * 100;
    $('#npbDiscountPercentage').val(npbDiskonPersen);
}

// menghitung npb diskon dalam rupiah
function getNpbDiscountPercentage() {
    var ppnRp;
    var npbDiskonPersen;

    ppnRp = unformatMoney($('#taxValue').val());
    if (!$('#taxValue').val()) {
        ppnRp = parseFloat(0);
    }

    var biaya = getBiaya() + ppnRp;

    npbDiskonPersen = unformatMoney($('#npbDiscountPercentage').val());
    if (!$('#npbDiscountPercentage').val()) {
        npbDiskonPersen = parseFloat(0);
    }

    var npbDiskonRp = (biaya * npbDiskonPersen) / 100;
    $('#npbDiscountValue').val(npbDiskonRp.toString().replace('.',','));
}

$(document).on('keyup keydown change mouseup', '#npbDiscountValue', function () {
    getNpbDiscountValue();
    getJumlahBayar();
});

$(document).on('keyup keydown change mouseup', '#npbDiscountPercentage', function () {
    $('#hitung').trigger('click');
});

// hitung pajak %
function getTaxValue(){
    var ppnRp;

    ppnRp = unformatMoney($('#taxValue').val());
    if (!$('#taxValue').val()) {
        ppnRp = parseFloat(0);
    }

    var ppnPersen = ( ppnRp / getBiaya() ) * 100;
    $('#taxPercentage').val(ppnPersen);
}

// hitung pajak rupiah
function getTaxPercentage() {
    var ppnPersen;

    ppnPersen = unformatMoney($('#taxPercentage').val());
    if (!$('#taxPercentage').val()) {
        ppnPersen = parseFloat(0);
    }

    var taxValue = (getBiaya() * ppnPersen) / 100;
    $('#taxValue').val(taxValue.toString().replace('.',','));
}

$(document).on('keyup keydown change mouseup', '#taxValue', function () {
    getTaxValue();
    getJumlahBayar();
});

$(document).on('keyup keydown change mouseup', '#taxPercentage', function () {
    $('#hitung').trigger('click');
});

// hitung cahsback %
function getCashBackValue() {
    var diskon;
    var plusDiskon;
    var minDiskon;
    var npbDiskon;
    var ppn;

    diskon = unformatMoney($('#discountValue').val());
    if (!$('#discountValue').val()) {
        diskon = parseFloat(0);
    }

    plusDiskon = unformatMoney($('#surchargeValue').val());
    if (!$('#surchargeValue').val()) {
        plusDiskon = parseFloat(0);
    }

    minDiskon = unformatMoney($('#minDiscountValue').val());
    if (!$('#minDiscountValue').val()) {
        minDiskon = parseFloat(0);
    }

    npbDiskon = unformatMoney($('#npbDiscountValue').val());
    if (!$('#minDiscountValue').val()) {
        npbDiskon = parseFloat(0);
    }

    ppn = unformatMoney($('#taxValue').val());
    if (!$('#taxValue').val()) {
        ppn = parseFloat(0);
    }

    var biaya = getBiaya() - diskon - plusDiskon - minDiskon - npbDiskon + ppn;
    var cashBackRp = unformatMoney($('#cashBackValue').val());

    var cashBackPersen = ( cashBackRp / biaya ) * 100;
    $('#cashBackPercentage').val(cashBackPersen);
}

// hitung cashback rupiah
function getCashBackPercentage() {
    var diskon;
    var plusDiskon;
    var minDiskon;
    var npbDiskon;
    var ppn;

    diskon = unformatMoney($('#discountValue').val());
    if (!$('#discountValue').val()) {
        diskon = parseFloat(0);
    }

    plusDiskon = unformatMoney($('#surchargeValue').val());
    if (!$('#surchargeValue').val()) {
        plusDiskon = parseFloat(0);
    }

    minDiskon = unformatMoney($('#minDiscountValue').val());
    if (!$('#minDiscountValue').val()) {
        minDiskon = parseFloat(0);
    }

    npbDiskon = unformatMoney($('#npbDiscountValue').val());
    if (!$('#minDiscountValue').val()) {
        npbDiskon = parseFloat(0);
    }

    ppn = unformatMoney($('#taxValue').val());
    if (!$('#taxValue').val()) {
        ppn = parseFloat(0);
    }

    var biaya = getBiaya() - diskon - plusDiskon - minDiskon - npbDiskon + ppn;
    var cashBackPersen = parseFloat($('#cashBackPercentage').val());

    var cashBackRp = (biaya * cashBackPersen) / 100;
    $('#cashBackValue').val(cashBackRp.toString().replace('.',','));
}

$(document).on('keyup keydown change mouseup', '#cashBackValue', function () {
    getCashBackValue();
    getJumlahBayar();
});

$(document).on('keyup keydown change mouseup', '#cashBackPercentage', function () {
    $('#hitung').trigger('click');
});

// ambil diskon
// function getDiscount() {
//     var result;
//     var $this = 'input[name=pickDiscount]';
//     if ($($this+':checked').length > 0) {
//         if ($($this+':checked').val() === '1') {
//             result = $('#discountPercentage').val();
//         } else {
//             result = unformatMoney($('#discountValue').val());
//         }
//     } else {
//         result = parseFloat(0);
//     }
//
//     console.log(result);
// }

// hitung jumlah bayar
function getJumlahBayar() {
    var diskon;
    var ppn;
    var cashBack;
    var plusDiskon;
    var minDiskon;
    var npbDiskon;

    diskon = unformatMoney($('#discountValue').val());
    ppn = unformatMoney($('#taxValue').val());
    cashBack = unformatMoney($('#cashBackValue').val());
    plusDiskon = unformatMoney($('#surchargeValue').val());
    minDiskon = unformatMoney($('#minDiscountValue').val());
    npbDiskon = unformatMoney($('#npbDiscountValue').val());

    if (!$('#discountValue').val()) {
        diskon = parseFloat(0);
    }

    if (!$('#taxValue').val()) {
        ppn = parseFloat(0);
    }

    if (!$('#cashBackValue').val()) {
        cashBack = parseFloat(0);
    }

    if (!$('#surchargeValue').val()) {
        plusDiskon = parseFloat(0);
    }

    if (!$('#minDiscountValue').val()) {
        minDiskon = parseFloat(0);
    }

    if (!$('#npbDiscountValue').val()) {
        npbDiskon = parseFloat(0);
    }


    var jumlahBayar = parseFloat(getBiaya() - diskon + ppn - cashBack + plusDiskon - minDiskon - npbDiskon  );
    $('#totalAmount').val(accounting.formatMoney(jumlahBayar));
    $('[name="totalAmount"]').val(jumlahBayar);

    return jumlahBayar;
}

// hitung netto
function getNetto() {
    var quantity;
    quantity = unformatMoney($('#quantity').val());
    if(!$('#quantity').val()) {
        quantity = parseFloat(1);
    }
    var netto = getJumlahBayar() * quantity;

    $('#netto').text('Rp ' + accounting.formatMoney(netto));
    $('#nettoRp').val(netto);

    terbilang('nettoRp', 'terbilangNetto');
}

// base price
$(document).on('blur', '#basePrice', function () {
    var $this = $(this);
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="basePrice"]').val(parseFloat(unformat));
});

// surcharge / plus discount
$(document).on('blur', '#surchargeValue', function () {
    var $this = $(this);
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="surchargeValue"]').val(parseFloat(unformat));
});

$(document).on('blur', '#surchargePercentage', function () {
    var $this = $('#surchargeValue');
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="surchargeValue"]').val(parseFloat(unformat));
});

// discount
$(document).on('blur', '#discountValue', function () {
    var $this = $(this);
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="discountValue"]').val(parseFloat(unformat));
});

$(document).on('blur', '#discountPercentage', function () {
    var $this = $('#discountValue');
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="discountValue"]').val(parseFloat(unformat));
});

//min discount
$(document).on('blur', '#minDiscountPercentage', function () {
    var $this = $('#minDiscountValue');
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="minDiscountValue"]').val(parseFloat(unformat));
});

$(document).on('blur', '#minDiscountValue', function () {
    var $this = $(this);
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="minDiscountValue"]').val(parseFloat(unformat));
});

//npb discount
$(document).on('blur', '#npbDiscountPercentage', function () {
    var $this = $('#npbDiscountValue');
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="npbDiscountValue"]').val(parseFloat(unformat));
});

$(document).on('blur', '#minDiscountValue', function () {
    var $this = $(this);
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="npbDiscountValue"]').val(parseFloat(unformat));
});

// tax
$(document).on('blur', '#taxValue', function () {
    var $this = $(this);
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="taxValue"]').val(parseFloat(unformat));
});

$(document).on('blur', '#taxPercentage', function () {
    var $this = $('#taxValue');
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="taxValue"]').val(parseFloat(unformat));
});

// cashback
$(document).on('blur', '#cashBackValue', function () {
    var $this = $(this);
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="cashBackValue"]').val(parseFloat(unformat));
});

$(document).on('blur', '#cashBackPercentage', function () {
    var $this = $('#cashBackValue');
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="cashBackValue"]').val(parseFloat(unformat));
});


// total
$(document).on('blur', '#totalAmount', function () {
    var $this = $(this);
    var value = $this.val();
    var unformat = value.replace(/\./g,'').replace(/\,/g,'.');
    $this.val(accounting.formatMoney(unformat));
    $('[name="totalAmount"]').val(parseFloat(unformat));
});

// klik tombol hitung
$(document).on(
    'click', '#hitung',
    function (e) {
        e.preventDefault();

        // if (!$('#taxPercentage').val()) {
        //     $('#taxPercentage').val(0);
        // }
        //
        // if (!$('#surchargePercentage').val()) {
        //     $('#surchargePercentage').val(0);
        // }
        //
        // if (!$('#minDiscountPercentage').val()) {
        //     $('#minDiscountPercentage').val(0);
        // }
        //
        // if (!$('#discountPercentage').val()) {
        //     $('#discountPercentage').val(0);
        // }
        //
        // if (!$('#npbDiscountPercentage').val()) {
        //     $('#npbDiscountPercentage').val(0);
        // }
        //
        // if (!$('#cashBackPercentage').val()) {
        //     $('#cashBackPercentage').val(0);
        // }

        getTaxPercentage();
        getDiscountPercentage();
        getCashBackPercentage();

        getSurchargePercentage();
        getMinDiscountPercentage();
        getNpbDiscountPercentage();

        getNetto();

        var tax = $('#taxValue');
        var taxValue = tax.val();
        var unformatTax = taxValue.replace(/\./g,'').replace(/\,/g,'.');
        tax.val(accounting.formatMoney(unformatTax));

        var discount = $('#discountValue');
        var discountValue = discount.val();
        var unformatDiscount= discountValue.replace(/\./g,'').replace(/\,/g,'.');
        discount.val(accounting.formatMoney(unformatDiscount));

        var cashBack = $('#cashBackValue');
        var cashBackValue = cashBack.val();
        var unformatCashBack = cashBackValue.replace(/\./g,'').replace(/\,/g,'.');
        cashBack.val(accounting.formatMoney(unformatCashBack));

        var surcharge = $('#surchargeValue');
        var surchargeValue = surcharge.val();
        var unformatSurcharge = surchargeValue.replace(/\./g,'').replace(/\,/g,'.');
        surcharge.val(accounting.formatMoney(unformatSurcharge));

        var minDiscount = $('#minDiscountValue');
        var minDiscountValue = minDiscount.val();
        var unformatMinDiscount = minDiscountValue.replace(/\./g,'').replace(/\,/g,'.');
        minDiscount.val(accounting.formatMoney(unformatMinDiscount));

        var npbDiscount = $('#npbDiscountValue');
        var npbDiscountValue = npbDiscount.val();
        var unformatNpbDiscount = npbDiscountValue.replace(/\./g,'').replace(/\,/g,'.');
        npbDiscount.val(accounting.formatMoney(unformatNpbDiscount));

        $('#btn-order').prop('disabled', false).text('SIMPAN');
        $('#btn-order-update').prop('disabled', false).text('SIMPAN');
});

$(document).on(
    'keyup keydown change mouseup',
    '#columnSize, #milimeterSize, #totalPost, ' +
    '#basePrice, #discountValue, #discountPercentage, ' +
    '#taxValue, #taxPercentage, #quantity, ' +
    '#cashBackValue, #cashBackPercentage, ' +
    'input[name="jenisIklan"], #specification',
    function () {
        $('#netto').text(accounting.formatMoney(0, "Rp ", 2, ".", ","));
        $('#nettoRp').val(0);
        $('#btn-order').prop('disabled', true).text('KLIK TOMBOL HITUNG');
        $('#btn-order-update').prop('disabled', true).text('KLIK TOMBOL HITUNG');
    });

// fungsi terbilang rupiah indonesia
function terbilang(input, output){
    var bilangan=document.getElementById(input).value;
    var kalimat="";
    var angka   = new Array('0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0');
    var kata    = new Array('','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan');
    var tingkat = new Array('','Ribu','Juta','Milyar','Triliun');
    var panjang_bilangan = bilangan.length;

    /* pengujian panjang bilangan */
    if(panjang_bilangan > 15){
        kalimat = "Diluar Batas";
    }else{
        /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
        for(i = 1; i <= panjang_bilangan; i++) {
            angka[i] = bilangan.substr(-(i),1);
        }

        var i = 1;
        var j = 0;

        /* mulai proses iterasi terhadap array angka */
        while(i <= panjang_bilangan){
            subkalimat = "";
            kata1 = "";
            kata2 = "";
            kata3 = "";

            /* untuk Ratusan */
            if(angka[i+2] != "0"){
                if(angka[i+2] == "1"){
                    kata1 = "Seratus";
                }else{
                    kata1 = kata[angka[i+2]] + " Ratus";
                }
            }

            /* untuk Puluhan atau Belasan */
            if(angka[i+1] != "0"){
                if(angka[i+1] == "1"){
                    if(angka[i] == "0"){
                        kata2 = "Sepuluh";
                    }else if(angka[i] == "1"){
                        kata2 = "Sebelas";
                    }else{
                        kata2 = kata[angka[i]] + " Belas";
                    }
                }else{
                    kata2 = kata[angka[i+1]] + " Puluh";
                }
            }

            /* untuk Satuan */
            if (angka[i] != "0"){
                if (angka[i+1] != "1"){
                    kata3 = kata[angka[i]];
                }
            }

            /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
            if ((angka[i] != "0") || (angka[i+1] != "0") || (angka[i+2] != "0")){
                subkalimat = kata1+" "+kata2+" "+kata3+" "+tingkat[j]+" ";
            }

            /* gabungkan variabe sub kalimat (untuk Satu blok 3 angka) ke variabel kalimat */
            kalimat = subkalimat + kalimat;
            i = i + 3;
            j = j + 1;
        }

        /* mengganti Satu Ribu jadi Seribu jika diperlukan */
        if ((angka[5] == "0") && (angka[6] == "0")){
            kalimat = kalimat.replace("Satu Ribu","Seribu");
        }

        kalimat = kalimat+' Rupiah';
    }

    if (bilangan === 'NaN' || bilangan === '0' || bilangan === 'undefined') {
        document.getElementById(output).innerHTML='Nol Rupiah';
    } else {
        document.getElementById(output).innerHTML=kalimat;
    }
}

function newBlankDate() {
    $('.pilih-tanggal').datetimepicker({
        locale: 'id',
        // disabledDates : ["2017-08-29","2017-08-22"],
        format: 'dddd, DD MMMM YYYY',
        ignoreReadonly: true
    }).on('dp.hide', function(e){
        var tgl = e.date.format('YYYY-MM-DD HH:mm:ss');
        $(this).next().val(tgl);
    }).on('dp.hide', function(e){
        if($(this).closest('tr').is(':last-child') && !$(this).closest('tr').children('input.pilih-tanggal').val()) {
            $('<tr><td style="position: relative;"><input readonly type="text" class="pilih-tanggal form-control"><input type="hidden" name="tanggal[]"><button class="btn-hapus-tanggal btn btn-danger btn-xs pull-right" style="position: absolute;right: 14px;top: 14px;">Hapus</button></td></tr>')
                .insertAfter($('#eTanggal tr').last());
            newBlankDate();
        }
    });
}

// ambil data edisi terbit
$(document).on('click', '#edisiTerbitButton', function (e) {
    e.preventDefault();
    var orderId = $('#orderForm input[name="id"]').val();

    $.ajax({
        url: '/api',
        type: 'post',
        data: {
            module: 'advertising/publish-ads',
            method: 'get',
            params: [
                {
                    'order.id': orderId
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {
            var count = JSON.parse(data)['hydra:totalItems'];
            count = Math.ceil(count / 366);

            var dates = [];
            for (var i = 1; i <= count; i++) {

                $.ajax({
                    url: '/api',
                    type: 'post',
                    data: {
                        module: 'advertising/publish-ads',
                        method: 'get',
                        params: [
                            {
                                'order.id': orderId,
                                'page': i
                            }
                        ]
                    },
                    success: function (data, textStatus, jqXHR) {
                        var data = JSON.parse(data)['hydra:member'];
                        $.each(data, function (index, value) {
                            dates.push({id: value.id,publishDate: value.publishDate});
                        });

                        if (Math.ceil(dates.length / 366) == count) {
                            var no = 1;
                            var tr ='';
                            var dateList ='';
                            $.each(dates, function (index, value) {
                                tr += '<tr>';
                                tr += '<td class="id" style="display: none">'+value.id+'</td>';
                                tr += '<td class="no">'+no+'</td>';
                                tr += '<td class="tgl">'+moment(value.publishDate).format("dddd, DD MMMM YYYY")+'</td>';
                                tr += '<td><span class="pull-right"><button class="btn btn-xs btn-flat btn-default edit-item-btn"><i class="fa fa-pencil"></i></button>';
                                tr += '<button class="btn btn-xs btn-flat btn-default remove-item-btn"><i class="fa fa-times"></i></button></span></td>';
                                tr += '</tr>';
                                dateList += '<input type="hidden" id="'+value.id+'" value="'+value.publishDate+'">';
                                no++;
                            });

                            if ( $('#edisiTerbitModal tbody tr#gettingData').children().length > 0 ) {

                                $('#edisiTerbitModal tbody').html(tr);
                                $('#edisiTerbitModal #dateForm').html(dateList);

                                datesList = new List('DatesList', {
                                    valueNames: [ 'id', 'no', 'tgl'],
                                    page: 7,
                                    pagination: true
                                });

                                $(document).on('click', '.edit-item-btn', function () {
                                    var id = $(this).closest('tr').find('.id').text();
                                    var tgl = $(this).closest('tr').find('.tgl');
                                    var tglText = tgl.text();

                                    localStorage.setItem('tglText', tglText);

                                    $(this)
                                        .removeClass('edit-item-btn')
                                        .addClass('save-item-btn')
                                        .removeClass('btn-default')
                                        .addClass('btn-warning');

                                    tgl.html('<input type="text" value="'+tglText+'" class="form-control input-sm" style="width: 50%;">');

                                    $(this).closest('tr').find('input').datetimepicker({
                                        locale: 'id',
                                        format: "dddd, DD MMMM YYYY"
                                    }).focus();
                                });

                                $(document).on('click', '.save-item-btn', function () {
                                    var id = $(this).closest('tr').find('.id').text();
                                    var item = datesList.get('id', id)[0];
                                    var tgl = $(this).closest('tr').find('.tgl');
                                    var inputValue = $(this).closest('tr').find('input').val();

                                    item.values({
                                        id: id,
                                        tgl: inputValue
                                    });

                                    tgl.text(inputValue);

                                    var tglReady = moment(inputValue, 'dddd, DD MMMM YYYY').format();
                                    var readyForm = $('#dateForm input#'+id);
                                    readyForm.val(tglReady);

                                    if (!readyForm.hasClass('post')) {
                                        readyForm.addClass('put');
                                    }

                                    $(this)
                                        .removeClass('save-item-btn')
                                        .addClass('edit-item-btn')
                                        .removeClass('btn-warning')
                                        .addClass('btn-default');

                                });

                                $(document).on('click', '.remove-item-btn', function () {
                                    var id = $(this).closest('tr').find('.id').text();
                                    $(this).closest('tr').remove();
                                    datesList.remove('id', id);

                                    var readyForm = $('#dateForm input#'+id);
                                    readyForm.addClass('delete');
                                });

                                $('input#addDate').datetimepicker({
                                    locale: 'id',
                                    format: "dddd, DD MMMM YYYY",
                                    ignoreReadonly: true
                                }).on('dp.change', function(e){
                                    $('p.help-block').remove();
                                });

                                $(document).on('click', '#addDateBtn', function () {

                                    var addDateInput = $('#addDate');
                                    var id = new Date().getTime();
                                    $('p.help-block').remove();

                                    if ($('input#addDate').val()) {

                                        var dateValue = addDateInput.val();

                                        var arrTgl = [];
                                        $.each(datesList.items, function (index, value) {
                                            arrTgl.push(value._values.tgl);
                                        });

                                        if ( !arrTgl.includes(dateValue) ) {
                                            datesList.add({
                                                id: id,
                                                no: datesList.items.length + 1,
                                                tgl: dateValue
                                            });

                                            var date = moment(addDateInput.val(), 'dddd, DD MMMM YYYY').format();
                                            var newDate = '<input type="hidden" id="'+id+'" value="'+date+'" class="post">'
                                            $('#dateForm').append(newDate);

                                            addDateInput.val('');
                                        } else {
                                            var elm = $('input#addDate').closest('div.input-group');
                                            $('<p class="help-block">Tanggal tersebut telah ditambahkan</p>').insertAfter(elm);
                                        }

                                    }
                                });
                            }

                        }
                    }
                });

            }

        }
    });

    $('#edisiTerbitModal').modal({show: true, backdrop: 'static'});
});

$(document).on('click', '#setEdisiTerbitButton', function (e) {
    e.preventDefault();
    $('#setEdisiTerbitModal').modal({show: true, backdrop: 'static'});
    $('#edisiTerbitModal').modal('hide');

    newBlankDate();

    $(document).on('click', '.btn-hapus-tanggal', function (e) {
        e.preventDefault();
        if($(this).closest('td').children('input').val()) {
            $(this).closest('tr').remove();
        }
    });

    $('#edisiHarian').datepicker({
        format: "dd/mm/yyyy",
        todayBtn: "linked",
        clearBtn: true,
        language: "id"
    });
});


// https://www.sanwebe.com/2014/01/how-to-select-all-deselect-checkboxes-jquery
//select all checkboxes
$("#cekSemua").change(function(){  //"select all" change
    $('#eHarian #hari input[type="checkbox"]').prop('checked', $(this).prop("checked")); //change all ".checkbox" checked status
});

//".checkbox" change
$('#eHarian #hari input[type="checkbox"]').change(function(){
    //uncheck "select all", if one of the listed checkbox item is unchecked
    if(false == $(this).prop("checked")){ //if this item is unchecked
        $("#cekSemua").prop('checked', false); //change "select all" checked status to false
    }
    //check "select all" if all checkbox items are checked
    if ($('#eHarian #hari input[type="checkbox"]:checked').length == $('#eHarian #hari input[type="checkbox"]').length ){
        $("#cekSemua").prop('checked', true);
    }
});


function parseDate(input) {
    var parts = input.split('-');
    return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}

function getDatesOf( date1, date2, dayToSearch )
{

    var dateObj1 = parseDate(date1);
    var dateObj2 = parseDate(date2);

    var count = 0;

    var week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    var dayIndex = week.indexOf( dayToSearch );

    var dates = [];
    while ( dateObj1.getTime() <= dateObj2.getTime() )
    {
        if (dateObj1.getDay() == dayIndex )
        {
            var time = dateObj1.getTime();
            time = toISODate(time);
            dates.push(moment(time).format("YYYY-MM-DD"));
        }

        dateObj1.setDate(dateObj1.getDate() + 1);
    }
    return dates;
}

function toISODate(milliseconds) {
    var date = new Date(milliseconds);
    var y = date.getFullYear()
    var m = date.getMonth() + 1;
    var d = date.getDate();
    m = (m < 10) ? '0' + m : m;
    d = (d < 10) ? '0' + d : d;
    return [y, m, d].join('-');
}

Array.prototype.removeDuplicates = function () {
    return this.filter(function (item, index, self) {
        return self.indexOf(item) == index;
    });
};

function getDatesByDates() {
    var data = $('#perTgl').serializeArray();
    var tanggal = [];
    $.each(data, function (index, value) {
        if (value.value) {
            tanggal.push(moment(value.value).format("YYYY-MMMM-DD"));
        }
    });

    return tanggal.removeDuplicates();
}

function getDatesByDays() {
    if ($('#startDate').val() && $('#endDate').val()) {
        var startDate = moment($('#startDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var endDate = moment($('#endDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD');

        var minggu = [];
        var senin = [];
        var selasa = [];
        var rabu = [];
        var kamis = [];
        var jumat = [];
        var sabtu = [];

        if ($('#hari input[type="checkbox"]#0').is(':checked')) {
            minggu = getDatesOf(startDate, endDate, 'Sun');
        }

        if ($('#hari input[type="checkbox"]#1').is(':checked')) {
            senin = getDatesOf(startDate, endDate, 'Mon');
        }

        if ($('#hari input[type="checkbox"]#2').is(':checked')) {
            selasa = getDatesOf(startDate, endDate, 'Tue');
        }

        if ($('#hari input[type="checkbox"]#3').is(':checked')) {
            rabu = getDatesOf(startDate, endDate, 'Wed');
        }

        if ($('#hari input[type="checkbox"]#4').is(':checked')) {
            kamis = getDatesOf(startDate, endDate, 'Thu');
        }

        if ($('#hari input[type="checkbox"]#5').is(':checked')) {
            jumat = getDatesOf(startDate, endDate, 'Fri');
        }

        if ($('#hari input[type="checkbox"]#6').is(':checked')) {
            sabtu = getDatesOf(startDate, endDate, 'Sat');
        }

        return minggu.concat(senin, selasa, rabu, kamis, jumat, sabtu).removeDuplicates();

    }
}

localStorage.setItem('jenisEdisi', 'DATES');
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var data = $(e.target).data('id');
    localStorage.setItem('jenisEdisi', data);
    $('#save-edisi-terbit').attr('data-save', data).text('SAVE BY '+data);
});

$(document).on('click', '#save-edisi-terbit', function () {
    var jenisEdisi = localStorage.getItem('jenisEdisi');
    if (jenisEdisi === 'DATES') {
        var tgl = getDatesByDates();
        $('input[name="totalPost"]').val(tgl.length);
    } else if (jenisEdisi === 'DAYS') {
        var tgl = getDatesByDays();
        $('input[name="totalPost"]').val(tgl.length);
    }
});

$(document).on('click', '#setEdisiTerbitButtonClose', function () {
    $('#edisiTerbitModal').modal('hide');
});

$(document).on('click', '#update-edisi-terbit', function () {
    var arrTgl = [];
    $.each(datesList.items, function (index, value) {
        arrTgl.push(moment(value._values.tgl, 'dddd, DD MMMM YYYY').format('YYYY-MM-DD'));
    });

    $('input[name="totalPost"]').val(arrTgl.removeDuplicates().length);
    // $('input[name="totalPost"]').val(arrTgl.length);
    $('#edisiTerbitModal').modal('hide');
});

$(document).on('click', 'button#clearText', function (e) {
    e.preventDefault();
    $(this).closest('.input-group').find('input[type="hidden"]').val('#');
    $(this).closest('.input-group').find('input[type="text"]').val('');
    $(this).hide();
});

$('#orderNumber').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#orderLetter').focus();
    }
});

$('#orderLetter').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#inputBookedAt').focus();
    }
});

$('#inputBookedAt').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#inputInvoicedAt').focus();
    }
});

$('[name="pemasang"]').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#pemasang button').focus();
    }
});

$('#pemasangModal').on('hide.bs.modal', function () {
    $('[name="klien"]').focus();
});

$('[name="klien"]').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#klien button').focus();
    }
});

$('#klienModal').on('hide.bs.modal', function () {
    $('#printAs').select2('open');
});

$('#printAs').on('select2:close', function () {
    $('#contractLetter').focus();
});

$('#contractLetter').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('[name="jenisIklan"]').focus();
    }
});

$('[name="jenisIklan"]').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#jenisIklan button').focus();
    }
});

$('#jenisIklanModal').on('hide.bs.modal', function () {
    $('[name="tipeIklan"]').focus();
});

$('[name="tipeIklan"]').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#tipeIklan button').focus();
    }
});

$('#tipeIklanModal').on('hide.bs.modal', function () {
    $('[name="pic"]').focus();
});

$('[name="pic"]').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#pic button').focus();
    }
});

$('#PICModal').on('hide.bs.modal', function () {
    $('[name="mediaIklan"]').focus();
});

$('[name="mediaIklan"]').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#mediaIklan button').focus();
    }
});

$('#mediaIklanModal').on('hide.bs.modal', function () {
    $('#categoryValue').focus();
});

$('#categoryValue').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#category button').focus();
    }
});

$('#categoryModal').on('hide.bs.modal', function () {
    $('#title').focus();
});

$('#title').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#columnSize').focus();
    }
});

$('#columnSize').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#milimeterSize').focus();
    }
});

$('#milimeterSize').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#edisiTerbitButton').focus();
        $('#setEdisiTerbitButton').focus();
    }
});

$('#edisiTerbitModal, #setEdisiTerbitModal').on('hide.bs.modal', function () {
    $('#totalPost').focus();
});

$('#totalPost').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#contractDuration').focus();
    }
});

$('#contractDuration').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#basePrice').focus();
    }
});

$('#basePrice').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#taxPercentage').focus();
    }
});

$('#taxPercentage').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#taxValue').focus();
    }
});

$('#taxValue').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#surchargePercentage').focus();
    }
});

$('#surchargePercentage').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#surchargeValue').focus();
    }
});

$('#surchargeValue').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#minDiscountPercentage').focus();
    }
});

$('#minDiscountPercentage').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#minDiscountValue').focus();
    }
});

$('#minDiscountValue').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#discountPercentage').focus();
    }
});

$('#discountPercentage').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#discountValue').focus();
    }
});

$('#discountValue').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#npbDiscountPercentage').focus();
    }focus
});

$('#npbDiscountPercentage').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#npbDiscountValue').focus();
    }
});

$('#npbDiscountValue').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#cashBackPercentage').focus();
    }
});

$('#cashBackPercentage').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#cashBackValue').focus();
    }
});

$('#cashBackValue').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#totalAmount').focus();
    }
});

$('#totalAmount').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#quantity').focus();
    }
});

$('#quantity').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#hitung').focus();
    }
});

$('#hitung').keydown(function (e) {
    $(this).click();
    if (e.which === 13) {
        e.preventDefault();
        $('#paymentMethod').select2('open');
    }
});

$('#paymentMethod').on('select2:close', function () {
    $('[name="sisipan"]').focus();
});

$('[name="sisipan"]').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#sisipan button').focus();
    }
});

$('#sisipanModal').on('hide.bs.modal', function () {
    $('#materialDescription').focus();
});

$('#materialDescription').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#orderDescription').focus();
    }
});

$('#orderDescription').keydown(function (e) {
    if (e.which === 13) {
        e.preventDefault();
        $('#printInvoiceAs').select2('open');
    }
});

$('#printInvoiceAs').on('select2:close', function () {
    $("#orderTag").select2('open');
});

$('#orderTag').on('select2:close', function () {
    $("#orderFrom").select2('open');
});

$('#orderTag').select2({
    tags: true,
    theme: 'bootstrap',
    tokenSeparators: [','],
    createTag: function (tag) {

        // Check if the option is already there
        var found = false;
        $("#orderTag option").each(function() {
            if ($.trim(tag.term).toUpperCase() === $.trim($(this).text()).toUpperCase()) {
                found = true;
            }
        });

        // Show the suggestion only if a match was not found
        if (!found) {
            return {
                id: tag.term,
                text: tag.term.toUpperCase(),
                isNew: true
            };
        }
    }
}).on("change", function(e) {
    var isNew = $(this).find('[data-select2-tag="true"]');
    if(isNew.length){
        isNew.replaceWith('<option value="'+e.timeStamp+'">'+isNew.val().toUpperCase()+'</option>');
        $.ajax({
            type: 'post',
            url: '/api',
            data: {
                module : 'advertising/tags',
                method: 'post',
                params: [
                    {
                        name: 'name',
                        value: isNew.val()
                    }
                ]
            },
            success: function (data) {
                var data = JSON.parse(data);
                $('option[value="'+e.timeStamp+'"]').attr('value', data.id).prop('selected', true);
            },
            error: function () {
                $('option[value="'+e.timeStamp+'"]').remove();
            }
        });
    }
});