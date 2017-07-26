$("#orderFrom, #cetakDiFaktur, #paymentMethod").select2({
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

        getJumlahBayar();
        getNetto();
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

// $(document).on('keyup', '#serachEmiten', function () {
//     searchEmiten();
//     if($('#emitenData').children(':visible').length == 0) {
//         $('#emitenData').append('<tr id="warn-nodata"><td class="text-danger">TIDAK ADA DATA</td></tr>');
//     }
// });

function searchEmiten() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("serachEmiten");
    filter = input.value.toUpperCase();
    table = document.getElementById("emitenData");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            $('#warn-nodata').remove();
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

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

$(document).on('keyupup', '#sektorModal #serachList', function () {
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
    var kolom = $('#columnSize').val();
    var mmBaris = $('#milimeterSize').val();
    var terbit = $('#totalPost').val();
    var tarif = $('#basePrice').val();

    if ($('#columnSize').val() && $('#milimeterSize').val() && $('#totalPost').val() && $('#basePrice').val() ) {
        if (
            $('input[name="jenisIklan"]').val().toLowerCase() === 'kuping' ||
            $('input[name="jenisIklan"]').val().toLowerCase() === 'banner' ||
            $('input[name="jenisIklan"]').val().toLowerCase() === 'stapel' ||
            $('input[name="jenisIklan"]').val().toLowerCase() === 'eksposisi' ||
            $('input[name="jenisIklan"]').val().toLowerCase() === 'tarif khusus' ||
            $('input[name="jenisIklan"]').val().toLowerCase().startsWith('paket')
        ) {
            return tarif;
        } else {
            return (kolom * mmBaris) * terbit * tarif;
        }
    }
}

function getJumlahBayar() {
    if($('#discountValue').val() && $('#taxValue').val() && $('#cashBackValue').val()) {
        var diskon = $('#discountValue').val();
        var ppn = $('#taxValue').val();
        var cashBack = $('#cashBackValue').val();

        jumlahBayar = getBiaya() - diskon - ppn - cashBack;
        $('#totalAmount').val(jumlahBayar);

        return jumlahBayar;
    }
}

function getNetto() {
    if($('#quantity').val()) {
        var quantity = $('#quantity').val();
        var netto;

        if ($('#material').val()) {
            var materai = $('#material').val();
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
    'keyup keydown change mouseup',
    '#columnSize, #milimeterSize, #totalPost, ' +
    '#basePrice, #discountValue, #discountPercentage, ' +
    '#taxValue, #taxPercentage, #quantity, #material, ' +
    '#cashBackValue, #cashBackPercentage',
    function () {
    getJumlahBayar();
    getNetto();
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
    }
    document.getElementById(output).innerHTML=kalimat+' Rupiah';
}

$(document).on('keyup keydown change mouseup', '#discountValue', function () {
    var tarifIklan = $('#basePrice').val();
    var diskonRp = $(this).val();

    var diskonPersen = ( diskonRp / tarifIklan ) * 100;
    $('#discountPercentage').val(diskonPersen);
});

$(document).on('keyup keydown change mouseup', '#discountPercentage', function () {
    var tarifIklan = $('#basePrice').val();
    var diskonPersen = $(this).val();

    var diskonRp = (tarifIklan * diskonPersen) / 100;
    $('#discountValue').val(diskonRp);
});

$(document).on('keyup keydown change mouseup', '#taxValue', function () {
    var tarifIklan = $('#basePrice').val();
    var ppnRp = $(this).val();

    var ppnPersen = ( ppnRp / tarifIklan ) * 100;
    $('#taxPercentage').val(ppnPersen);
});

$(document).on('keyup keydown change mouseup', '#taxPercentage', function () {
    var tarifIklan = $('#basePrice').val();
    var ppnPersen = $(this).val();

    var taxValue = (tarifIklan * ppnPersen) / 100;
    $('#taxValue').val(taxValue);
});

$(document).on('keyup keydown change mouseup', '#cashBackValue', function () {
    var tarifIklan = $('#basePrice').val();
    var cashBackRp = $(this).val();

    var cashBackPersen = ( cashBackRp / tarifIklan ) * 100;
    $('#cashBackPercentage').val(cashBackPersen);
});

$(document).on('keyup keydown change mouseup', '#cashBackPercentage', function () {
    var tarifIklan = $('#basePrice').val();
    var cashBackPersen = $(this).val();

    var cashBackRp = (tarifIklan * cashBackPersen) / 100;
    $('#cashBackValue').val(cashBackRp);
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

$(document).on('click', '#edisiTerbitButton', function (e) {
    e.preventDefault();
    $('#edisiTerbitModal').modal({show: true, backdrop: 'static'});

    $('#edisiTanggal').datepicker({
        todayBtn: "linked",
        format: "dd/mm/yyyy",
        clearBtn: true,
        language: "id",
        multidate: true,
        multidateSeparator: ", "
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


function getDates(start, end, dayNum) {
    var start = start,
        end   = end,
        day   = dayNum;

    var result = [];
    var current = start.clone();

    while (current.day(7 + day).isBefore(end)) {
        result.push(current.clone());
    }

    return result.map(m => m.format());
}
$(document).on('click', '#hore', function () {
    if ($('#startDate').val() && $('#endDate').val()) {
        var startDate = moment($('#startDate').val(), 'DD/MM/YYYY');
        var endDate = moment($('#endDate').val(), 'DD/MM/YYYY');

        var minggu = [];
        var senin = [];
        var selasa = [];
        var rabu = [];
        var kamis = [];
        var jumat = [];
        var sabtu = [];

        if ($('input[type="checkbox"]#0').is(':checked')) {
            minggu = getDates(startDate, endDate, 0);
        }

        if ($('input[type="checkbox"]#1').is(':checked')) {
            senin = getDates(startDate, endDate, 1);
        }

        if ($('input[type="checkbox"]#2').is(':checked')) {
            selasa = getDates(startDate, endDate, 2);
        }

        if ($('input[type="checkbox"]#3').is(':checked')) {
            rabu = getDates(startDate, endDate, 3);
        }

        if ($('input[type="checkbox"]#4').is(':checked')) {
            kamis = getDates(startDate, endDate, 4);
        }

        if ($('input[type="checkbox"]#5').is(':checked')) {
            jumat = getDates(startDate, endDate, 5);
        }

        if ($('input[type="checkbox"]#6').is(':checked')) {
            sabtu = getDates(startDate, endDate, 6);
        }

        console.log(minggu.concat(senin, selasa, rabu, kamis, jumat, sabtu));
    }
});