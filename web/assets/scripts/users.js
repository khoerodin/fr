window.module = 'users';
window.field = 'username';
var columns = [
    'fullname',
    'username',
    'email'
];

jQuery('.'+window.module+'.roles-modal.modal').on('hidden.bs.modal', function (e) {
    jQuery('tbody#roles-check').html('<tr><td colspan="6">Loading...</td></tr>');
})

// Roles form
$(document).on('click', 'tbody.'+window.module+' .'+window.module+'.roles-btn', function () {
    var id = $(this).attr('data-id');
    var fullname = $(this).attr('data-user-fullname');
    jQuery('.modal-title.roles span').text(fullname);
    jQuery('.'+window.module+'.roles-modal.modal input[type="checkbox"]').prop('checkbox', false).prop('disabled', true);
    jQuery('.'+window.module+'.roles-modal.modal').modal({show: true, backdrop: 'static'});

    var par = {
        'user.id' : id
    }

    var data = {
        module : 'roles',
        method : 'get',
        params : par
    };

    $.ajax({
        url: "/api/roles",
        type: "POST",
        data: data,
        beforeSend: function () {},
        success: function (data, textStatus, jqXHR) {
            jQuery('.'+window.module+'.roles-modal.modal input[type="checkbox"]').prop('disabled', false);
            rolesResponse(data, id);
        },
        error: function (jqXHR, textStatus, errorThrown) {}
    });

});

$(document).on('change', '.check-role', function () {
    checkName = $(this).attr('name');
    rolesId = $(this).attr('data-id');
    userId = $('#userid').val();
    moduleId = $(this).closest('tr').find('input.moduleId').val();
    console.log(moduleId);

    if ($(this).is(':checked')){
        checkValue = 1;
    } else {
        checkValue = 0;
    }

    var check = {
        'name' : checkName,
        'value' : checkValue
    };

    var user = {
        'name' : 'user',
        'value' : '/api/users/'+userId
    };

    var module = {
        'name' : 'module',
        'value' : '/api/modules/'+moduleId
    };

    par = [
        check,
        user,
        module
    ];

    var data = {
        module : 'roles/'+rolesId,
        method : 'put',
        params : par
    };

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {},
        success: function (data, textStatus, jqXHR) {
            toastr.success('Role successfully changed')
        },
        error: function (jqXHR, textStatus, errorThrown) {}
    });
});

function rolesResponse(data, id) {
    arr = JSON.parse(data);
    var rolesColumns = [
        'module.name',
        'addable',
        'editable',
        'viewable',
        'deletable'
    ];

    $.each(arr, function (index, value) {
        if(index === 'hydra:member'){
            var tr = '';
            $.each(value, function (idx, val) {

                no = idx+1;
                tr += '<tr id="'+val.id+'">';
                tr += '<td>'+no+'</td>';
                $.each(rolesColumns, function (i,v) {
                    var v1 = v.split(".")[0];
                    var v2 = v.split(".")[1];

                    if (val[v1] instanceof Object) {
                        $.each(val[v1], function(ind, vl) {

                            if(ind == 'id'){
                                tr += '<input type="hidden" value="'+vl+'" class="moduleId">';
                            }

                            if(ind == v2){
                                tr += '<td>'+vl+'</td>';
                            }
                        })
                    } else {
                        tr += '<td>';
                        if(v === 'addable') {
                            if (val[v1] == true) {
                                tr += '<input data-id="'+val.id+'" name="addable" class="check-role" type="checkbox" checked data-toggle="toggle" data-size="mini" data-onstyle="success">';
                            } else if(val[v1] == false) {
                                tr += '<input data-id="'+val.id+'" name="addable" class="check-role" type="checkbox" data-toggle="toggle" data-size="mini" data-onstyle="success">';
                            }
                        } else if(v === 'editable') {
                            if (val[v1] == true) {
                                tr += '<input data-id="'+val.id+'" name="editable" class="check-role" type="checkbox" checked data-toggle="toggle" data-size="mini" data-onstyle="success">';
                            } else if(val[v1] == false) {
                                tr += '<input data-id="'+val.id+'" name="editable" class="check-role" type="checkbox" data-toggle="toggle" data-size="mini" data-onstyle="success">';
                            }
                        } else if(v === 'viewable') {
                            if (val[v1] == true) {
                                tr += '<input data-id="'+val.id+'" name="viewable" class="check-role" type="checkbox" checked data-toggle="toggle" data-size="mini" data-onstyle="success">';
                            } else if(val[v1] == false) {
                                tr += '<input data-id="'+val.id+'" name="viewable" class="check-role" type="checkbox" data-toggle="toggle" data-size="mini" data-onstyle="success">';
                            }
                        } else if(v === 'deletable') {
                            if (val[v1] == true) {
                                tr += '<input data-id="'+val.id+'" name="deletable" class="check-role" type="checkbox" checked data-toggle="toggle" data-size="mini" data-onstyle="success">';
                            } else if(val[v1] == false) {
                                tr += '<input data-id="'+val.id+'" name="deletable" class="check-role" type="checkbox" data-toggle="toggle" data-size="mini" data-onstyle="success">';
                            }
                        } else {
                            tr += val[v1];
                        }
                        tr += '</td>';
                    }

                });

                tr += '</tr>';
                tr += '<input type="hidden" value="'+id+'" id="userid">';
            });
            jQuery('tbody#roles-check').html(tr);
            $('.check-role').bootstrapToggle();
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

            jQuery('ul.'+module+'.pagination').html(paging);
        }
    });
}