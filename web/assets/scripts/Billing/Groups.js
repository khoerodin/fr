(function (Bisnis) {
    Bisnis.Billing.Groups = {};

    // fetch grid and pagination
    Bisnis.Billing.Groups.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'billing/groups',
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
        Bisnis.Util.Storage.store('BILLING_GROUPS_CURRENT_PAGE', pageNum);
        Bisnis.Billing.Groups.fetchAll([{page: pageNum}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#groupsPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.code },
                            { value: memberData.name },
                            { value: (memberData.parent) ? memberData.parent.name : '-' },
                            { value: memberData.id, format: function (id) {
                                return '<span class="pull-right">' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                    '</span>';
                            }}
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#groupsList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#groupsList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA GRUP TAGIH');
            }
        );
    };

    loadGrid(1);

    Bisnis.Util.Event.bind('click', '#groupsPagination .pagePrevious', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#groupsPagination .pageNext', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#groupsPagination .pageFirst', function () {
        loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#groupsPagination .pageLast', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end fetch grid and pagination

    // search box
    var params = {
        placeholder: 'CARI KODE / GRUP TAGIH',
        module: 'billing/groups',
        fields: [
            {
                field: 'code',
                label: 'Kode'
            },
            {
                field: 'name',
                label: 'Grup'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchGroups', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddGroup');
            if (hasResultCallback) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }, function (selectedCallback) {
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddGroup');
            if (openCallback === false) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddGroup');
            setTimeout(function () {
                if (closeCallback === false) {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }
            }, 300);
        }
    );
    // end search box

    // add modal
    Bisnis.Util.Event.bind('click', '#btnAddGroup', function () {
        var parent = {
            placeholder: 'CARI GRUP TAGIH',
            module: 'billing/groups',
            prependValue: '/api/billing/groups/',
            allowClear: true,
            fields: [
                {
                    field: 'name',
                    label: 'Grup'
                }
            ]
        };
        Bisnis.Util.Style.ajaxSelect('#addParent', parent);

        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addParent').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Billing.Groups.add(params,
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

    Bisnis.Billing.Groups.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'billing/groups',
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
        Bisnis.Util.Storage.store('BILLING_GROUPS_ID', id);
        Bisnis.Billing.Groups.fetchById(id,
            function (dataResponse) {
                if (dataResponse.parent) {
                    var userElm = document.getElementById('detailParent');
                    userElm.innerHTML = '<option value="/api/billing/groups/'+dataResponse.parent.id+'">'+dataResponse.parent.name+'</option>';
                    Bisnis.Util.Event.bind('change', '#detailParent');
                }

                var parent = {
                    placeholder: 'CARI GRUP TAGIH',
                    module: 'billing/groups',
                    prependValue: '/api/billing/groups',
                    allowClear: true,
                    fields: [
                        {
                            field: 'name',
                            label: 'Grup'
                        }
                    ]
                };
                Bisnis.Util.Style.ajaxSelect('#detailParent', parent);

                var codeElem = document.getElementById('detailCode');
                codeElem.value = dataResponse.code;
                codeElem.focus();

                var nameElem = document.getElementById('detailName');
                nameElem.value = dataResponse.name;

                Bisnis.Util.Dialog.showModal('#detailModal');
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA GRUP TAGIH');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
    });

    Bisnis.Billing.Groups.fetchById = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'billing/groups/' + id,
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

    Bisnis.Billing.Groups.updateById = function (id, params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'billing/groups/' + id,
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
        var id = Bisnis.Util.Storage.fetch('BILLING_GROUPS_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Billing.Groups.updateById(id, params,
            function () {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailModal');
                var page = Bisnis.Util.Storage.fetch('BILLING_GROUPS_CURRENT_PAGE');
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

    // delete
    Bisnis.Util.Event.bind('click', '.btn-delete', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Billing.Groups.delete(id,
                    function () {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('BILLING_GROUPS_CURRENT_PAGE');
                        loadGrid(page);
                    }, function () {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                )
            }
        });
    });

    Bisnis.Billing.Groups.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'billing/groups/' + id,
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
    });
    Bisnis.Util.Dialog.hiddenModal('#detailModal', function () {
        Bisnis.Util.Grid.removeErrorForm('detailForm');
        document.getElementById("detailForm").reset();
    });
    // end reset modal form on modal hidden

})(window.Bisnis || {});