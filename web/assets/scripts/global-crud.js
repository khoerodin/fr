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
            results.push({name: $item.attr('name'), value: $item.is(":checked") ? 1 : 0});
        });
        return results;
    }
});

function getQueryVariable(variable, query = decodeURIComponent(window.location.search.substring(1)))
{
    var vars = query.split("&");
    if(typeof variable !== 'undefined') {
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
    } else {
        var keys = [];
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            keys.push({[pair[0]] : pair[1]});
        }
        return keys;
    }
    return(false);
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

function changeUrlParam (param, value) {
    var currentURL = window.location.href+'&';
        currentURL = currentURL.replace('#','');
    var change = new RegExp('('+param+')=(.*)&', 'g');
    var newURL = currentURL.replace(change, '$1='+value+'&');

    if (getURLParameter(param) !== null){
        try {
            window.history.replaceState('', '', newURL.slice(0, - 1) );
        } catch (e) {

        }
    } else {
        var currURL = window.location.href;
        if (currURL.indexOf("?") !== -1){
            window.history.replaceState('', '', currentURL.slice(0, - 1) + '&' + param + '=' + value);
        } else {
            window.history.replaceState('', '', currentURL.slice(0, - 1) + '?' + param + '=' + value);
        }
    }
}

// get all data
function getAll(module, columns = []) {

    var data = {
        module : module,
        method: 'get',
        params: getQueryVariable()
    };

    columnCount = columns.length+2;

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {
            jQuery('tbody[data-list="'+module+'"]').html('<tr><td colspan="'+columnCount+'">LOADING DATA...</td></tr>')
        },
        success: function (data, textStatus, jqXHR) {

            arr = JSON.parse(data);

            $.each(arr, function (index, value) {
                if(index === 'hydra:member'){

                    page = getQueryVariable('page');
                    var tr = '';
                    $.each(value, function (idx, val) {
                        if(page > 1) {
                            c = page - 1;
                            p = 17 * c;
                            no = idx+1+p;
                        } else {
                            no = idx+1;
                        }

                        no = no;
                        tr += '<tr id="'+val.id+'">';
                        tr += '<td>'+no+'</td>'
                        $.each(columns, function (i,v) {
                            var v1 = v.split(".")[0];
                            var v2 = v.split(".")[1];

                            if (val[v1] instanceof Object) {
                                $.each(val[v1], function(ind, vl) {
                                    if(ind == v2){
                                        tr += '<td>'+vl+'</td>';
                                    }
                                })
                            } else {
                                tr += '<td>';

                                if (module === 'users') {

                                    if (val[v1] == true) {
                                        tr += '<input type="checkbox" class="loginState" data-id="'+val.id+'" name="loggedIn" checked>';
                                    } else if (val[v1] == false) {
                                        tr += '<input type="checkbox" class="loginState" data-id="'+val.id+'" name="loggedIn">';
                                    } else {
                                        if (val[v1] == null) {
                                            val[v1] = '-';
                                        }
                                        tr += val[v1];
                                    }

                                } else {

                                    if (val[v1] == true && val[v1] !== '1') {
                                        tr += '<span class="glyphicon glyphicon-ok"></span>';
                                    } else if(val[v1] == false && val[v1] !== '0') {
                                        tr += '<span class="glyphicon glyphicon-remove"></span>';
                                    } else {
                                        if (val[v1] == null) {
                                            val[v1] = '-';
                                        }
                                        tr += val[v1];
                                    }

                                }

                                tr += '</td>';
                            }

                        });

                        tr += '<td><span class="pull-right">';
                        tr += '<button data-id="'+val.id+'" class="detail-btn btn btn-default btn-xs btn-flat" title="DETAIL"><i class="fa fa-eye"></i></button>';
                        tr += '<button data-id="'+val.id+'" class="delete-btn btn btn-default btn-xs btn-flat" title="DELETE"><i class="fa fa-times"></i></button>';

                        if(module === 'users') {
                            tr += '<button data-user-fullname="'+val.fullname+'" data-id="'+val.id+'" class="roles-btn btn btn-default btn-xs btn-flat" title="ROLES"><i class="fa fa-lock"></i></button>';
                        }

                        tr += '</span></td>';
                        tr += '</tr>';
                    });
                    jQuery('tbody[data-list="'+module+'"]').html(tr);
                }

                if(index === 'hydra:view') {
                    var paging = '';

                    $.each(value, function (idx, val) {
                        page = getQueryVariable('page',val);
                        if(idx.startsWith('hydra')){
                            if(idx.endsWith('first')) {
                                paging += '<li><span class="to-page" data-page="'+page+'" title="FIRST PAGE">FIRST</span></li>';
                            }
                        }
                    });

                    $.each(value, function (idx, val) {
                        page = getQueryVariable('page',val);
                        if(idx.startsWith('hydra')){
                            if(idx.endsWith('previous')) {
                                paging += '<li><span class="to-page" data-page="'+page+'" title="PREVIOUS PAGE">PREVIOUS</span></li>';
                            }
                        }
                    });

                    $.each(value, function (idx, val) {
                        page = getQueryVariable('page',val);
                        if(idx.startsWith('hydra')){
                            if(idx.endsWith('next')) {
                                paging += '<li><span class="to-page" data-page="'+page+'" title="NEXT PAGE">NEXT</span></li>';
                            }
                        }
                    });

                    $.each(value, function (idx, val) {
                        page = getQueryVariable('page',val);
                        if(idx.startsWith('hydra')){
                            if(idx.endsWith('last')) {
                                paging += '<li><span class="to-page" data-page="'+page+'" title="LAST PAGE">LAST</span></li>';
                            }
                        }
                    });

                    jQuery('ul[data-paging="'+module+'"].pagination').html(paging);
                }
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {}
    });
}

// post/save data
function post(module, params, columns = []) {

    var data = {
        'module' : module,
        'params' : jQuery(params).serializeArray(),
        'method' : 'post'
    };

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {
            jQuery('div .has-error').removeClass('has-error');
            jQuery('p.help-block').remove();
            jQuery('div[data-modal-add="'+module+'"] .save.btn').text('SAVING...').prop('disabled', true);
        },
        success: function (data, textStatus, jqXHR) {

            var arr = JSON.parse(data);
            if ("violations" in arr) {

                $.each(arr, function (index, value) {
                    if(index === 'violations'){
                        $.each(value, function (idx, val) {
                            jQuery('div[data-modal-add="'+module+'"] form #'+val.propertyPath).parent('div').addClass('has-error');
                            jQuery( '<p class="help-block">'+val.message+'</p>' ).insertAfter( 'div[data-modal-add="'+module+'"] form #'+val.propertyPath );
                        });
                    }
                });

            } else {
                history.pushState(false,false,document.location.origin+'/'+module);
                getAll(module,columns);
                jQuery('div[data-modal-add="'+module+'"]').modal('hide');
            }

            jQuery('div[data-modal-add="'+module+'"] .save.btn').text('SAVE').prop('disabled', false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            jQuery('div[data-modal-add="'+module+'"] .save.btn').text('SAVE').prop('disabled', false);
        }
    });
}

