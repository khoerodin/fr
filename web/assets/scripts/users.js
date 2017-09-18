window.module = 'users';
window.field = 'username';
var columns = [
    'fullname',
    'username',
    'email',
    // 'loggedIn'
];

$( document ).ajaxComplete(function() {
    $('.loginState').bootstrapToggle({
        size: 'mini',
        onstyle: 'success'
    });
});

$(document).on('change', '.loginState', function () {
    userId = $(this).attr('data-id');

    if ($(this).is(':checked')){
        checkValue = true;
    } else {
        checkValue = false;
    }

    var check = {
        'name' : 'loggedIn',
        'value' : checkValue
    };

    params = [
        check
    ];

    var data = {
        module : 'users/'+userId,
        method : 'put',
        params : params
    };

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {},
        success: function (data, textStatus, jqXHR) {
            toastr.success('Login status changed successfully')
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error change login status')
        }
    });
});

jQuery('div[data-modal-add="'+window.module+'"]').on('hidden.bs.modal', function (e) {
    jQuery('tbody#roles-check').html('<tr><td colspan="6">Loading...</td></tr>');
});

function getRoles(userId, serviceId, pageNum) {
    var moduleData = {
        module: 'modules',
        method: 'get',
        params: [{'page': pageNum},{'service.id': serviceId}]
    };

    var roleData = {
        module: 'roles',
        method: 'get',
        params: [{'user.id': userId},{'order[name]': 'ASC'}]
    };

    var modules;
    var roles;

    var ajax1 = $.ajax({
        url: "/api",
        type: "POST",
        data: moduleData
    });

    var ajax2 = $.ajax({
        url: "/api",
        type: "POST",
        data: roleData
    });

    $.when(ajax1, ajax2).done(function(a1, a2){

        if((a1[1] === 'success' && a2[1] === 'success')) {
            var data2 = JSON.parse(a2[0]);
            roles = [];
            $.each(data2['hydra:member'], function (idx, val) {
                roles[val.module.id] = {
                    roleId: val.id,
                    moduleName: val.module.name,
                    module: val.module.id,
                    viewable: val.viewable,
                    addable: val.addable,
                    editable: val.editable,
                    deletable: val.deletable
                };
            });

            var userRoles = [];
            var data1 = JSON.parse(a1[0]);
            $.each(data1['hydra:member'], function (idx, val) {
                if ('undefined' !== typeof roles[val.id]) {
                    userRoles[idx] = {
                        moduleName: roles[val.id].moduleName,
                        module: roles[val.id].module,
                        viewable: roles[val.id].viewable,
                        addable: roles[val.id].addable,
                        editable: roles[val.id].editable,
                        deletable: roles[val.id].deletable,
                        roleId: roles[val.id].roleId
                    };
                } else {
                    userRoles[idx] = {
                        moduleName: val.name,
                        module: val.id,
                        viewable: false,
                        addable: false,
                        editable: false,
                        deletable: false,
                        roleId: null
                    };
                }
            });

            var paging = '';
            $.each(data1['hydra:view'], function (index, value) {

                if(index.endsWith('first')) {
                    page = getQueryVariable('page',value);
                    paging += '<li><span class="to-roles-page" data-page="'+page+'" title="FIRST PAGE">FIRST</span></li>';
                }

                if(index.endsWith('previous')) {
                    page = getQueryVariable('page',value);
                    paging += '<li><span class="to-roles-page" data-page="'+page+'" title="PREVIOUS PAGE">PREVIOUS</span></li>';
                }

                if(index.endsWith('next')) {
                    page = getQueryVariable('page',value);
                    paging += '<li><span class="to-roles-page" data-page="'+page+'" title="NEXT PAGE">NEXT</span></li>';
                }

                if(index.endsWith('last')) {
                    page = getQueryVariable('page',value);
                    paging += '<li><span class="to-roles-page" data-page="'+page+'" title="LAST PAGE">LAST</span></li>';
                }
            });

            paging = '<ul data-paging="roles" class="pagination pagination-sm no-margin pull-right">'+paging+'</ul>';
            jQuery('.box-footer.roles-pagination').html(paging);


            rolesResponse(userRoles, userId, pageNum);
        }
    });
}

