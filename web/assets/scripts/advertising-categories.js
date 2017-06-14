var emitenData = {
    module: 'advertising/categories/root',
    method: 'get'
};

getData(emitenData, 'emitenTable');

$(document).on('click', '#emitenTable tr', function (e) {
    var id = $(this).attr('id');

    if (id) {
        var sektorData = {
            module: 'advertising/categories',
            method: 'get',
            params: [{'parent.id': id}]
        };
    }

    getData(sektorData, 'sektorTable', 'sektor');

    if ($(this).hasClass("bg-yellow")) {
        $(this).removeClass("bg-yellow");
    } else {
        $(this).addClass("bg-yellow");
        $(this).siblings().removeClass('bg-yellow');
    }
    $('.sub-sektor').removeAttr('data-toggle');
});

$(document).on('click', '#sektorTable tr', function (e) {
    var id = $(this).attr('id');
    console.log(id);
    if (id) {
        var sektorData = {
            module: 'advertising/categories',
            method: 'get',
            params: [{'parent.id': id}]
        };

        getData(sektorData, 'subSektorTable', 'sub-sektor');
    }

    if ($(this).hasClass("bg-yellow")) {
        $(this).removeClass("bg-yellow");
    } else {
        $(this).addClass("bg-yellow");
        $(this).siblings().removeClass('bg-yellow');
    }
});

function getData(data, tableId, dest) {
    var dest;
    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {},
        success: function (data, textStatus, jqXHR) {
            data = JSON.parse(data);
            var no = 1;
            var tr = '';
            $.each(data['hydra:member'], function (index, value) {
                tr += '<tr id="'+value.id+'">';
                tr += '<td>'+no+'</td>';
                tr += '<td>'+value.name+'</td>';
                tr += '<td><span class="pull-right">';
                tr += '<button data-id="' + value.id + '" class="detail-btn btn btn-default btn-xs btn-flat" title="DETAIL"><i class="fa fa-eye"></i></button>';
                tr += '<button data-id="' + value.id + '" class="delete-btn btn btn-default btn-xs btn-flat" title="DELETE"><i class="fa fa-times"></i></button>';
                tr += '</td>';
                tr += '</tr>';
                no++;
            });

            if (data['hydra:member'].length > 0) {
                $('tbody#'+tableId).html(tr);
            } else {
                $('tbody#'+tableId).html('<tr><td colspan="33">NO DATA</td></tr>');
            }

            $('.'+dest).attr('data-toggle', 'tab');
        },
        error: function (jqXHR, textStatus, errorThrown) {}
    });

}

function getDetail(id, modalId) {
    $.ajax({
        url: "/api",
        type: "POST",
        data: {
            module: 'advertising/categories/'+id,
            method: 'get'
        },
        beforeSend: function () {},
        success: function (data) {
            $('div#'+modalId+' input').removeClass('loading').prop('readonly', false).removeAttr('placeholder');

            data = JSON.parse(data);
            $.each(data, function (index, value) {
                if(index.startsWith("@") === false) {
                    $('#'+modalId+' input#'+index).val(value);
                }
            });
        },
    });
}

// delete a data
function del(module, id, moduleData, tableId) {

    var data = {
        module : module+'/'+id,
        method: 'delete',
        params: {}
    };

    var elm = jQuery('tbody tr#'+id);

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {},
        success: function (data, textStatus, jqXHR) {
            elm.hide('slow', function(){ elm.remove(); });
            toastr.success('Data successfully deleted');
            getData(moduleData, tableId);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error when deleting your data');
            elm.removeClass('bg-red');
        }
    });

}

// Delete emiten
$(document).on('click', 'tbody#emitenTable .delete-btn', function () {
    var module = 'advertising/categories';
    var id = $(this).attr('data-id');
    var elm = jQuery('tbody tr#'+id);
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
                    del(module, id, emitenData, 'emitenTable');
                }
            }
        });
    }, 20);

});

// detail emiten
$(document).on('click', 'tbody#emitenTable .detail-btn', function () {
    var id = $(this).attr('data-id');

    $('div#emitenModal input').val('').addClass('loading').prop('readonly', true).attr('placeholder','Loading...');
    $('div#emitenModal').modal({show: true, backdrop: 'static'});
    getDetail(id, 'emitenModal');
});

// edit form emiten
$(document).on('click', 'div#emitenModal .edit.btn', function () {
    var params = $('div#emitenModal form');
    var id = $('div#emitenModal form input#id').val();
    editAction('advertising/categories', id, params, 'emitenModal', 'emitenTable', ['name']);
});

// edit action aka update
function editAction(module, id, params, modalId, tableId, columns) {

    var data = {
        module : module+'/'+id,
        method: 'put',
        params: jQuery(params).serializeArray()
    };

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {
            jQuery('div .has-error').removeClass('has-error');
            jQuery('p.help-block').remove();
            jQuery('div#'+modalId+' .edit.btn').text('UPDATING...').prop('disabled', true);
        },
        success: function (data, textStatus, jqXHR) {

            var arr = JSON.parse(data);
            if ("violations" in arr) {

                $.each(arr, function (index, value) {
                    if (index === 'violations') {
                        $.each(value, function (idx, val) {
                            jQuery('div#'+modalId+' form #' + val.propertyPath).parent('div').addClass('has-error');
                            jQuery('<p class="help-block">' + val.message + '</p>').insertAfter('div#'+modalId+' form #' + val.propertyPath);
                        });
                    }
                });

                jQuery('div#'+modalId+' .edit.btn').text('UPDATE').prop('disabled', false);
                toastr.error('Error when updating your data');
            } else if('id' in arr) {
                jQuery.each(columns, function (idx,val) {
                    kolom = idx+2;
                    jQuery.each(arr, function (i,v) {
                        if (val === i) {
                            jQuery('tbody#'+tableId+' tr#'+id+' td:nth-child('+kolom+')').text(v);
                        } else if(v instanceof Object && val.split('.')[0] === i) {
                            jQuery.each(v, function (ix,vl) {
                                if(ix === val.split('.')[1]) {
                                    jQuery('tbody#'+tableId+' tr#'+id+' td:nth-child('+kolom+')').text(vl);
                                }
                            });
                        }
                    });
                });

                toastr.success('Data successfully updated');
                $('div#'+modalId).modal('hide');
                $('div#'+modalId+' .edit.btn').text('UPDATE').prop('disabled', false);
            } else {
                toastr.error('Error when updating your data');
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            jQuery('div#'+modalId+' .edit.btn').text('UPDATE').prop('disabled', false);
            toastr.error('Error when updating your data');
        }
    });

}