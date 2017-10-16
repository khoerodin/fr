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

    var responses = function (firstResponse, secondResponse) {
        let roles = [];
        secondResponse.forEach(function (val) {
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
        firstResponse.forEach(function (val, idx) {
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
    };

    let rolesResponse = function (roleResponses, userId, pageNum) {

        responses(roleResponses.firstResponse['hydra:member'], roleResponses.secondResponse['hydra:member']);

        let rolesCheck = 'ABC';

        document.querySelector('tbody#roles-check').innerHTML = rolesCheck;
        Bisnis.Util.CheckToggle.render('.check-role');

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
})(window.Bisnis || {});
