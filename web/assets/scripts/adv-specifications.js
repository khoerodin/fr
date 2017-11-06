$(document).on('click', 'tbody[data-list="advertising/specifications"] .detail-adv', function () {
    var advSpecId = $(this).data('id');
    getAdvDetail(advSpecId);
    $('#detail-jenis tbody').html('')
    $('div#detail-jenis').modal({show: true, backdrop: 'static'});
    $('div#detail-jenis .button-detail-jenis-area a').attr('data-id', advSpecId);

    $('#detail-jenis select#search-spec-detail').select2({

        theme: "bootstrap",
        placeholder: "SEARCH NAME",
        allowClear: true,
        ajax: {
            url: "/api/search",
            dataType: 'json',
            type: 'POST',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term,
                    page: params.page,
                    module: 'advertising/specification-details',
                    method: 'get',
                    field: 'name'.split('#'),
                    params: {
                        'specification.id' : advSpecId
                    }
                };
            },
            processResults: function (data) {
                if(data.length > 0) {
                    return {
                        results: $.map(data, function(obj) {
                            return { id: obj.id, text: obj.name };
                        })
                    }
                } else {
                    var elms = $('.detail-jenis-search').removeClass('col-md-12').addClass('col-md-10');
                    elms += $('.button-detail-jenis-area').addClass('col-md-2');
                    elms += $('.button-detail-jenis-area a.add-btn').css('visibility', 'visible');

                    return {
                        results: elms
                    }
                }
            },
            cache: true,
        },
        escapeMarkup: function (markup) { return markup; },
        minimumInputLength: 2
    }).on("select2:select", function () {
        var specName = $('#detail-jenis select#search-spec-detail option:selected').text();
        getAdvDetail(advSpecId, specName);
    }).on("select2:open", function () {
        $('.detail-jenis-search').removeClass('col-md-10').addClass('col-md-12');
        $('.button-detail-jenis-area').removeClass('col-md-2');
        $('.button-detail-jenis-area a.add-btn').css('visibility', 'hidden');
    });

});

$(document).on('ajaxComplete', function () {
    $('#detail-jenis tbody .detail-btn').click(function () {
        $('div#form-detail').modal({show: true, backdrop: 'static'});

        var advDetailId = $(this).closest('tr').data('id');
        var name = $(this).closest('tr').find("td:eq(1)").text();
        $.ajax({
            url: '/api',
            data: {
                module: 'advertising/specification-details/'+advDetailId,
                method: 'get'
            },
            type: 'POST',
            success: function (successData) {
                $('#form-detail .modal-title').text('Edit Iklan '+name);
                $('#form-detail input#name').val(successData.name);
                $('#form-detail textarea#remark').val(successData.remark);
                $('#form-detail select#type').html('<option value="/api/advertising/types/'+successData.type.id+'">'+successData.type.name+'</option>');
                $('#form-detail input[name="id"]').val(successData.id);

                $('#form-detail select#type').select2({

                    theme: "bootstrap",
                    placeholder: "SEARCH TYPE",
                    allowClear: true,
                    ajax: {
                        url: "/api/search",
                        dataType: 'json',
                        type: 'POST',
                        delay: 250,
                        data: function (params) {
                            return {
                                q: params.term,
                                page: params.page,
                                module: 'advertising/types',
                                method: 'get',
                                field: 'name'.split('#')
                            };
                        },
                        processResults: function (data) {
                            if(data.length > 0) {
                                return {
                                    results: $.map(data, function(obj) {
                                        return { id: '/api/advertising/types/'+obj.id, text: obj.name };
                                    })
                                }
                            }
                        },
                        cache: true,
                    },
                    escapeMarkup: function (markup) { return markup; },
                    minimumInputLength: 2
                });

            }
        });
    });
});

$('#form-detail').on('show', function() {
    $('#detail-jenis').css('opacity', .5);
    $('#detail-jenis').unbind();
});
$('#form-detail').on('hidden', function() {
    $('#detail-jenis').css('opacity', 1);
    $('#detail-jenis').removeData("modal").modal({});
});

function getAdvDetail(advSpecId, specName) {
    $.ajax({
        data: {
            advSpecId: advSpecId,
            specName: specName
        },
        url: '/api/adv-spec-detail',
        type: 'POST',
        success: function (successData, textStatus, jqXHR) {
            var memberData = successData['hydra:member'];
            var tr = '';
            var no = 1;
            $.each(memberData, function (index, value) {
                tr += '<tr data-id="' + value.id + '">';
                tr += '<td>'+no+'</td>';
                tr += '<td>'+value.name+'</td>';
                tr += '<td>'+value.type.name+'</td>';
                tr += '<td>'+value.remark+'</td>';
                tr += '<td>';
                tr += '<span class="pull-right">';
                tr += '<button class="detail-btn btn btn-default btn-xs btn-flat" title="DETAIL"><i class="fa fa-eye"></i></button>';
                tr += '<button class="delete-btn btn btn-default btn-xs btn-flat" title="DELETE"><i class="fa fa-times"></i></button>';
                tr += '<button class="price btn btn-default btn-xs btn-flat" title="DETAIL HARGA IKLAN"><i class="fa fa-money"></i></button>';
                tr += '</span></td>';
                tr += '</td>';
                tr += '</tr>';
                no++;
            });
            $('#detail-jenis tbody').html(tr);
        },
        error: function () {

        }
    });
}

