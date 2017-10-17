(function (Bisnis) {
    Bisnis.Admin.Clients = {};

    // fetch grid and pagination
    Bisnis.Admin.Clients.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'clients',
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

    var loadGrid = function (pageNum) {
        pageNum = (!pageNum || 'null' === pageNum ) ? 1 : pageNum;
        Bisnis.Util.Storage.store('ADMIN_CLIENTS_CURRENT_PAGE', pageNum);
        Bisnis.Admin.Clients.fetchAll([{page: pageNum}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#clientsPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.name },
                            { value: memberData.email },
                            { value: memberData.apiKey },
                            { value: (memberData.user) ? memberData.user.fullname : '-' },
                            { value: memberData.id, format: function (id) {
                                return '<span class="pull-right">' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                    '</span>';
                            }}
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#clientsList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#clientsList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA KLIEN API');
            }
        );
    };

    loadGrid(1);

    Bisnis.Util.Event.bind('click', '#clientsPagination .pagePrevious', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#clientsPagination .pageNext', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#clientsPagination .pageFirst', function () {
        loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#clientsPagination .pageLast', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end fetch grid and pagination

    // search box
    var params = {
        placeholder: 'CARI NAMA KLIEN / EMAIL',
        module: 'clients',
        fields: [
            {
                field: 'name',
                label: 'Klien'
            },
            {
                field: 'email',
                label: 'Email'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchClients', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddClient');
            hasResultCallback ? btn.disabled = true : btn.disabled = false;
        }, function (selectedCallback) {
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddClient');
            openCallback ? btn.disabled = true : btn.disabled = false;
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddClient');
            setTimeout(function () {
                closeCallback ? btn.disabled = true : btn.disabled = false;
            }, 300);
        }
    );
    // end search box

    // add modal
    Bisnis.Util.Event.bind('click', '#btnAddClient', function () {

        var users = {
            placeholder: 'CARI USERNAME PENGGUNA',
            module: 'users',
            prependValue: '/api/users/',
            allowClear: true,
            fields: [
                {
                    field: 'username',
                    label: 'Username'
                }
            ]
        };
        Bisnis.Util.Style.ajaxSelect('#addUser', users);

        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addName').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Admin.Clients.add(params,
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

    Bisnis.Admin.Clients.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'clients',
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
    var loadDetail = function (id) {
        Bisnis.Util.Storage.store('ADMIN_CLIENTS_ID', id);
        Bisnis.Admin.Clients.fetchById(id,
            function (dataResponse) {
                document.getElementById('detailName').value = dataResponse.name;
                document.getElementById('detailEmail').value = dataResponse.email;

                if (dataResponse.user) {
                    var userElm = document.getElementById('detailUser');
                    userElm.innerHTML = '<option value="/api/users/'+dataResponse.user.id+'">'+dataResponse.user.fullname+'</option>';
                    Bisnis.Util.Event.bind('change', '#detailUser');
                }

                Bisnis.Util.Style.modifySelect('#detailUser');
                var users = {
                    placeholder: 'CARI USERNAME PENGGUNA',
                    module: 'users',
                    prependValue: '/api/users/',
                    allowClear: true,
                    fields: [
                        {
                            field: 'username',
                            label: 'Username'
                        }
                    ]
                };
                Bisnis.Util.Style.ajaxSelect('#detailUser', users);
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA KLIEN API');
            }
        );

        Bisnis.Util.Dialog.showModal('#detailModal');
        document.getElementById('detailName').focus();
    };

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
    });

    Bisnis.Admin.Clients.fetchById = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'clients/' + id,
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

    Bisnis.Admin.Clients.updateById = function (id, params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'clients/' + id,
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

    Bisnis.Util.Event.bind('click', '#btn-update', function () {
        var id = Bisnis.Util.Storage.fetch('ADMIN_CLIENTS_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Admin.Clients.updateById(id, params,
            function () {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailModal');
                var page = Bisnis.Util.Storage.fetch('ADMIN_CLIENTS_CURRENT_PAGE');
                loadGrid(page);
                thisBtn.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('detailForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            });
    });
    // end detail modal

    // delete account executive manager
    Bisnis.Util.Event.bind('click', '.btn-delete', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Admin.Clients.delete(id,
                    function () {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('ADMIN_CLIENTS_CURRENT_PAGE');
                        loadGrid(page);
                    }, function () {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                )
            }
        });
    });

    Bisnis.Admin.Clients.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'clients/' + id,
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
    // end delete account executive manager

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
    });
    Bisnis.Util.Dialog.hiddenModal('#detailModal', function () {
        Bisnis.Util.Grid.removeErrorForm('detailForm');
        document.getElementById("detailForm").reset();
    });
    // end reset modal form on modal hidden

})(window.Bisnis || {});