// get detail of data before edit
function detail(module,id) {

    var data = {
        module : module+'/'+id,
        method: 'get',
        params: {}
    };

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {
            jQuery('div .has-error').removeClass('has-error');
            jQuery('p.help-block').remove();
            jQuery('div[data-modal-detail="'+module+'"] .edit.btn').text('UPDATE').prop('disabled', true);
            jQuery('tbody[data-list="'+module+'"] tr#'+id).attr('style', 'background-color:#f39c12;transition:background 3s ease;');

            jQuery('div[data-modal-detail="'+module+'"] input').addClass('loading').attr('placeholder', 'LOADING...').prop('disabled', true);
            jQuery('div[data-modal-detail="'+module+'"] select').addClass('loading').prop('disabled', true).html('<option selected>LOADING...</option>');
            jQuery('div[data-modal-detail="'+module+'"] textarea').addClass('loading').attr('placeholder', 'LOADING...').prop('disabled', true);
            jQuery('div[data-modal-detail="'+module+'"] input[type="checkbox"]').prop('disabled', true);
        },
        success: function (data, textStatus, jqXHR) {
            arr = JSON.parse(data);

            $.each(arr, function (index, value) {
                if (typeof value === 'object') {

                    var select = jQuery('select.select-edit-modal');

                    $.each(select, function (indSlct, valSlct) {

                        var dataSelected = $(valSlct).attr('data-selected');
                        var objectSelected = dataSelected.split("#")[0];
                        var fieldSelected = dataSelected.split("#")[1];

                        var dataObject = $(valSlct).attr('data-object');
                        var object = dataObject.split("#")[0];
                        var field = dataObject.split("#")[1];
                        var data = {
                            module : object,
                            method : 'get',
                        };

                        jQuery('select[data-object="'+dataObject+'"]').select2({

                            theme: "bootstrap",
                            placeholder: "SEARCH A "+field.toUpperCase(),
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
                                    if(data.length > 0) {
                                        return {
                                            results: $.map(data, function(obj) {
                                                return { id: '/api/'+object+'/'+obj.id, text: obj[field] };
                                            })
                                        }
                                    }
                                },
                                cache: true,
                            },
                            escapeMarkup: function (markup) { return markup; },
                            minimumInputLength: 2
                        });

                        $.ajax({
                            url: "/api",
                            type: "POST",
                            data: data,
                            beforeSend: function () {
                                jQuery('select[data-object="'+dataObject+'"]').html('<option selected>LOADING..</option>');
                                jQuery('div[data-modal-detail="'+module+'"] .edit.btn').prop('disabled', true);
                            },
                            success: function (data, textStatus, jqXHR) {
                                var select = '';
                                var arr = JSON.parse(data);
                                $.each(arr, function (indeks, velyu) {
                                    if(indeks === 'hydra:member'){

                                        $.each(velyu, function (ind, valu) {

                                            if (value == null) {
                                                select += '<option value="/api/'+object+'/'+valu.id+'">'+valu[field]+'</option>';
                                            } else {
                                                if (value['id'] === valu.id && (objectSelected === index || index === 'parent')) {
                                                    select += '<option selected value="/api/'+object+'/'+valu.id+'">'+valu[field]+'</option>';
                                                } else {
                                                    select += '<option value="/api/'+object+'/'+valu.id+'">'+valu[field]+'</option>';
                                                }
                                            }

                                        });

                                    }
                                });

                                if (value == null) {
                                    select+= '<option selected></option>';
                                }
                                jQuery('select[data-object="'+dataObject+'"]').html(select).removeClass('loading').removeAttr('disabled');
                                jQuery('div[data-modal-detail="'+module+'"] .edit.btn').prop('disabled', false);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                jQuery('div[data-modal-detail="'+module+'"] .edit.btn').prop('disabled', true);
                            }
                        });

                    });

                } else if (index.indexOf('@') <= -1) {
                    if (value === true || value === 'undefined') {
                        jQuery('div[data-modal-detail="'+module+'"] input[type="checkbox"]#' + index).prop('checked', true).removeAttr('disabled');;
                    } else if (value === false || value === 'undefined') {
                        jQuery('.' + module + '.detail-modal.modal input[type="checkbox"]#' + index).prop('checked', false).removeAttr('disabled');;
                    } else {
                        //console.log(value);
                        jQuery('div[data-modal-detail="'+module+'"] input#' + index).val(value).removeClass('loading').attr('placeholder', index).removeAttr('disabled readonly');
                        jQuery('div[data-modal-detail="'+module+'"] textarea#' + index).text(value).removeClass('loading').attr('placeholder', index).removeAttr('disabled readonly');
                        jQuery('div[data-modal-detail="'+module+'"] input#username').val(value).removeClass('loading').attr('placeholder', index).attr('readonly', 'readonly');
                        jQuery('div[data-modal-detail="'+module+'"] input[type="password"]').val('').removeClass('loading').attr('placeholder', 'LEAVE BLANK IF DONT WANT TO CHANGE').removeAttr('disabled readonly');
                    }
                    jQuery('div[data-modal-detail="'+module+'"] .edit.btn').prop('disabled', false);
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            jQuery('div[data-modal-detail="'+module+'"] .edit.btn').prop('disabled', true);
        }
    });
}

