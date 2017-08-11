$("#orderFrom, #printAs, #paymentMethod").select2({
    theme: 'bootstrap'
});

$(document).on('click', '#pemasang button', function () {
   getCustomers(null, 'pemasangModal');
   $('#pemasangModal').modal({show: true, backdrop: 'static'});
   $('#pemasangModal input#serachList').focus();
});

$(document).on('keyup', '#pemasangModal #serachList', function () {
    var params = $(this).val();
    getCustomers(params, 'pemasangModal');
});

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

$(document).on('click', '#klien button', function () {
    getCustomers(null, 'klienModal');
    $('#klienModal').modal({show: true, backdrop: 'static'});
    $('#klienModal input#serachList').focus();
});

$(document).on('keyup', '#klienModal #serachList', function () {
    var params = $(this).val();
    getCustomers(params, 'klienModal');
});

$(document).ajaxComplete(function() {
    $(document).on('dblclick', '#pemasangModalData tr', function () {
        var customerId = $(this).data('id');
        $('#customer').val('/api/advertising/customers/'+customerId);
        $('input[name="pemasang"]').val($(this).find('td:eq(1)').text());
        $('#pemasangModal').modal('hide');
        $('#customerAddress').val($(this).data('address'));
    });

    $(document).on('dblclick', '#klienModalData tr', function () {
        var klienId = $(this).data('id');
        $('#client').val('/api/advertising/customers/'+klienId);
        $('input[name="klien"]').val($(this).find('td:eq(1)').text()+' - '+$(this).find('td:eq(2)').text());
        $('#klienModal').modal('hide');
    });
});

// Jenis Iklan
$(document).on('click', '#jenisIklan button', function () {
    getSpecifications();
    $('#jenisIklanModal').modal({show: true, backdrop: 'static'});
    $('#jenisIklanModal input#serachList').focus();
});

$(document).on('keyup', '#jenisIklanModal #serachList', function () {
    var params = $(this).val();
    getSpecifications(params);
});

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

$(document).ajaxComplete(function() {
    $(document).on('dblclick', '#jenisIklanModalData tr', function () {
        var specificationId = $(this).data('id');
        $('#specification').val('/api/advertising/specifications/'+specificationId);
        $('input[name="jenisIklan"]').val($(this).find('td:eq(0)').text());
        $('#jenisIklanModal').modal('hide');

        // ubah netto
        $('#netto').text(accounting.formatMoney(0, "Rp ", 2, ".", ","));
        $('#nettoRp').val(0);
        $('#btn-order').prop('disabled', true);
        $('#btn-order-update').prop('disabled', true);
    });
});
// end Jenis Iklan

// Tipe Iklan
$(document).on('click', '#tipeIklan button', function () {
    getTypes();
    $('#tipeIklanModal').modal({show: true, backdrop: 'static'});
    $('#tipeIklanModal input#serachList').focus();
});

$(document).on('keyup', '#tipeIklanModal #serachList', function () {
    var params = $(this).val();
    getTypes(params);
});

