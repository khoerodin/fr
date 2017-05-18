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

function requestResponse(data, method, module, columns, action, trid) {
    jQuery('div .has-error').removeClass('has-error');
    jQuery('p.help-block').remove();

    if(method === 'post'){

        var arr = JSON.parse(data);
        if ("violations" in arr) {

            $.each(arr, function (index, value) {
                if(index === 'violations'){
                    $.each(value, function (idx, val) {
                        jQuery('.'+module+'.add.form #'+val.propertyPath).parent('div').addClass('has-error');
                        jQuery( '<p class="help-block">'+val.message+'</p>' ).insertAfter( '.'+module+'.add.form #'+val.propertyPath );
                    });
                }
            });

        } else {
            history.pushState(false,false,document.location.origin+'/users');
            get(module,columns);
            jQuery('.'+module+'.add-modal.modal').modal('hide');
        }

    } else if (method === 'put') {

        var mod = module.replace(/[^\/]*$/, '');
        mod = mod.replace(/\/+$/, '');
        var arr = JSON.parse(data);
        if ("violations" in arr) {

            $.each(arr, function (index, value) {
                if (index === 'violations') {
                    $.each(value, function (idx, val) {
                        jQuery('.' + mod + '.edit.form #' + val.propertyPath).parent('div').addClass('has-error');
                        jQuery('<p class="help-block">' + val.message + '</p>').insertAfter('.' + mod + '.edit.form #' + val.propertyPath);
                    });
                }
            });
        } else {
            jQuery('.'+mod+'.edit-modal.modal').modal('hide');
        }

    } else if (method === 'get' && columns.length > 0) {

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
                        tr += '<td>'+val[v]+'</td>';
                    });

                    tr += '<td>';
                    tr += '<button data-id="'+val.id+'" class="'+module+' detail-btn btn btn-success btn-xs btn-flat">Details</button>';
                    tr += '<button data-id="'+val.id+'" class="'+module+' edit-btn btn btn-warning btn-xs btn-flat">Edit</button>';
                    tr += '<button data-id="'+val.id+'" class="'+module+' delete-btn btn btn-danger btn-xs btn-flat">Delete</button>';
                    tr += '</td>';
                    tr += '</tr>';
                });
                jQuery('.'+module+'.tbody').html(tr);
            }

            if(index === 'hydra:view') {
                var paging = '';
                $.each(value, function (idx, val) {
                    page = getQueryVariable('page',val);
                    if(idx.startsWith('hydra')){
                        if(idx.endsWith('first')) {
                            paging += '<li><span class="to-page" data-page="'+page+'" title="First page">FIRST</span></li>';
                        }
                    }
                });

                $.each(value, function (idx, val) {
                    page = getQueryVariable('page',val);
                    if(idx.startsWith('hydra')){
                        if(idx.endsWith('next')) {
                            paging += '<li><span class="to-page" data-page="'+page+'" title="Next page">NEXT</span></li>';
                        }
                    }
                });

                $.each(value, function (idx, val) {
                    page = getQueryVariable('page',val);
                    if(idx.startsWith('hydra')){
                        if(idx.endsWith('last')) {
                            paging += '<li><span class="to-page" data-page="'+page+'" title="Last page">LAST</span></li>';
                        }
                    }
                });

                jQuery('ul.'+module+'.pagination').html(paging);
            }
        });

    } else if (method === 'get' && columns.length < 1) {

        var mod = module.replace(/[^\/]*$/, '');
            mod = mod.replace(/\/+$/, '');

        arr = JSON.parse(data);
        $.each(arr, function (index, value) {
            if(typeof value === 'object') {
                //
            } else if (index.indexOf('@') <= -1) {
                if(action === 'edit') {
                    jQuery('.'+mod+'.'+action+'-modal.modal input[type="checkbox"]').prop('disabled', false);
                    jQuery('.'+mod+'.'+action+'-modal.modal input[type="email"]').prop('readonly', false);
                    jQuery('.'+mod+'.'+action+'-modal.modal input').prop('readonly', false);
                }

                if( value === true ){
                    jQuery('.'+mod+'.'+action+'-modal.modal input[type="checkbox"]#'+index).prop('checked', true);
                } else if(value === false ) {
                    jQuery('.'+mod+'.'+action+'-modal.modal input[type="checkbox"]#'+index).prop('checked', false);
                } else {
                    jQuery('.' + mod + '.' + action + '-modal.modal input#' + index).val(value).removeClass('loading').attr('placeholder', index);
                }

                jQuery('.' + mod + '.' + action + '-modal.modal input#plainPassword').val('').removeClass('loading').attr('placeholder', 'Leave blank if dont want to change');

            }
        });

    } else if (method === 'delete') {
        mod = module.replace(/[^\/]*$/, '');
        mod = mod.replace(/\/+$/, '');

        var target = jQuery('.'+mod+'.tbody tr#'+trid);
        target.hide('slow', function(){ target.remove(); });
    }
}

