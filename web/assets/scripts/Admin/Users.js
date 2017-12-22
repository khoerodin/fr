(function (Bisnis) {
    Bisnis.Admin.Users = {};

    Bisnis.Admin.Users.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'users',
            method: 'get',
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

    // load users list / grid
    var loadGrid = function (pageNum) {
        pageNum = (!pageNum || 'null' === pageNum ) ? 1 : pageNum;
        Bisnis.Util.Storage.store('USERS_CURRENT_PAGE', pageNum);
        Bisnis.Admin.Users.fetchAll([{page: pageNum}, {order: {fullname: 'ASC'}}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#usersPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.fullname },
                            { value: memberData.username },
                            { value: memberData.email },
                            { value: memberData.enabled, format: function (enabled) {
                                return enabled ? '<span class="label label-success">AKTIF</span>' : '<span class="label label-danger">TIDAK</span>';
                            } },
                            { value: memberData.id, format: function (id) {
                                return '<span class="pull-right">' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail-user" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete-user" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                    '<button data-id="' + id + '" data-user-fullname="' + memberData.fullname + '" class="btn btn-xs btn-default btn-flat btn-roles" title="HAK AKSES"><i class="fa fa-lock"></i></button>' +
                                    '</span>';
                            }}
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#usersList', records, pageNum,
                        function (rowTable, row) {
                            return rowTable + '<tr id="'+ row[row.length - 1].value +'">';
                        }
                    );
                } else {
                    Bisnis.Util.Document.putHtml('#usersList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMUAT DATA PENGGUNA');
            }
        );
    };

    loadGrid(1);

    Bisnis.Util.Event.bind('click', '#usersPagination .pagePrevious', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#usersPagination .pageNext', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#usersPagination .pageFirst', function () {
        loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#usersPagination .pageLast', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end load users list / grid

    // search box
    var params = {
        placeholder: 'CARI NAMA / USERNAME / EMAIL',
        module: 'users',
        fields: [
            {
                field: 'fullname',
                label: 'Nama'
            },
            {
                field: 'username',
                label: 'Username'
            },
            {
                field: 'email',
                label: 'Email'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchUsers', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddUser');
            hasResultCallback ? btn.disabled = true : btn.disabled = false;
        }, function (selectedCallback) {
            loadUserDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddUser');
            openCallback ? btn.disabled = true : btn.disabled = false;
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddUser');
            setTimeout(function () {
                closeCallback ? btn.disabled = true : btn.disabled = false;
            }, 300);
        }
    );
    // end search box

    // add modal
    Bisnis.Util.Event.bind('click', '#btnAddUser', function () {
        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addFullname').focus();
        Bisnis.Util.CheckToggle.render('#addEnabled');
    });

    Bisnis.Util.Event.bind('click', '#btn-add-user', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Admin.Users.add(params,
            function () {
                Bisnis.Util.Dialog.hideModal('#addModal');
                loadGrid(1);
                thisBtn.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('addForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            }
        );
    });

    Bisnis.Admin.Users.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'users',
            method: 'post',
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
    // end add modal

    // detail modal
    var loadUserDetail = function (id) {
        console.log(id)
        Bisnis.Util.Storage.store('USER_ID', id);
        Bisnis.Admin.Users.fetchById(id,
            function (dataResponse) {
                var fullnameElem = document.getElementById('detailFullname');
                fullnameElem.value = dataResponse.fullname;
                fullnameElem.focus();

                var emailElem = document.getElementById('detailEmail');
                emailElem.value = dataResponse.email;

                document.getElementById('detailEnabled').checked = dataResponse.enabled;
                Bisnis.Util.CheckToggle.render('#detailEnabled');
                Bisnis.Util.Dialog.showModal('#detailModal');
            }, function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMUAT DATA PENGGUNA');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-detail-user', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadUserDetail(id);
    });

    Bisnis.Admin.Users.fetchById = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'users/' + id,
            method: 'get'
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

    Bisnis.Util.Event.bind('click', '#btn-update-user', function () {
        var id = Bisnis.Util.Storage.fetch('USER_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Admin.Users.updateById(id, params,
            function () {
                Bisnis.successMessage('Berhasil memperbarui data');
                let password = document.querySelector('#detailPassword').value;
                if ( password ) {
                    var params = [ { name : 'plainPassword', value : password } ];
                    Bisnis.Admin.Users.changePassword(params,
                        function () {
                            window.toastr.success('Berhasil memperbarui Sandi');
                        },
                        function () {
                            Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMPERBARUI SANDI');
                        }
                    );
                }

                Bisnis.Util.Dialog.hideModal('#detailModal');
                var page = Bisnis.Util.Storage.fetch('USER_CURRENT_PAGE');
                loadGrid(page);
                thisBtn.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('detailForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            }
        );
    });
    // end detail modal

    // delete
    Bisnis.Util.Event.bind('click', '.btn-delete-user', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Admin.Users.delete(id,
                    function () {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('USER_CURRENT_PAGE');
                        loadGrid(page);
                    }, function () {
                        Bisnis.errorMessage('Gagal menghapus data');
                    })
            }
        });
    });

    Bisnis.Admin.Users.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'users/' + id,
            method: 'delete'
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
    // end delete

    // prevent submit form on enter
    Bisnis.Util.Event.bind('keypress', '#addForm, #detailForm', function (e) {
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            Bisnis.Util.Dialog.alert("PERHATIAN", "SILAKAN TEKAN TOMBOL SIMPAN");
            e.preventDefault();
        }
    });
    // end prevent submit form on enter

    // reset modal form on modal hidden
    Bisnis.Util.Dialog.hiddenModal('#addModal', function () {
        Bisnis.Util.Grid.removeErrorForm('addForm');
        document.getElementById("addForm").reset();
        Bisnis.Util.Style.resetSelect('#addForm select');
    });
    Bisnis.Util.Dialog.hiddenModal('#detailModal', function () {
        Bisnis.Util.Grid.removeErrorForm('detailForm');
        document.getElementById("detailForm").reset();
        Bisnis.Util.Style.resetSelect('#detailForm select');
    });
    // end reset modal form on modal hidden

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
        } else {
            document.querySelector('#rolesPagination').innerHTML = '';
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

    Bisnis.Util.Event.bind('click', '.btn-roles', function () {
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