function getTypes(params) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/types',
            method: 'get',
            params: [
                {
                    name: params
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data)['hydra:member'];

            tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Tipe Iklan</th></tr></thead>';
            tableData += '<tbody id="tipeIklanModalData">';

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

$(document).ajaxComplete(function() {
    $(document).on('dblclick', '#tipeIklanModalData tr', function () {
        var typesId = $(this).data('id');
        $('#type').val('/api/advertising/types/'+typesId);
        $('input[name="tipeIklan"]').val($(this).find('td:eq(0)').text());
        $('#tipeIklanModal').modal('hide');
    });
});
// end Tipe Iklan

// Media Iklan
$(document).on('click', '#mediaIklan button', function () {
    getMedia();
    $('#mediaIklanModal').modal({show: true, backdrop: 'static'});
    $('#mediaIklanModal input#serachList').focus();
});

$(document).on('keyup', '#mediaIklanModal #serachList', function () {
    var params = $(this).val();
    getMedia(params);
});

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

$(document).ajaxComplete(function() {
    $(document).on('dblclick', '#mediaIklanModalData tr', function () {
        var mediaId = $(this).data('id');
        $('#media').val('/api/advertising/media/'+mediaId);
        $('input[name="mediaIklan"]').val($(this).find('td:eq(0)').text());
        $('#mediaIklanModal').modal('hide');
    });
});
// end Media Iklan

// Emiten
$(document).on('click', '#emiten button', function () {
    getEmiten();
    $('#emitenModal').modal({show: true, backdrop: 'static'});
    $('#emitenModal input#serachList').focus();
});

function getEmiten() {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/categories/root',
            method: 'get'
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data)['hydra:member'];
            localStorage.setItem("emitenList", JSON.stringify(memberData));

            tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th class="sort" data-sort="name" style="cursor: pointer;">Emiten</th></tr></thead>';
            tableData += '<tbody id="emitenData" class="list">';

            $.each(memberData, function (index, value) {
                tableData += '<tr style="cursor: pointer" data-id="'+value.id+'">';
                tableData += '<td class="name">'+value.name+'</td>';
                tableData += '</tr>';
            });

            tableData += '</tbody>';
            tableData += '<table>';
            tableData += '<ul class="pagination pagination-sm"></ul>';

            if (memberData.length > 0) {
                tableData = tableData;
            } else {
                tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Emiten</th></tr></thead>';
                tableData += '<tbody>';
                tableData += '<tr><td colspan="1" class="text-danger">TIDAK ADA DATA</td></tr>';
                tableData += '</tbody>';
                tableData += '<tbody>';
            }
            $('#emitenModal .modal-body #data-list').html(tableData);

            var emitenTableOptions = {
                valueNames: [ 'name' ],
                page: 11,
                pagination: true
            };

            var emitenList = new List('emitenModal', emitenTableOptions);
            emitenList.on('updated', function(list) {
                if (list.matchingItems.length < 1) {
                    $('#emitenData').html('<tr class="no-result"><td class="text-danger">TIDAK ADA DATA</td></tr>');
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

$(document).ajaxComplete(function() {
    $(document).on('dblclick', '#emitenData tr', function () {

        var emitenId = $(this).data('id');
        $('#category1').val(emitenId);
        $('input[name="emiten"]').val($(this).find('td:eq(0)').text());
        $('#emitenModal').modal('hide');

        $('#category2').val('');
        $('input[name="sektor"]').val('');

        $('#category').val('');
        $('input[name="sub-sektor"]').val('');
    });
});
// end Emiten

// Sektor
$(document).on('click', '#sektor button', function () {
    if( $('#category1').val() ) {
        var parentId = $('#category1').val();
        getSektor(null, parentId);
        $('#sektorModal').modal({show: true, backdrop: 'static'});
        $('#sektorModal input#serachList').focus();
    } else {
        bootbox.alert({
            message: "Silakan pilih Emiten terlebih dahulu",
            buttons: {
                ok: {
                    label: 'OK',
                    className: 'btn-flat btn-danger'
                }
            },
            animate: false
        });
    }
});

$(document).on('keyup', '#sektorModal #serachList', function () {
    var params = $(this).val();
    var parentId = $('#category1').val();
    getSektor(params, parentId);
});

function getSektor(params, parentId) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/categories',
            method: 'get',
            params: [
                {
                    name: params,
                    'parent.id': parentId
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data)['hydra:member'];

            tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Sektor</th></tr></thead>';
            tableData += '<tbody id="sektorModalData">';

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
                tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Sektor</th></tr></thead>';
                tableData += '<tbody>';
                tableData += '<tr><td colspan="1" class="text-danger">TIDAK ADA DATA</td></tr>';
                tableData += '</tbody>';
                tableData += '<tbody>';
            }
            $('#sektorModal .modal-body #data-list').html(tableData);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

$(document).ajaxComplete(function() {
    $(document).on('dblclick', '#sektorModalData tr', function () {
        var sektorId = $(this).data('id');
        $('#category2').val(sektorId);
        $('input[name="sektor"]').val($(this).find('td:eq(0)').text());
        $('#sektorModal').modal('hide');

        $('#category').val('');
        $('input[name="sub-sektor"]').val('');
    });
});
// end Sektor

// Sub-Sektor
$(document).on('click', '#sub-sektor button', function () {
    if( $('#category2').val() ) {
        var parentId = $('#category2').val();
        getSubSektor(null, parentId);
        $('#subSektorModal').modal({show: true, backdrop: 'static'});
        $('#subSektorModal input#serachList').focus();
    } else {
        bootbox.alert({
            message: "Silakan pilih Sektor terlebih dahulu",
            buttons: {
                ok: {
                    label: 'OK',
                    className: 'btn-flat btn-danger'
                }
            },
            animate: false
        });
    }
});

$(document).on('keyup', '#subSektorModal #serachList', function () {
    var params = $(this).val();
    var parentId = $('#category2').val();
    getSubSektor(params, parentId);
});

function getSubSektor(params, parentId) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/categories',
            method: 'get',
            params: [
                {
                    name: params,
                    'parent.id': parentId
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data)['hydra:member'];

            tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Sub Sektor</th></tr></thead>';
            tableData += '<tbody id="subSektorModalData">';

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
                tableData  = '<table class="table table-bordered table-responsive table-hover"><thead><tr><th>Sub Sektor</th></tr></thead>';
                tableData += '<tbody>';
                tableData += '<tr><td colspan="1" class="text-danger">TIDAK ADA DATA</td></tr>';
                tableData += '</tbody>';
                tableData += '<tbody>';
            }
            $('#subSektorModal .modal-body #data-list').html(tableData);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

$(document).ajaxComplete(function() {
    $(document).on('dblclick', '#subSektorModalData tr', function () {
        var sektorId = $(this).data('id');
        $('#category').val('/api/advertising/categories/'+sektorId);
        $('input[name="sub-sektor"]').val($(this).find('td:eq(0)').text());
        $('#subSektorModal').modal('hide');
    });
});
// end Sektor

// PIC / accountExecutive
$(document).on('click', '#pic button', function () {
    getPIC();
    $('#PICModal').modal({show: true, backdrop: 'static'});
    $('#PICModal input#serachList').focus();
});

$(document).on('keyup', '#PICModal #serachList', function () {
    var params = $(this).val();
    getPIC(params);
});

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

$(document).ajaxComplete(function() {
    $(document).on('dblclick', '#PICModalData tr', function () {
        var accountExecutiveId = $(this).data('id');
        $('#accountExecutive').val('/api/advertising/account-executives/'+accountExecutiveId);
        $('input[name="pic"]').val($(this).find('td:eq(1)').text());
        $('#PICModal').modal('hide');
    });
});
// end PIC / accountExecutive

// Sisipan
$(document).on('click', '#sisipan button', function () {
    getSisipan();
    $('#sisipanModal').modal({show: true, backdrop: 'static'});
    $('#sisipanModal input#serachList').focus();
});

$(document).on('keyup', '#sisipanModal #serachList', function () {
    var params = $(this).val();
    getSisipan(params);
});

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

$(document).ajaxComplete(function() {
    $(document).on('dblclick', '#sisipanModalData tr', function () {
        var cityId = $(this).data('id');
        $('#sirculationArea').val('/api/cities/'+cityId);
        $('input[name="sisipan"]').val($(this).find('td:eq(0)').text());
        $('#sisipanModal').modal('hide');
    });
});
// end Sisipan

function getBiaya() {
    var kolom = parseInt($('#columnSize').val());
    var mmBaris = parseInt($('#milimeterSize').val());
    var terbit = parseInt($('#totalPost').val());
    var tarif = parseInt($('#basePrice').val());
    var final;

    if ($('#columnSize').val() && $('#milimeterSize').val() && $('#totalPost').val() && $('#basePrice').val() ) {
        if (
            $('input[name="jenisIklan"]').val().toLowerCase() === 'kuping' ||
            $('input[name="jenisIklan"]').val().toLowerCase() === 'banner' ||
            $('input[name="jenisIklan"]').val().toLowerCase() === 'stapel' ||
            $('input[name="jenisIklan"]').val().toLowerCase() === 'eksposisi' ||
            $('input[name="jenisIklan"]').val().toLowerCase() === 'tarif khusus' ||
            $('input[name="jenisIklan"]').val().toLowerCase().startsWith('paket')
        ) {
            final = parseInt(tarif);
            return final;
        } else {
            final = parseInt((kolom * mmBaris) * terbit * tarif);
            return final;
        }
    }
}

function getDiscountValue() {
    var ppnRp = parseInt($('#taxValue').val());
    var biaya = getBiaya() + ppnRp;
    var diskonRp = parseInt($('#discountValue').val());

    var diskonPersen = ( diskonRp / biaya ) * 100;
    $('#discountPercentage').val(diskonPersen);
}

function getDiscountPercentage() {
    var ppnRp = parseInt($('#taxValue').val());
    var biaya = getBiaya() + ppnRp;
    var diskonPersen = parseInt($('#discountPercentage').val());
    var diskonRp = (biaya * diskonPersen) / 100;
    $('#discountValue').val(diskonRp);
}
$(document).on('keyup keydown change mouseup', '#discountValue', function () {
    getDiscountValue();
    getJumlahBayar();
});

$(document).on('keyup keydown change mouseup', '#discountPercentage', function () {
    getDiscountPercentage();
    getJumlahBayar();
});

function getTaxValue(){
    var ppnRp = $('#taxValue').val();

    var ppnPersen = ( parseInt(ppnRp) / getBiaya() ) * 100;
    $('#taxPercentage').val(ppnPersen);
}

function getTaxPercentage() {
    var ppnPersen = parseInt($('#taxPercentage').val());

    var taxValue = (getBiaya() * ppnPersen) / 100;
    $('#taxValue').val(taxValue);
}

$(document).on('keyup keydown change mouseup', '#taxValue', function () {
    getTaxValue();
    getJumlahBayar();
});

$(document).on('keyup keydown change mouseup', '#taxPercentage', function () {
    getTaxPercentage();
    getJumlahBayar();
});

function getCashBackValue() {
    var diskon = parseInt($('#discountValue').val());
    var ppn = parseInt($('#taxValue').val());
    var biaya = getBiaya() - diskon + ppn;
    var cashBackRp = parseInt($('#cashBackValue').val());

    var cashBackPersen = ( cashBackRp / biaya ) * 100;
    $('#cashBackPercentage').val(cashBackPersen);
}

function getCashBackPercentage() {
    var diskon = parseInt($('#discountValue').val());
    var ppn = parseInt($('#taxValue').val());
    var biaya = getBiaya() - diskon + ppn;
    var cashBackPersen = parseInt($('#cashBackPercentage').val());

    var cashBackRp = (biaya * cashBackPersen) / 100;
    $('#cashBackValue').val(cashBackRp);
}

$(document).on('keyup keydown change mouseup', '#cashBackValue', function () {
    getCashBackValue();
    getJumlahBayar();
});

$(document).on('keyup keydown change mouseup', '#cashBackPercentage', function () {
    getCashBackPercentage();
    getJumlahBayar();
});

function getJumlahBayar() {
    if($('#discountValue').val() && $('#taxValue').val() && $('#cashBackValue').val()) {

        var diskon = parseInt($('#discountValue').val());
        var ppn = parseInt($('#taxValue').val());
        var cashBack = parseInt($('#cashBackValue').val());

        jumlahBayar = parseInt(getBiaya() - diskon + ppn - cashBack);
        $('#totalAmount').val(jumlahBayar);

        return jumlahBayar;
    }
}

function getNetto() {
    if($('#quantity').val()) {
        var quantity = parseInt($('#quantity').val());
        var netto;

        if ($('#material').val()) {
            var materai = parseInt($('#material').val());
            netto = (getJumlahBayar() * quantity) - materai;
        } else {
            netto = getJumlahBayar() * quantity;
        }

        $('#netto').text(accounting.formatMoney(netto, "Rp ", 2, ".", ","));
        $('#nettoRp').val(netto);

        terbilang('nettoRp', 'terbilangNetto');
    }
}

$(document).on(
    'click', '#hitung',
    function (e) {
        e.preventDefault();
        getTaxPercentage();
        getDiscountPercentage();
        getCashBackPercentage();
        getNetto();
        $('#btn-order').prop('disabled', false);
        $('#btn-order-update').prop('disabled', false);
});

$(document).on(
    'keyup keydown change mouseup',
    '#columnSize, #milimeterSize, #totalPost, ' +
    '#basePrice, #discountValue, #discountPercentage, ' +
    '#taxValue, #taxPercentage, #quantity, #material, ' +
    '#cashBackValue, #cashBackPercentage, ' +
    'input[name="jenisIklan"], #specification',
    function () {
        $('#netto').text(accounting.formatMoney(0, "Rp ", 2, ".", ","));
        $('#nettoRp').val(0);
        $('#btn-order').prop('disabled', true);
        $('#btn-order-update').prop('disabled', true);
    });

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
                                tr += '<td>'+no+'</td>';
                                tr += '<td><span class="tgl">'+moment(value.publishDate).format("dddd, DD MMMM YYYY")+'</span>';
                                tr += '<input id="'+value.id+'" value="'+moment(value.publishDate).format("dddd, DD MMMM YYYY")+'" style="width: 50%;" type="hidden" class="form-control input-sm"></td>';
                                tr += '<td class="edit"><button class="btn btn-xs btn-flat btn-primary edit-item-btn">Edit</button></td>';
                                tr += '<td class="remove"><button class="btn btn-xs btn-flat btn-danger remove-item-btn">Remove</button></td>';
                                tr += '</tr>';
                                dateList += '<input type="hidden" class="ready" id="'+value.id+'" value="'+value.publishDate+'">';
                                no++;
                            });

                            $('#edisiTerbitModal tbody').html(tr);
                            $('#edisiTerbitModal #hiddenDates').html(dateList);

                            var datesList = new List('DatesList', {
                                valueNames: [ 'id', 'tgl'],
                                page: 7,
                                pagination: true
                            });

                            var pageBtn = $('#edisiTerbitModal .pagination li');

                            $(document).on('click', '.edit-item-btn', function () {
                                var id = $(this).closest('tr').find('.id').text();
                                var input = $(this).closest('tr').find('input#'+id);

                                $(this).text('SAVE')
                                    .removeClass('edit-item-btn')
                                    .addClass('save-item-btn')
                                    .removeClass('btn-primary')
                                    .addClass('btn-warning');

                                input.datetimepicker({
                                    locale: 'id',
                                    format: "dddd, DD MMMM YYYY"
                                });

                                input.attr('type', 'text');
                                $(this).closest('tr').find('span.tgl').hide();
                            });

                            $(document).on('click', '.save-item-btn', function () {
                                var id = $(this).closest('tr').find('.id').text();
                                var item = datesList.get('id', id)[0];
                                var input = $(this).closest('tr').find('input#'+id);

                                item.values({
                                    id: id,
                                    tgl: input.val()
                                });

                                var tglReady = moment(input.val(), 'dddd, DD MMMM YYYY').format();
                                $('input.ready#'+id).val(tglReady);

                                console.info(tglReady);

                                $(this).text('EDIT')
                                    .removeClass('save-item-btn')
                                    .addClass('edit-item-btn')
                                    .removeClass('btn-warning')
                                    .addClass('btn-primary');
                                input.attr('type', 'hidden');
                                $(this).closest('tr').find('span.tgl').show();
                            });

                            pageBtn.click(function () {

                                $(document).on('click', '.edit-item-btn', function () {
                                    $(this).text('SAVE')
                                        .removeClass('edit-item-btn')
                                        .addClass('save-item-btn');
                                    var id = $(this).closest('tr').attr('id');
                                    $(this).closest('tr').find('input#'+id).attr('type', 'text');
                                    $(this).closest('tr').find('span.tgl').hide();
                                });

                                $(document).on('click', '.save-item-btn', function () {
                                    var id = $(this).closest('tr').attr('id');
                                    var item = datesList.get('id', id)[0];
                                    var input = $(this).closest('tr').find('input#'+id);

                                    item.values({
                                        id: id,
                                        tgl: input.val()
                                    });

                                    $(this).text('EDIT')
                                        .removeClass('save-item-btn')
                                        .addClass('edit-item-btn');
                                    input.attr('type', 'hidden');
                                    $(this).closest('tr').find('span.tgl').show();
                                });

                            });

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
                        window.location.href = '/advertising/orders';
                    }
                });
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
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
                            window.location.href = '/advertising/orders';
                        }
                    });
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
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