// edit action aka update
function editAction(module, id, params) {

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
            jQuery('div[data-modal-detail="'+module+'"] .edit.btn').text('UPDATING...').prop('disabled', true);
        },
        success: function (data, textStatus, jqXHR) {

            var arr = JSON.parse(data);
            if ("violations" in arr) {

                $.each(arr, function (index, value) {
                    if (index === 'violations') {
                        $.each(value, function (idx, val) {
                            jQuery('div[data-modal-detail="'+module+'"] form #' + val.propertyPath).parent('div').addClass('has-error');
                            jQuery('<p class="help-block">' + val.message + '</p>').insertAfter('div[data-modal-detail="'+module+'"] form #' + val.propertyPath);
                        });
                    }
                });

                jQuery('div[data-modal-detail="'+module+'"] .edit.btn').text('UPDATE').prop('disabled', false);
                toastr.error('Error when updating your data');
            } else {
                //console.log(arr);
                jQuery.each(columns, function (idx,val) {
                    kolom = idx+2;
                    jQuery.each(arr, function (i,v) {
                        if (val === i) {
                            jQuery('tbody[data-list="'+module+'"] tr#'+id+' td:nth-child('+kolom+')').text(v);
                        } else if(v instanceof Object && val.split('.')[0] === i) {
                            jQuery.each(v, function (ix,vl) {
                                if(ix === val.split('.')[1]) {
                                    jQuery('tbody[data-list="'+module+'"] tr#'+id+' td:nth-child('+kolom+')').text(vl);
                                }
                            });
                        }
                    });
                });

                toastr.success('Data successfully updated');
                jQuery('div[data-modal-detail="'+module+'"]').modal('hide');
                jQuery('div[data-modal-detail="'+module+'"] .edit.btn').text('UPDATE').prop('disabled', false);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            jQuery('div[data-modal-detail="'+module+'"] .edit.btn').text('UPDATE').prop('disabled', false);
            toastr.error('Error when updating your data');
        }
    });

}

