(function (Bisnis) {
    Bisnis.Admin.Users = {};

    Bisnis.Admin.Users.updateById = function (id, params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'users/' + id,
            method: 'put',
            params: params
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(successCallback)) {
                successCallback(dataResponse, textStatus, response);
            }
        }, function (response, textStatus, errorThrown) {
            if (Bisnis.validCallback(errorCallback)) {
                errorCallback(response, textStatus, errorThrown);
            }
        });
    };

    Bisnis.Admin.Users.changePassword = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'change-password',
            method: 'put',
            params: params
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(successCallback)) {
                successCallback(dataResponse, textStatus, response);
            }
        }, function (response, textStatus, errorThrown) {
            if (Bisnis.validCallback(errorCallback)) {
                errorCallback(response, textStatus, errorThrown);
            }
        });
    };

    let getRoles = function (userId, serviceId, pageNum) {
        Bisnis.Admin.Modules.fetchAll(
            [{'page': pageNum},{'service': serviceId}],
            function (dataResponse1) {
                Bisnis.Admin.Roles.fetchAll(
                    [{'user.id': userId},{'order': { 'name': 'ASC'}}],
                    function (dataResponse2) {
                        rolesResponse({firstResponse: dataResponse1, secondResponse: dataResponse2}, userId, pageNum);
                    }
                );
            }
        );
    };

    var responses = function (firstResponse, secondResponse, userId, pageNum) {
        let roles = [];
        secondResponse['hydra:member'].forEach(function (val) {
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

        let userRoles = [];
        firstResponse['hydra:member'].forEach(function (val, idx) {
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

        let viewData = firstResponse['hydra:view'];

        if ('undefined' !== typeof viewData['hydra:last']) {
            var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
            Bisnis.Util.Grid.createPagination('#rolesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
        }

        Bisnis.Util.Event.bind('click', '#rolesPagination .pagePrevious', function () {
            var userId = document.querySelector('#userId').value;
            var activeId = document.querySelector('#serviceTab .active a').getAttribute('aria-controls');
            getRoles(userId, activeId, Bisnis.Util.Document.getDataValue(this, 'page'));
        });

        Bisnis.Util.Event.bind('click', '#rolesPagination .pageNext', function () {
            var userId = document.querySelector('#userId').value;
            var activeId = document.querySelector('#serviceTab .active a').getAttribute('aria-controls');
            getRoles(userId, activeId, Bisnis.Util.Document.getDataValue(this, 'page'));
        });

        Bisnis.Util.Event.bind('click', '#rolesPagination .pageFirst', function () {
            var userId = document.querySelector('#userId').value;
            var activeId = document.querySelector('#serviceTab .active a').getAttribute('aria-controls');
            getRoles(userId, activeId, Bisnis.Util.Document.getDataValue(this, 'page'));
        });

        Bisnis.Util.Event.bind('click', '#rolesPagination .pageLast', function () {
            var userId = document.querySelector('#userId').value;
            var activeId = document.querySelector('#serviceTab .active a').getAttribute('aria-controls');
            getRoles(userId, activeId, Bisnis.Util.Document.getDataValue(this, 'page'));
        });

        renderResponse(userRoles, userId, pageNum);
    };

    let renderResponse = function (userRoles, userId, pageNum) {
        let rolesCheck = '';
        userRoles.forEach(function (value, index) {

            let currentSeq = '';
            if (pageNum) {
                currentSeq = ( pageNum - 1 ) * 17 + index +1;
            } else {
                currentSeq = ( 1 - 1 ) * 17 + index +1;
            }

            rolesCheck += '<tr id="'+value.module+'" data-role="'+value.roleId+'"><td>'+currentSeq+'</td>';
            if(value.moduleName) {
                rolesCheck += '<td>'+value.moduleName+'</td>'
            }

            if(value.viewable) {
                rolesCheck += '<td><input name="viewable" type="checkbox" class="check-role" type="checkbox" checked data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            } else {
                rolesCheck += '<td><input name="viewable" type="checkbox" class="check-role" type="checkbox" data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            }

            if(value.addable) {
                rolesCheck += '<td><input name="addable" type="checkbox" class="check-role" type="checkbox" checked data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            } else {
                rolesCheck += '<td><input name="addable" type="checkbox" class="check-role" type="checkbox" data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            }

            if(value.editable) {
                rolesCheck += '<td><input name="editable" type="checkbox" class="check-role" type="checkbox" checked data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            } else {
                rolesCheck += '<td><input name="editable" type="checkbox" class="check-role" type="checkbox" data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            }

            if(value.deletable) {
                rolesCheck += '<td><input name="deletable" type="checkbox" class="check-role" type="checkbox" checked data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            } else {
                rolesCheck += '<td><input name="deletable" type="checkbox" class="check-role" type="checkbox" data-toggle="toggle" data-size="mini" data-onstyle="success"></td>';
            }

            rolesCheck += '</tr>';
            rolesCheck += '<input type="hidden" value="'+userId+'" id="rolesUserId">';
        });

        document.querySelector('.tab-pane.active #roles-check').innerHTML = rolesCheck;
        Bisnis.Util.CheckToggle.render('.check-role');
    };

    let rolesResponse = function (roleResponses, userId, pageNum) {
        responses(roleResponses.firstResponse, roleResponses.secondResponse, userId, pageNum);
        let accessFor = window.localStorage.getItem('accessFor');
        document.querySelector('.modal-title.roles').innerHTML = 'HAK AKSES <strong>'+accessFor+'</strong>';
        Bisnis.Util.Dialog.showModal('#rolesModal');
    };

    Bisnis.Util.Event.bind('click', '.roles-btn', function () {
        var userId = this.getAttribute('data-id');
        var activeId = document.querySelector('#serviceTab .active a').getAttribute('aria-controls');
        var name = this.closest('tr').childNodes[1].innerText;
        window.localStorage.setItem('accessFor', name);
        document.querySelector('#userId').value = userId;
        getRoles(userId, activeId);
    });

    Bisnis.Util.Event.bind('click', '.to-roles-page', function () {
        var pageNum = this.getAttribute('data-page');
        var userId = document.querySelector('.roles-modal input#rolesUserId').value;
        var activeId = document.querySelector('#serviceTab .active a').getAttribute('aria-controls');
        getRoles(userId, activeId, pageNum);
    });

    Bisnis.Util.Event.bind('shown.bs.tab', 'a[data-toggle="tab"]', function () {
        var userId = document.querySelector('#userId').value;
        var activeId = document.querySelector('#serviceTab .active a').getAttribute('aria-controls');
        getRoles(userId, activeId);
    });

    Bisnis.Util.Dialog.hiddenModal('#rolesModal', function () {
        document.querySelector('tbody#roles-check').innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    });

    Bisnis.Util.Event.bind('change', '.check-role', function () {
        let checkName = this.getAttribute('name');
        let userId = document.querySelector('#rolesUserId').value;
        let moduleId = this.closest('tr').getAttribute('id');
        let roleId = this.closest('tr').getAttribute('data-role');
        let checkValue = this.checked;

        let params = [
            {
                'name' : checkName,
                'value' : checkValue
            },
            {
                'name' : 'user',
                'value' : '/api/users/'+userId
            },
            {
                'name' : 'module',
                'value' : '/api/modules/'+moduleId
            }
        ];

        let $this = this;
        if ( roleId === 'null') {
            Bisnis.Admin.Roles.add(params,
                function (dataResponse) {
                    $this.closest('tr').setAttribute('data-role', dataResponse.id);
                    window.toastr.success('Hak Akses berhasil diperbarui');
                },
                function () {
                    Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMPERBARUI HAK AKSES');
                }
            );
        } else {
            Bisnis.Admin.Roles.updateById(roleId, params,
                function (dataResponse) {
                    $this.closest('tr').setAttribute('data-role', dataResponse.id);
                    window.toastr.success('Hak Akses berhasil diperbarui');
                },
                function () {
                    Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMPERBARUI HAK AKSES');
                }
            );
        }
    });
})(window.Bisnis || {});
