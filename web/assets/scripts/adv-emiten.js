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
            var param = {};
            param[pair[0]] = pair[1];

            keys.push(param);
        }
        return keys;
    }
    return(false);
}

$('#search-emiten').select2({

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
                module: 'advertising/categories/root',
                method: 'get',
                field: 'name'.split('#')
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
                var elms = $('.adv-emiten-search').removeClass('col-md-12').addClass('col-md-10');
                elms += $('.button-adv-emiten').addClass('col-md-2');
                elms += $('.button-adv-emiten a.add-btn').css('visibility', 'visible');

                return {
                    results: elms
                }
            }
        },
        cache: true,
    },
    escapeMarkup: function (markup) { return markup; },
    minimumInputLength: 2
}).on("select2:closing", function () {
    var searchTerms = $('span.select2-search.select2-search--dropdown input.select2-search__field').val();
    localStorage.setItem("searchTerms", searchTerms);
});

getEmiten();

function getEmiten() {
    var data = {
        module : 'advertising/categories/root',
        method: 'get',
        params: getQueryVariable()
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
            $('#emiten-body').html(tr);
        }
    });
}

$(document).on('click', '#emiten-body .detail-btn', function () {
    var id = $(this).closest('tr').data('id');
    var emiten = $(this).closest('tr').find("td:eq(1)").text();
    $('#detail-emiten.modal').modal({show: true, backdrop: 'static'});
    $('#detail-emiten.modal form input[name="name"]').val(emiten);
    $('#detail-emiten.modal form input[name="id"]').val(id);
});

$(document).on('click', '#detail-emiten .edit', function () {
    var id = $('#detail-emiten form input[name="id"]').val();
    $.ajax({
        url: '/api',
        data: {
            module: 'advertising/categories/'+id,
            method: 'put',
            params: jQuery('#detail-emiten form').serializeArray()
        },
        type: 'POST',
        success: function (successData, textStatus, jqXHR) {
            successData = JSON.parse(successData);
            var td1 = successData.name;

            $('tr[data-id="'+id+'"]').find("td:eq(1)").text(td1);
            if (jqXHR.status === 200) {
                $('#detail-emiten').modal('hide');
                toastr.success(td1+' successfully updated');
            } else {
                toastr.error('Error when updating your data');
            }
        }
    });
});

$(document).on('click', '.button-adv-emiten .add-btn', function () {
    var searchTerms = localStorage.getItem("searchTerms");
    $('form.add input#name').val(searchTerms);
    $('#emiten-add.modal').modal({show: true, backdrop: 'static'});
});

$(document).on('keyup', '.select2-search__field', function (e) {
    if (e.which === 13) {
        if (!$('body').hasClass("modal-open")) {
            $("#search-emiten").select2("close");
            $('.button-adv-emiten .add-btn').trigger('click');
        }
        return false;
    }
});

$(document).on('click', '#emiten-add .save', function () {
    $.ajax({
        url: '/api',
        data: {
            module: 'advertising/categories',
            method: 'post',
            params: jQuery('#emiten-add form').serializeArray()
        },
        type: 'POST',
        success: function (successData, textStatus, jqXHR) {
            if (jqXHR.status === 200) {
                getEmiten();
                toastr.success('Data successfully added');
                $('#emiten-add.modal form input').val('');
                $('#emiten-add.modal').modal('hide');
            } else {
                toastr.error('Error when saving your data');
            }
        }
    });
});

$(document).on('click', '#emiten-body .delete-btn', function () {
    var module = 'advertising/categories';
    var id = $(this).closest('tr').data('id');
    var elm = jQuery('#emiten-body tr[data-id="'+id+'"]');
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
                    del(module, id, 'emiten-body');
                }
            }
        });
    }, 20);
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
            elm.hide('slow', function(){ elm.remove(); getEmiten(); });
            toastr.success('Data successfully deleted');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error when deleting your data');
            elm.removeClass('bg-red');
        }
    });

}