// Roles form
$(document).on('click', 'tbody[data-list="'+window.module+'"] .roles-btn', function () {
    var userId = $(this).attr('data-id');
    var activeId = $('#serviceTab .active a').attr('aria-controls');
    var name = $(this).closest('tr').find('td:nth-child(2)').text();
    localStorage.setItem('accessFor', name);
    $('#userId').val(userId);
    getRoles(userId, activeId);
});

$(document).on('click', '.to-roles-page', function () {
    var pageNum = $(this).attr('data-page');
    var userId = $('.roles-modal input#rolesUserId').val();
    var activeId = $('#serviceTab .active a').attr('aria-controls');
    getRoles(userId, activeId, pageNum);
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var userId = $('#userId').val();
    var activeId = $('#serviceTab .active a').attr('aria-controls');
    getRoles(userId, activeId);
});

$(document).on('change', '.check-role', function () {
    var $this = $(this);
    var checkName = $this.attr('name');
    var userId = $('#rolesUserId').val();
    var moduleId = $this.closest('tr').attr('id');
    var roleId = $this.closest('tr').attr('data-role');

    if ($(this).is(':checked')){
        var checkValue = true;
    } else {
        checkValue = false;
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

    if (roleId !== 'null') {
        var method = 'put';
        var mod = 'roles/'+roleId;
    } else {
        var method = 'post';
        var mod = 'roles';
    }


    var params = [
        check,
        user,
        module
    ];

    var data = {
        module : mod,
        method : method,
        params : params
    };

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {},
        success: function (data, textStatus, jqXHR) {
            data = JSON.parse(data);
            $this.closest('tr').attr('data-role', data.id);
            toastr.success('Role successfully changed');
        },
    });
});

function rolesResponse(data,userId,page) {

    var rolesCheck = '';
    var no = 1;
    jQuery.each(data, function (index, value) {

        if (typeof value != 'undefined') {

            if(page > 1) {
                c = page - 1;
                p = 17 * c;
                no = index+1+p;
            } else {
                no = index+1;
            }

            rolesCheck += '<tr id="'+value.module+'" data-role="'+value.roleId+'"><td>'+no+'</td>';
            if(value.moduleName) {
                rolesCheck += '<td>'+value.moduleName+'</td>'
            }

            if(value.viewable === true) {
                rolesCheck += '<td><input name="viewable" type="checkbox" class="check-role" type="checkbox" checked data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            } else {
                rolesCheck += '<td><input name="viewable" type="checkbox" class="check-role" type="checkbox" data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            }

            if(value.addable === true) {
                rolesCheck += '<td><input name="addable" type="checkbox" class="check-role" type="checkbox" checked data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            } else {
                rolesCheck += '<td><input name="addable" type="checkbox" class="check-role" type="checkbox" data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            }

            if(value.editable === true) {
                rolesCheck += '<td><input name="editable" type="checkbox" class="check-role" type="checkbox" checked data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            } else {
                rolesCheck += '<td><input name="editable" type="checkbox" class="check-role" type="checkbox" data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            }

            if(value.deletable === true) {
                rolesCheck += '<td><input name="deletable" type="checkbox" class="check-role" type="checkbox" checked data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            } else {
                rolesCheck += '<td><input name="deletable" type="checkbox" class="check-role" type="checkbox" data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            }

            rolesCheck += '</tr>';
            rolesCheck += '<input type="hidden" value="'+userId+'" id="rolesUserId">';
        }

    });

    jQuery('tbody#roles-check').html(rolesCheck);
    $('.check-role').bootstrapToggle();

    var accessFor = localStorage.getItem('accessFor');
    $('.modal-title.roles').html('HAK AKSES <strong>'+accessFor+'</strong>');

    var $this = $('.roles-modal');
    $this.modal({show: true, backdrop: 'static'});

}