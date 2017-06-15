// EMITEN
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

// detail emiten
$(document).on('click', 'tbody#emitenTable .detail-btn', function () {
    var id = $(this).attr('data-id');
    getDetail(id, 'emitenModal');
});

// edit form emiten
$(document).on('click', 'div#emitenModal .edit.btn', function () {
    var params = $('div#emitenModal form');
    var id = $('div#emitenModal form input#id').val();
    editAction('advertising/categories', id, params, 'emitenModal', 'emitenTable', ['name']);
});

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
// END EMITEN

// SEKTOR
$(document).on('click', '#sektorTable tr', function (e) {
    var id = $(this).attr('id');
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

// detail sektor
$(document).on('click', 'tbody#sektorTable .detail-btn', function () {
    var id = $(this).attr('data-id');
    getDetail(id, 'sektorModal');
});

// edit form sektor
$(document).on('click', 'div#emitenModal .edit.btn', function () {
    var params = $('div#emitenModal form');
    var id = $('div#emitenModal form input#id').val();
    editAction('advertising/categories', id, params, 'emitenModal', 'emitenTable', ['name']);
});

// Delete sektor
$(document).on('click', 'tbody#sektorTable .delete-btn', function () {
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
                console.log(result);
                if (result === false) {
                    elm.removeClass('bg-red');
                } else {
                    del(module, id, null, 'sektorTable');
                }
            }
        });
    }, 20);

});
// END SEKTOR

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
        beforeSend: function () {
            $('div#'+modalId+' input').val('').addClass('loading').prop('readonly', true).attr('placeholder','Loading...');
            $('div#'+modalId).modal({show: true, backdrop: 'static'});
        },
        success: function (data) {
            $('div#'+modalId+' input').removeClass('loading').prop('readonly', false).removeAttr('placeholder');

            data = JSON.parse(data);
            $.each(data, function (index, value) {
                if (typeof value === 'object') {

                    var select = jQuery('select.select-edit-modal');

                    $.each(select, function (indSlct, valSlct) {

                        var dataSelected = $(valSlct).attr('data-selected');
                        var objectSelected = dataSelected.split("#")[0];
                        var fieldSelected = dataSelected.split("#")[1];

                        var dataObject = $(valSlct).attr('data-object');
                        var object = dataObject.split("#")[0];
                        var field = dataObject.split("#")[1];
                        var dataSelect = {
                            module: object,
                            method: 'get',
                        };

                        jQuery('select[data-object="' + dataObject + '"]').select2({

                            theme: "bootstrap",
                            placeholder: "SEARCH A " + field.toUpperCase(),
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
                                        module: object,
                                        method: 'get',
                                        field: field.split('#')
                                    };
                                },
                                processResults: function (data) {
                                    if (data.length > 0) {
                                        return {
                                            results: $.map(data, function (obj) {
                                                return {id: '/api/' + object + '/' + obj.id, text: obj[field]};
                                            })
                                        }
                                    }
                                },
                                cache: true,
                            },
                            escapeMarkup: function (markup) {
                                return markup;
                            },
                            minimumInputLength: 2
                        });

                        $.ajax({
                            url: "/api",
                            type: "POST",
                            data: dataSelect,
                            beforeSend: function () {
                                jQuery('select[data-object="' + dataObject + '"]').html('<option selected>LOADING..</option>');
                                jQuery('div#'+modalId+' .edit.btn').prop('disabled', true);
                            },
                            success: function (data, textStatus, jqXHR) {
                                var select = '';
                                var arr = JSON.parse(data);
                                $.each(arr, function (indeks, velyu) {
                                    if (indeks === 'hydra:member') {

                                        $.each(velyu, function (ind, valu) {

                                            if (value == null) {
                                                select += '<option value="/api/' + object + '/' + valu.id + '">' + valu[field] + '</option>';
                                            } else {
                                                if (value['id'] === valu.id && (objectSelected === index || index === 'parent')) {
                                                    select += '<option selected value="/api/' + object + '/' + valu.id + '">' + valu[field] + '</option>';
                                                } else {
                                                    select += '<option value="/api/' + object + '/' + valu.id + '">' + valu[field] + '</option>';
                                                }
                                            }

                                        });

                                    }
                                });

                                if (value == null) {
                                    select += '<option selected></option>';
                                }
                                jQuery('select[data-object="' + dataObject + '"]').html(select).removeClass('loading').removeAttr('disabled');
                                jQuery('div#'+modalId+' .edit.btn').prop('disabled', false);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                jQuery('div#'+modalId+' .edit.btn').prop('disabled', true);
                            }
                        });

                    });

                } else if(index.startsWith("@") === false) {
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
            if ((moduleData) && (tableId)) {
                getData(moduleData, tableId);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error when deleting your data');
            elm.removeClass('bg-red');
        }
    });

}



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

jQuery(".search-name").select2({
    theme: "bootstrap",
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
                module: module,
                method: 'get',
                field: field.split('#')
            };
        },
        processResults: function (data) {
            if(data.length > 0) {
                return {
                    results: $.map(data, function(obj) {
                        return { id: obj.id, text: obj[field.split('#')[0]] };
                    })
                }
            } else {
                var elms = jQuery('.search-area').removeClass('col-md-12').addClass('col-md-10');
                elms += jQuery('.button-area').addClass('col-md-2');
                elms += jQuery('a[data-btn-add="'+module+'"]').css('visibility', 'visible');

                return {
                    results: elms
                }
            }

        },
        cache: true,
    },
    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
    minimumInputLength: 2,
}).on("select2:select", function () {
    var id = jQuery(".search-name").val();
    var text = jQuery(".search-name").text();

    jQuery('div.detail-modal#sektorModal input').val('').addClass('loading').prop('readonly', true).attr('placeholder','Loading...');
    jQuery('div.detail-modal#sektorModal input[type="checkbox"]').prop('checkbox', false).prop('disabled', true);
    jQuery('div.detail-modal#sektorModal').modal({show: true, backdrop: 'static'});

    getDetail(id, 'sektorModal');

    //changeUrlParam(field.split('-')[0], text);
    //getAll(module,columns);
}).on("select2:unselect", function () {
    //history.pushState(false,false,document.location.origin+'/'+module);
    //getAll(module,columns);
}).on("select2:open", function () {
    jQuery('a[data-btn-add="advertising-categories"]').css('visibility', 'hidden');
    jQuery('.search-area').removeClass('col-md-10').addClass('col-md-12');
    jQuery('.button-area').removeClass('col-md-2');
}).on("select2:closing", function () {
    var searchTerms = $('span.select2-search.select2-search--dropdown input.select2-search__field').val();
    localStorage.setItem("searchTerms", searchTerms);
});