(function (Bisnis) {
    Bisnis.Billing.Identities = {};

    // fetch grid and pagination
    Bisnis.Billing.Identities.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'billing/identities',
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
        Bisnis.Util.Storage.store('BILLING_IDENTITIES_CURRENT_PAGE', pageNum);
        Bisnis.Billing.Identities.fetchAll([{page: pageNum}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#identitiesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
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
                    Bisnis.Util.Grid.renderRecords('#identitiesList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#identitiesList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA PENANDA TAGIH');
            }
        );
    };

    loadGrid(1);

    Bisnis.Util.Event.bind('click', '#identitiesPagination .pagePrevious', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#identitiesPagination .pageNext', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#identitiesPagination .pageFirst', function () {
        loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#identitiesPagination .pageLast', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end fetch grid and pagination

    // search box
    var params = {
        placeholder: 'CARI KODE / PENANDA TAGIH',
        module: 'billing/identities/',
        fields: [
            {
                field: 'code',
                label: 'Kode'
            },
            {
                field: 'name',
                label: 'Penanda Tagih'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchIdentities', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddIdentity');
            if (hasResultCallback) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }, function (selectedCallback) {
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddIdentity');
            if (openCallback === false) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddIdentity');
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
    Bisnis.Util.Event.bind('click', '#btnAddIdentity', function () {
        var parent = {
            placeholder: 'CARI PENANDA TAGIH',
            module: 'billing/identities',
            prependValue: '/api/billing/identities/',
            allowClear: true,
            fields: [
                {
                    field: 'name',
                    label: 'Penanda Tagih'
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

        Bisnis.Billing.Identities.add(params,
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

    Bisnis.Billing.Identities.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'billing/identities',
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
        Bisnis.Util.Storage.store('BILLING_IDENTITIES_ID', id);
        Bisnis.Billing.Identities.fetchById(id,
            function (dataResponse) {
                if (dataResponse.parent) {
                    var userElm = document.getElementById('detailParent');
                    userElm.innerHTML = '<option value="/api/billing/identities/'+dataResponse.parent.id+'">'+dataResponse.parent.name+'</option>';
                    Bisnis.Util.Event.bind('change', '#detailParent');
                }

                var parent = {
                    placeholder: 'CARI PENANDA TAGIH',
                    module: 'billing/identities',
                    prependValue: '/api/billing/identities',
                    allowClear: true,
                    fields: [
                        {
                            field: 'name',
                            label: 'Penanda Tagih'
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
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA PENANDA TAGIH');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
    });

    Bisnis.Billing.Identities.fetchById = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'billing/identities/' + id,
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

    Bisnis.Billing.Identities.updateById = function (id, params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'billing/identities/' + id,
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
        var id = Bisnis.Util.Storage.fetch('BILLING_IDENTITIES_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Billing.Identities.updateById(id, params,
            function () {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailModal');
                var page = Bisnis.Util.Storage.fetch('BILLING_IDENTITIES_CURRENT_PAGE');
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
    Bisnis.Util.Event.bind('click', '.btn-delete', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Billing.Identities.delete(id,
                    function () {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('BILLING_IDENTITIES_CURRENT_PAGE');
                        loadGrid(page);
                    }, function () {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                )
            }
        });
    });

    Bisnis.Billing.Identities.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'billing/identities/' + id,
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