function getQueryVariable(variable, query = window.location.search.substring(1))
{
    //var query = window.location.search.substring(1);
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
            //console.log(e);
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

function request(module, params, method, columns = [], action, trid) {

   if(method == 'get') {
       par = getQueryVariable();
   } else {
       par = jQuery(params).serializeArray();
   }

    var data = {
        'module' : module,
        'params' : par,
        'method' : method
    };

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {
            if(columns.length > 0) {
                jQuery('.'+module+'.tbody').html('<tr><td colspan="'+columns.length + 2+'">Loading data....</td></tr>');
            }
        },
        success: function (data, textStatus, jqXHR) {
            requestResponse(data, method, module, columns, action, trid);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function get(module, columns = []) {
    request(module, {}, 'get', columns);
}

function first(module, action) {
    request(module, {}, 'get', [], action);
}

function del(module, id) {
    request(module, {}, 'delete', [], 'delete', id);
}

jQuery(function($) {

    // Add form
    $(document).on('click', '.box-header .'+window.module+'.add-btn', function () {
        $('.'+window.module+'.add-modal.modal').modal({show: true, backdrop: 'static'});
        jQuery(this).css('visibility', 'hidden');
    });

    // Detail modal
    $(document).on('click', '.'+window.module+'.tbody .'+window.module+'.detail-btn', function () {
        jQuery('.'+window.module+'.detail-modal.modal input').val('').addClass('loading').prop('readonly', true).attr('placeholder','Loading...');
        jQuery('.'+window.module+'.detail-modal.modal input[type="checkbox"]').prop('checkbox', false).prop('disabled', true);
        jQuery('.'+window.module+'.detail-modal.modal').modal({show: true, backdrop: 'static'});

        var id = $(this).attr('data-id');
        first(module+'/'+id, 'detail');
    });

    // Edit form
    $(document).on('click', '.'+window.module+'.tbody .'+window.module+'.edit-btn', function () {
        var id = $(this).attr('data-id');
        var target = jQuery('.'+window.module+'.tbody tr#'+id);
        target.addClass('bg-red');

        jQuery('.'+window.module+'.edit-modal.modal input').val('').addClass('loading').prop('readonly', true).attr('placeholder','Loading...');
        jQuery('.'+window.module+'.edit-modal.modal input[type="checkbox"]').prop('checkbox', false).prop('disabled', true);
        jQuery('.'+window.module+'.edit-modal.modal').modal({show: true, backdrop: 'static'});


        first(module+'/'+id, 'edit');
    });

    // Delete action
    $(document).on('click', '.'+window.module+'.tbody .'+window.module+'.delete-btn', function () {
        var module = window.module;
        var id = $(this).attr('data-id');
        var elm = jQuery('.'+module+'.tbody tr#'+id);
        elm.addClass('bg-red');
        setTimeout(function(){
            if (confirm('Are you sure you want to delete this data?')) {
                del(module+'/'+id, id);
            } else {
                elm.removeClass('bg-red');
            }
        },20);
    });

    // save action
    $(document).on('click', '.'+window.module+'.add-modal.modal .'+window.module+'.save.btn', function () {
        var module = window.module;
        var params = $('.'+module+'.add.form');

        request(module,params,'post',columns);
    });

    // edit action
    $(document).on('click', '.'+window.module+'.edit-modal.modal .'+window.module+'.edit.btn', function () {
        var module = window.module;
        var params = $('.'+module+'.edit.form');

        var id = $('.'+module+'.edit.form input#id').val();
        request(module+'/'+id, params, 'put');
    });

    $('.'+window.module+'.modal').on('hidden.bs.modal', function () {
        $(this).find('input,textarea,select').val('').end();
        $(this).find('input[type="checkbox"]').prop('checked', false).end();
        $('div .has-error').removeClass('has-error');
        $('p.help-block').remove();
    });

    $(document).on('keypress', '.'+window.module+'.add.form input', function (e) {
        if (e.which === 13) {
            $('.'+window.module+'.save.btn').click();
            return false;
        }
    });

    $(document).on('keypress', '.'+window.module+'.edit.form input', function (e) {
        if (e.which === 13) {
            $('.'+window.module+'.edit.btn').click();
            return false;
        }
    });

    get(module,columns);

    $('.pagination .disabled a, .pagination .active a').on('click', function(e) {
        e.preventDefault();
    });

    // go to page
    $(document).on('click', '.to-page', function () {
        var pageNum = $(this).attr('data-page');

        changeUrlParam('page', pageNum);
        get(module,columns);
    });
});