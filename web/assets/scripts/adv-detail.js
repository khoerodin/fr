$(document).on('click', 'tbody[data-list="advertising/specifications"] .detail-adv', function () {
    var advSpecId = $(this).data('id');
    getAdvDetail(advSpecId);
    $('#detail-jenis tbody').html('')
    $('div#detail-jenis').modal({show: true, backdrop: 'static'});
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
                var successData = JSON.parse(successData);
                $('#form-detail .modal-title').text('Edit Iklan '+name);
                $('#form-detail input#name').val(successData.name);
                $('#form-detail textarea#remark').val(successData.remark);
                $('#form-detail select#type').html('<option value="/api/advertising/types/'+successData.type.id+'">'+successData.type.name+'</option>');
                $('#form-detail input[name="id"]').val(successData.id);

                jQuery('#form-detail select#type').select2({

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

function getAdvDetail(advSpecId) {
    $.ajax({
        data: {
            advSpecId: advSpecId,
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
            successData = JSON.parse(successData);
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
                toastr.erroe('Error when updating your data');
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

function del(module, id, formId) {

    var data = {
        module : module+'/'+id,
        method: 'delete',
        params: {}
    };

    var elm = jQuery('#'+formId+' tr[data-id="'+id+'"]');

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
    console.log(elm);
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