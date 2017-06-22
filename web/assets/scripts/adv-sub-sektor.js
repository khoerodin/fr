getSelectEmiten();
function getSelectEmiten() {
    var data = {
        module : 'advertising/categories/root',
        method: 'get'
    };

    $.ajax({
        url: '/api',
        type: 'POST',
        data: data,
        success: function (successData, textStatus, jqXHR) {
            successData = JSON.parse(successData);
            var memberData = successData['hydra:member'];
            var select = '<option selected>PILIH EMITEN</option>';
            $.each(memberData, function (index, value) {
                select += '<option value="'+value.id+'">'+value.name+'</option>';
            });
            $('select#select-emiten').html(select);
        }
    });
}

$(document).on('change', 'select#select-emiten', function () {
    var emitenId = $(this).val();
    $('select#select-sektor').prop('disabled', false);
    $('#sub-sektor-body').html('<tr><td colspan="3">SILAKAN PILIH SEKTOR</td></tr>');
    $('.button-adv-sub-sektor a').css('visibility', 'hidden');
    getSelectSektor(emitenId);
});

function getSelectSektor(emitenId) {
    var data = {
        module : 'advertising/categories',
        method: 'get',
        params: [
            {
                'parent.id': emitenId
            }
        ]
    };

    $.ajax({
        url: '/api',
        type: 'POST',
        data: data,
        success: function (successData, textStatus, jqXHR) {
            successData = JSON.parse(successData);
            var memberData = successData['hydra:member'];
            var select = '<option selected>PILIH SEKTOR</option>';
            $.each(memberData, function (index, value) {
                select += '<option value="'+value.id+'">'+value.name+'</option>';
            });
            $('select#select-sektor').html(select);
        }
    });
}

$(document).on('change', 'select#select-sektor', function () {
    var sektorId = $('select#select-sektor').val();
    $('.button-adv-sub-sektor a').css('visibility', 'visible');
    getSubSektorData(sektorId);
});

function getSubSektorData(sektorId){
    var data = {
        module : 'advertising/categories',
        method: 'get',
        params: [
            {
                'parent.id': sektorId
            }
        ]
    };

    $.ajax({
        url: '/api',
        type: 'POST',
        data: data,
        success: function (successData, textStatus, jqXHR) {
            successData = JSON.parse(successData);
            var memberData = successData['hydra:member'];
            var tr = '';
            var no = 1;
            $.each(memberData, function (index, value) {
                tr += '<tr data-id="'+value.id+'">';
                tr += '<td>'+no+'</td>';
                tr += '<td>'+value.name+'</td>';
                tr += '<td><span class="pull-right">';
                tr += '<button class="detail-btn btn btn-default btn-xs btn-flat" title="DETAIL"><i class="fa fa-eye"></i></button>';
                tr += '<button class="delete-btn btn btn-default btn-xs btn-flat" title="DELETE"><i class="fa fa-times"></i></button>';
                tr += '</span></td>';
                tr += '</tr>';
                no++;
            });

            if (successData['hydra:totalItems'] < 1) {
                $('#sub-sektor-body').html('<tr><td colspan="3">TIDAK ADA SUB SEKTOR</td></tr>');
            } else {
                $('#sub-sektor-body').html(tr);
            }
        }
    });
}

$(document).on('click', '#sub-sektor-body .detail-btn', function () {
    var id = $(this).closest('tr').data('id');
    var sektor = $(this).closest('tr').find("td:eq(1)").text();
    $('#detail-sub-sektor.modal').modal({show: true, backdrop: 'static'});
    $('#detail-sub-sektor.modal form input[name="name"]').val(sektor);
    $('#detail-sub-sektor.modal form input[name="id"]').val(id);
});

$(document).on('click', '#detail-sub-sektor .edit', function () {
    var id = $('#detail-sub-sektor form input[name="id"]').val();
    $.ajax({
        url: '/api',
        data: {
            module: 'advertising/categories/'+id,
            method: 'put',
            params: jQuery('#detail-sub-sektor form').serializeArray()
        },
        type: 'POST',
        success: function (successData, textStatus, jqXHR) {
            successData = JSON.parse(successData);
            var td1 = successData.name;

            $('tr[data-id="'+id+'"]').find("td:eq(1)").text(td1);
            if (jqXHR.status === 200) {
                $('#detail-sub-sektor.modal').modal('hide');
                toastr.success(td1+' successfully updated');
            } else {
                toastr.error('Error when updating your data');
            }
        }
    });
});

$(document).on('click', '.button-adv-sub-sektor .add-btn', function () {
    $('#sub-sektor-add.modal').modal({show: true, backdrop: 'static'});
    var parent = $('select#select-sektor').val();
    $('#sub-sektor-add.modal form input[name="parent"]').val('/api/advertising/categories/'+parent);
});

$(document).on('click', '#sub-sektor-add .save', function () {
    $.ajax({
        url: '/api',
        data: {
            module: 'advertising/categories',
            method: 'post',
            params: jQuery('#sub-sektor-add form').serializeArray()
        },
        type: 'POST',
        success: function (successData, textStatus, jqXHR) {
            if (jqXHR.status === 200) {
                var parentId = $('#sub-sektor-add input[name="parent"]').val();
                var id = parentId.split('/')[4];
                getSubSektorData(id);
                toastr.success('Data successfully added');
                $('#sub-sektor-add.modal form input').val('');
                $('#sub-sektor-add.modal').modal('hide');
            } else {
                toastr.error('Error when saving your data');
            }
        }
    });
});

$(document).on('click', '#sub-sektor-body .delete-btn', function () {
    var module = 'advertising/categories';
    var id = $(this).closest('tr').data('id');
    var elm = jQuery('#sub-sektor-body tr[data-id="'+id+'"]');
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
                    del(module, id, 'sub-sektor-body');
                }
            }
        });
    }, 20);
});

function del(module, id, formId) {
    var sektorId = $('select#select-sektor').val();
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
            elm.hide('slow', function(){ elm.remove(); getSubSektorData(sektorId); });
            toastr.success('Data successfully deleted');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error when deleting your data');
            elm.removeClass('bg-red');
        }
    });

}