// delete a data
function del(module, id, columns) {

    var data = {
        module : module+'/'+id,
        method: 'delete',
        params: {}
    };

    var elm = jQuery('tbody[data-list="'+module+'"] tr#'+id);

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {},
        success: function (data, textStatus, jqXHR) {
            elm.hide('slow', function(){ elm.remove(); });
            toastr.success('Data successfully deleted');
            getAll(module,columns);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error when deleting your data');
            elm.removeClass('bg-red');
        }
    });

}

// get select/dropdown inside modal
function getSelect(classElm) {
    var select = jQuery(classElm);

    jQuery(select).each( function(index, value) {

        var object = value.getAttribute('data-object');
        var module = object.split("#")[0];
        var field = object.split("#")[1];

        jQuery('select[data-object="'+object+'"]').select2({

            theme: "bootstrap",
            placeholder: "SEARCH A "+field.toUpperCase(),
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
                                return { id: '/api/'+module+'/'+obj.id, text: obj[field] };
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
}

jQuery(function($) {
    jQuery(".search-"+field).select2({
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
        var id = jQuery(".search-"+field+"").val();
        var text = jQuery(".search-"+field+"").text();

        jQuery('div[data-modal-detail="'+window.module+'"] input').val('').addClass('loading').prop('readonly', true).attr('placeholder','Loading...');
        jQuery('div[data-modal-detail="'+window.module+'"] input[type="checkbox"]').prop('checkbox', false).prop('disabled', true);
        jQuery('div[data-modal-detail="'+window.module+'"]').modal({show: true, backdrop: 'static'});

        if (module !== 'user-activities') {
            detail(module, id);
        } else {
            detailUserActivities(id);
        }

        changeUrlParam(field.split('-')[0], text);
        getAll(module,columns);
    }).on("select2:unselect", function () {
        history.pushState(false,false,document.location.origin+'/'+module);
        getAll(module,columns);
    }).on("select2:open", function () {
        jQuery('a[data-btn-add="'+module+'"]').css('visibility', 'hidden');
        jQuery('.search-area').removeClass('col-md-10').addClass('col-md-12');
        jQuery('.button-area').removeClass('col-md-2');
    });

    // Add form
    $(document).on('click', 'a[data-btn-add="'+window.module+'"]', function () {
        $('.add-datetime').datetimepicker();
        var $this = $('div[data-modal-add="'+window.module+'"]');
        $this.modal({show: true, backdrop: 'static'});

        getSelect('.select-add-modal');

        if($(this).hasClass('h')){
            jQuery(this).css('visibility', 'hidden');
            jQuery('.search-area').removeClass('col-md-10').addClass('col-md-12');
            jQuery('.button-area').removeClass('col-md-2');
        }
    });

    // detail form
    $(document).on('click', 'tbody[data-list="'+window.module+'"] .detail-btn', function () {
        var id = $(this).attr('data-id');

        jQuery('div[data-modal-detail="'+window.module+'"] input').val('').addClass('loading').prop('readonly', true).attr('placeholder','Loading...');
        jQuery('div[data-modal-detail="'+window.module+'"] input[type="checkbox"]').prop('checkbox', false).prop('disabled', true);
        jQuery('div[data-modal-detail="'+window.module+'"]').modal({show: true, backdrop: 'static'});

        if (module !== 'user-activities') {
            detail(module, id);
        } else {
            detailUserActivities(id);
        }
    });

    // Delete action
    $(document).on('click', 'tbody[data-list="'+window.module+'"] .delete-btn', function () {
        var module = window.module;
        var id = $(this).attr('data-id');
        var elm = jQuery('tbody[data-list="'+module+'"] tr#'+id);
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
                        del(module, id, columns);
                    }
                }
            });
        }, 20);

    });

    // save action
    $(document).on('click', 'div[data-modal-add="'+window.module+'"] .save.btn', function () {
        var module = window.module;
        var params = $('div[data-modal-add="'+window.module+'"] form');

        post(module,params,columns);
    });

    // edit action aka update
    $(document).on('click', 'div[data-modal-detail="'+window.module+'"] .edit.btn', function () {
        var module = window.module;
        var params = $('div[data-modal-detail="'+window.module+'"] form');

        var id = $('div[data-modal-detail="'+window.module+'"] form input#id').val();
        editAction(module, id, params);
    });

    $('.modal').on('hidden.bs.modal', function () {
        $(this).find('input,textarea,select').val('').end();
        $(this).find('input[type="checkbox"]').prop('checked', false).end();
        $('div .has-error').removeClass('has-error');
        $('p.help-block').remove();

        jQuery('table.table-striped tbody[data-list="'+module+'"] tr').css('background-color', 'inherit');
        jQuery('table.table-striped tbody[data-list="'+module+'"]>tr:nth-of-type(odd)').css('background-color', '#f9f9f9');
    });

    $('.modal').on('hide.bs.modal', function () {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    });

    $(document).on('keypress', 'div[data-modal-add="'+window.module+'"] form input', function (e) {
        if (e.which === 13) {
            $('div[data-modal-add="'+window.module+'"] .save.btn').click();
            return false;
        }
    });

    $(document).on('keypress', 'div[data-modal-detail="'+window.module+'"] form input', function (e) {
        if (e.which === 13) {
            $('div[data-modal-detail="'+window.module+'"] .edit.btn').click();
            return false;
        }
    });

    getAll(module,columns);

    $('.pagination .disabled a, .pagination .active a').on('click', function(e) {
        e.preventDefault();
    });

    // go to page
    $(document).on('click', '.to-page', function () {
        var pageNum = $(this).attr('data-page');

        changeUrlParam('page', pageNum);
        getAll(module,columns);
    });
});