$(document).on('click', '.update-detail', function () {
    var id = $('#form-detail input[name="id"]').val();
    $.ajax({
        url: '/api',
        data: {
            module: 'advertising/specification-details/'+id,
            method: 'put',
            params: jQuery('#form-detail form').serializeArray()
        },
        type: 'POST',
        success: function (successData, textStatus, jqXHR) {
            var td1 = successData.name;
            var td2 = successData.type.name;
            var td3 = successData.remark;

            $('tr[data-id="'+id+'"]').find("td:eq(1)").text(td1);
            $('tr[data-id="'+id+'"]').find("td:eq(2)").text(td2);
            $('tr[data-id="'+id+'"]').find("td:eq(3)").text(td3);
            if (jqXHR.status === 200) {
                $('#form-detail').modal('hide');
                toastr.success(td1+' successfully updated');
            } else {
                toastr.error('Error when updating your data');
            }
        }
    });
});

$(document).on('keypress', '#form-detail form input', function (e) {
    if (e.which === 13) {
        $('#form-detail button.update-detail').click();
        return false;
    }
});

function del(module, id, tbodyId) {

    var data = {
        module : module+'/'+id,
        method: 'delete',
        params: {}
    };

    var elm = jQuery('#'+tbodyId+' tr[data-id="'+id+'"]');

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        success: function (data, textStatus, jqXHR) {
            elm.hide('slow', function(){ elm.remove(); });
            toastr.success('Data successfully deleted');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error when deleting your data');
            elm.removeClass('bg-red');
        }
    });

}

$(document).on('click', '#detail-jenis .delete-btn', function () {
    var module = 'advertising/specification-details';
    var id = $(this).closest('tr').data('id');
    var elm = jQuery('#detail-jenis tbody tr[data-id="'+id+'"]');
    elm.addClass('bg-red');
    setTimeout(function(){
        bootbox.confirm({
            message: "ARE YOU SURE YOU WANT TO DELETE THIS DATA?",
            animate: false,
            buttons: {
                confirm: {
                    className: 'btn-danger btn-flat'
                },
                cancel: {
                    className: 'btn-default btn-flat'
                }
            },
            callback: function (result) {
                if (result === false) {
                    elm.removeClass('bg-red');
                } else {
                    del(module, id, 'detail-jenis');
                }
            }
        });
    }, 20);
});

$(document).on('click', '.add-btn.add-adv-detail', function () {
    var advSpecId = $(this).data('id');
    $('div#form-add-detail').modal({show: true, backdrop: 'static'});
    $('div#form-add-detail .add-detail').attr('data-id', advSpecId);
    $('div#form-add-detail form input[name="specification"]').val('/api/advertising/specifications/'+advSpecId);

    $('#form-add-detail select#type').select2({

        theme: "bootstrap",
        placeholder: "SEARCH TYPE",
        allowClear: true,
        ajax: {
            url: "/api/search",
            dataType: 'json',
            type: 'POST',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term,
                    page: params.page,
                    module: 'advertising/types',
                    method: 'get',
                    field: 'name'.split('#')
                };
            },
            processResults: function (data) {
                if(data.length > 0) {
                    return {
                        results: $.map(data, function(obj) {
                            return { id: '/api/advertising/types/'+obj.id, text: obj.name };
                        })
                    }
                }
            },
            cache: true,
        },
        escapeMarkup: function (markup) { return markup; },
        minimumInputLength: 2
    });
});

$(document).on('click', '#form-add-detail .add-detail', function () {

    var load = '<tr><td colspan="7">LOADING...</td></tr>';
    var advSpecId = $(this).data('id');
    var data = {
        'module' : 'advertising/specification-details',
        'params' : jQuery('#form-add-detail form').serializeArray(),
        'method' : 'post'
    };
    $.ajax({
        url: '/api',
        type: 'POST',
        data: data,
        success: function (successData, textStatus, jqXHR) {
            getAdvDetail(advSpecId);
            $('#form-add-detail').modal('hide');
            toastr.success('Data saved successfully');
        },
        error: function () {
            toastr.error('Error when saving your data');
        }
    });
});

