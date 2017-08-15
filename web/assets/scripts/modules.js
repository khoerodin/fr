//Store the reference to the original method:
var _serializeArray = $.fn.serializeArray;

//Now extend it with newer "unchecked checkbox" functionality:
$.fn.extend({
    serializeArray: function() {
        //Important: Get the results as you normally would...
        var results = _serializeArray.call(this);

        //Now, find all the checkboxes and append their "checked" state to the results.
        this.find('input[type=checkbox]').each(function(id, item) {
            var $item = $(item);
            results.push({name: $item.attr('name'), value: $item.is(":checked") ? true : false});
        });
        return results;
    }
});

var activeId = $('#serviceTab .active a').attr('aria-controls');
getModules(activeId);

function getModules(activeId) {
    $.ajax({
        url: '/api',
        type: 'post',
        data: {
            module: 'modules',
            method: 'get',
            params: [
                {
                    'service.id': activeId
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data)['hydra:member'];
            var tr = '';
            var no = 1;
            $.each(data, function (index, value) {
                tr += '<tr id="'+value.id+'">';
                tr += '<td>'+no+'</td>';
                tr += '<td>'+value.name+'</td>';
                tr += '<td>'+value.groupName+'</td>';
                tr += '<td>'+value.path+'</td>';
                tr += '<td>';

                if(value.menuDisplay === true) {
                    tr += '<i class="fa fa-check text-success"></i>';
                } else {
                    tr += '<i class="fa fa-times text-danger"></i>';
                }

                tr += '</td>';
                tr += '<td data-id="'+value.id+'"><span class="pull-right">';
                tr += '<button class="detail btn btn-xs btn-default btn-flat"><i class="fa fa-eye"></i></button>';
                tr += '<button class="delete btn btn-xs btn-default btn-flat"><i class="fa fa-times"></i></button>';
                tr += '</span></td>';
                tr += '</tr>';
                no++;
            });

            if (data.length > 0) {
                $('#'+activeId+' tbody').html(tr);
            } else {
                $('#'+activeId+' tbody').html('<tr><td colspan="6">NO DATA</td></tr>');
            }

        }
    });
}

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var activeId = $(e.target).attr('aria-controls');
    getModules(activeId);
});

function getDetailModule(moduleId) {
    $.ajax({
        url: '/api',
        type: 'post',
        data: {
            module: 'modules/' + moduleId,
            method: 'get'
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            var serviceId = data.service.id;

            $('#detail-modal form #id').val(data.id);
            $('#detail-modal form #name').val(data.name);
            $('#detail-modal form #groupName').val(data.groupName);

            $.ajax({
                url: '/api',
                type: 'post',
                data: {
                    module: 'services',
                    method: 'get'
                },
                success: function (optionData) {
                    var optionData = JSON.parse(optionData)['hydra:member'];
                    var option = '';
                    $.each(optionData, function (index, value) {
                        if (value.id === serviceId) {
                            option += '<option selected value="/api/services/'+value.id+'">'+ value.name +'</option>';
                        } else {
                            option += '<option value="/api/services/'+value.id+'">'+ value.name +'</option>';
                        }
                    });
                    $('#detail-modal form #service').html(option).select2({
                        theme: 'bootstrap'
                    });
                }
            });

            $('#detail-modal form #path').val(data.path);
            $('#detail-modal form #iconCls').val(data.iconCls);

            if (data.menuDisplay === true) {
                $('#detail-modal form #menuDisplay').prop('checked', true);
            } else {
                $('#detail-modal form #menuDisplay').prop('checked', false);
            }

            $('#detail-modal').modal({show: true, backdrop: 'static'});
        }
    });
}

$(document).on('click', '.detail', function () {
    var id = $(this).closest('td').data('id');
    getDetailModule(id);
});

function updateModule(moduleId) {

    $('#detail-modal button.edit').text('UPDATING...').prop('disabled', true);
    $('div .has-error').removeClass('has-error');
    $('p.help-block').remove();

    $.ajax({
        url: '/api',
        type: 'post',
        data: {
            module: 'modules/' + moduleId,
            method: 'put',
            params: $('#detail-modal form').serializeArray()
        },
        success: function (data) {
            var data = JSON.parse(data);
            console.log(data);
            if ("violations" in data) {

                $.each(data, function (index, value) {
                    if (index === 'violations') {
                        $.each(value, function (idx, val) {
                            $('#detail-modal form #' + val.propertyPath).parent('div').addClass('has-error');
                            $('<p class="help-block">' + val.message + '</p>').insertAfter('#detail-modal form #' + val.propertyPath);
                        });
                    }
                });
                toastr.error('Gagal memperbarui data');

            } else {
                $('#detail-modal').modal('hide');
                var activeId = $('#serviceTab .active a').attr('aria-controls');
                getModules(activeId);
                toastr.success('Sukses memperbarui data');
            }

            $('#detail-modal button.edit').text('UPDATE').prop('disabled', false);
        }
    });

}

$(document).on('click', '#detail-modal button.edit', function () {
    var moduleId = $('#detail-modal form #id').val();
    updateModule(moduleId);
});

function deleteModule(moduleId) {

    $.ajax({
        url: '/api',
        type: 'post',
        data: {
            module: 'modules/'+ moduleId,
            method: 'delete'
        },
        success: function (data) {
            var activeId = $('#serviceTab .active a').attr('aria-controls');
            getModules(activeId);
            toastr.success('Sukses menghapus data');
        },
        error: function (errorThrown) {
            toastr.error('Gagal menghapus data');
        }
    });

}

$(document).on('click', 'tbody button.delete', function () {
    var moduleId = $(this).closest('td').data('id');
    var elm = $('tbody tr#'+moduleId);
    elm.addClass('bg-red');

    setTimeout(function(){
        bootbox.confirm({
            message: "BENAR AKAN MENGHAPUS MODUL INI?",
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
                    deleteModule(moduleId);
                }
            }
        });
    }, 20);
});