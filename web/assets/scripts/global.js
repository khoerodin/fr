function requestResponse(data, method, module, columns) {
    $('div .has-error').removeClass('has-error');
    $('p.help-block').remove();

    var arr = JSON.parse(data);

    if(method === 'post'){

        if ("violations" in arr) {
            $.each(arr, function (index, value) {
                if(index === 'violations'){
                    $.each(value, function (idx, val) {
                        console.log(val.propertyPath+' : '+val.message);
                        $('#'+val.propertyPath).parent('div').addClass('has-error');
                        $( '<p class="help-block">'+val.message+'</p>' ).insertAfter( '#'+val.propertyPath );
                    });
                }
            });
        } else {
            //success
        }

    } else if (method === 'get') {
        $.each(arr, function (index, value) {
            if(index === 'hydra:member'){
                var tr = '';
                $.each(value, function (idx, val) {
                    var no = idx+1;
                    tr += '<tr>';
                    tr += '<td>'+no+'</td>'
                    $.each(columns, function (i,v) {
                        tr += '<td>'+val[v]+'</td>';
                    });

                    tr += '<td>';
                    tr += '<a href="#" class="users detail btn btn-success btn-xs btn-flat">Details</a>';
                    tr += '<a href="#" id="#" class="btn btn-warning btn-xs btn-flat">Edit</a>';
                    tr += '<a href="/'+module+'/delete/'+val.id+'" class="btn btn-danger btn-xs btn-flat">Delete</a>';
                    tr += '</td>';
                    tr += '</tr>';
                });
                $('.'+module+'.tbody').html(tr);
            }
        });
    }
}

function request(module,params,method,columns = []) {
    var data = {
        'module' : module,
        'params' : $(params).serializeArray(),
        'method' : method
    };

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        success: function (data, textStatus, jqXHR) {
            requestResponse(data, method, module, columns);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function getData(module,columns = []) {
    request(module,{},'get',columns);
}

jQuery(function($) {

    $(document).on('click', '.'+window.module+'.add', function () {
        $('.'+window.module+'.add.modal').modal('show');
    });

    $(document).on('click', '.'+window.module+'.detail', function () {
        $('.'+window.module+'.detail.modal').modal('show');
    });

    $('.'+window.module+'.modal').on('hidden.bs.modal', function () {
        $(this).find('input,textarea,select').val('').end();
        $('div .has-error').removeClass('has-error');
        $('p.help-block').remove();
    });

    $(document).on('keypress', '.'+window.module+'.modal input', function (e) {
        if (e.which == 13) {
            $('.'+window.module+'.save').click();
            return false;
        }
    });

    $(document).on('click', '.'+window.module+'.save', function () {
        var module = window.module;
        var params = $('.'+module+'.form');

        request(module,params,'post');
    });

    getData(module,columns);

});