function getPriceList(id) {

    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/prices',
            method: 'get',
            params: [
                { 'specificationDetail.id': id }
            ]
        },
        success: function (data, textStatus, jqXHR) {
            var member = data['hydra:member'];
            var tr = '';
            var no = 1;
            $.each(member, function (index, value) {

                tr += '<tr data-id="'+value.id+'">';
                tr += '<td>'+no+'</td>';
                tr += '<td>'+value.specificationDetail.specification.name+'</td>';
                tr += '<td>'+value.specificationDetail.name+'</td>';
                tr += '<td>'+value.specificationDetail.type.name+'</td>';
                tr += '<td>'+value.year+'</td>';
                tr += '<td>'+value.price+'</td>';
                tr += '<td>'+((value.active === true) ? '<span class="text-success">Aktif</span>' : '<span class="text-danger">Tidak Aktif</span>')+'</td>';
                tr += '<td><span class="pull-right">' +
                    '<button class="detail-price btn btn-xs btn-default btn-flat"><i class="fa fa-eye"></i></button>' +
                    '<button class="delete-price btn btn-xs btn-default btn-flat"><i class="fa fa-times"></i></button>' +
                    '</span></td>';
                tr += '</tr>';
                no++;
            });
            $('#priceList tbody').html(tr);

            if (data['hydra:totalItems'] < 1) {
                $('#priceList tbody').html('<tr><td colspan="8">NO DATA AVAILABLE</td></tr>');
            }
        }
    });

    var load = '<tr><td colspan="7">LOADING...</td></tr>';
    $('#priceList tbody').html(load);
    $('#priceList').modal({show: true, backdrop: 'static'});
}

$(document).on('click', '.price', function () {

    var id = $(this).closest('tr').data('id');
    $('#add-harga.btn').attr('data-id', id);

    getPriceList(id)

});

$(document).on('click', '.detail-price', function () {

    var id = $(this).closest('tr').data('id');
    $('#detailHarga #year').val('');
    $('#detailHarga #price').val('');
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/prices/' + id,
            method: 'get'
        },
        success: function (data) {
            $('#detailHarga #year').val(data.year);
            $('#detailHarga #price').val(data.price);
            if(data.active === true) {
                $('#detailHarga #active').prop('checked', true);
            } else {
                $('#detailHarga #active').prop('checked', false);
            }

            $('#detailHarga #id').val(data.id);
        }
    });

    $('#detailHarga').modal({show: true, backdrop: 'static'});

});

$(document).on('click', '#detailHarga #updateHarga', function () {
    var id = $('#detailHarga #id').val();
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/prices/' + id,
            method: 'put',
            params: $('#detailHarga form').serializeArray()
        },
        success: function (data, textStatus, jqXHR) {
            var td4 = data.year;
            var td5 = data.price;
            var td6 = ((data.active === true) ? '<span class="text-success">Aktif</span>' : '<span class="text-danger">Tidak Aktif</span>');

            $('#priceList tr[data-id="'+id+'"]').find("td:eq(4)").text(td4);
            $('#priceList tr[data-id="'+id+'"]').find("td:eq(5)").text(td5);
            $('#priceList tr').find("td:eq(6)").html('<span class="text-danger">Tidak Aktif</span>');
            $('#priceList tr[data-id="'+id+'"]').find("td:eq(6)").html(td6);

            if (jqXHR.status === 200) {
                $('#detailHarga').modal('hide');
                toastr.success('Data berhasil diperbaharui');
            } else {
                toastr.error('Error memperbarui data Anda');
            }
        }
    });
});

$(document).on('click', '.delete-price', function () {
    var module = 'advertising/prices';
    var id = $(this).closest('tr').data('id');
    var elm = jQuery('#priceList tbody tr[data-id="'+id+'"]');
    elm.addClass('bg-red');
    setTimeout(function(){
        bootbox.confirm({
            message: "ARE YOU SURE YOU WANT TO DELETE THIS DATA?",
            animate: false,
            buttons: {
                confirm: {
                    className: 'btn-danger btn-flat'
                },
                cancel: {
                    className: 'btn-default btn-flat'
                }
            },
            callback: function (result) {
                if (result === false) {
                    elm.removeClass('bg-red');
                } else {
                    del(module, id, 'priceListBody');
                }
            }
        });
    }, 20);
});

$(document).on('click', '#add-harga', function () {
    var spcId = $(this).data('id');
    $('#addHarga form [name="specificationDetail"]').val('/api/advertising/specification-details/'+spcId);
    $('#addHarga').modal({show: true, backdrop: 'static'});
});

$(document).on('click', '#addHarga #saveHarga', function () {

    $('#saveHarga').text('SAVE').prop('disabled', true);
    $('div .has-error').removeClass('has-error');
    $('p.help-block').remove();

    $.ajax({
        type: 'post',
        url: '/api',
        data: {
            module: 'advertising/prices',
            method: 'post',
            params: $('#addHarga form').serializeArray()
        },
        success: function (data, textStatus, jqXHR) {
            var arr = data;
            if ("violations" in arr) {

                $.each(arr, function (index, value) {
                    if(index === 'violations'){
                        $.each(value, function (idx, val) {
                            $('#addHarga form #'+val.propertyPath).parent('div').addClass('has-error');
                            $( '<p class="help-block">'+val.message+'</p>' ).insertAfter( '#addHarga form #'+val.propertyPath );
                        });
                    }
                });

                toastr.error('Error when saving your data');

            } else if('id' in arr) {
                $('#addHarga').modal('hide');
                toastr.success('Data successfully added');
            } else {
                toastr.error('Error when saving your data');
            }
            var id = $('#add-harga.btn').attr('data-id');
            getPriceList(id);
            $('#saveHarga').text('SAVE').prop('disabled', false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error when saving your data');
            $('#saveHarga').text('SAVE').prop('disabled', false);
        }
    });

});