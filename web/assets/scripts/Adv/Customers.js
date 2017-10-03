(function (Bisnis) {
    Bisnis.Adv.Customers= {};

    // fetch grid and pagination
    Bisnis.Adv.Customers.fetchAll = function (params, callback) {
        Bisnis.request({
            module: 'advertising/customers',
            method: 'get',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);

            if (Bisnis.validCallback(callback)) {
                callback(rawData);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };

    var loadGrid = function (pageNum) {
        var pageNum =
            (isNaN(pageNum) || 'undefined' === typeof pageNum || 'null' === pageNum ) ? 1 : parseInt(pageNum);
        Bisnis.Util.Storage.store('ADV_CUSTOMERS_CURRENT_PAGE', pageNum);
        Bisnis.Adv.Customers.fetchAll([{page: pageNum}], function (rawData) {
            var memberData = rawData['hydra:member'];
            var viewData = rawData['hydra:view'];

            if ('undefined' !== typeof viewData['hydra:last']) {
                var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                Bisnis.Util.Grid.createPagination('#customersPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
            }

            if (memberData.length > 0) {
                var records = [];
                Bisnis.each(function (idx, memberData) {
                    records.push([
                        { value: memberData.code },
                        { value: memberData.name },
                        { value: memberData.representative.name },
                        { value: memberData.city.name },
                        { value: memberData.postalCode },
                        { value: memberData.phoneNumber },
                        { value: memberData.id, format: function (id) {
                            return '<span class="pull-right">' +
                                '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                '</span>';
                        }}
                    ]);
                }, memberData);
                Bisnis.Util.Grid.renderRecords('#customersList', records);
            } else {
                Bisnis.Util.Document.putHtml('#customersList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
            }
        });
    };

    loadGrid(1);

    Bisnis.Util.Event.bind('click', '#customersPagination .pagePrevious', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#customersPagination .pageNext', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#customersPagination .pageFirst', function () {
        loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#customersPagination .pageLast', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end fetch grid and pagination

    // search box
    var params = {
        placeholder: 'CARI KODE / NAMA PELANGGAN',
        module: 'advertising/customers',
        fields: [
            {
                field: 'code',
                label: 'Kode'
            },
            {
                field: 'name',
                label: 'Nama'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchCustomers', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddCustomer');
            if (hasResultCallback) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }, function (selectedCallback) {
            //selectedCallback = {disabled, element, id, label, selected, text, _resultId}
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddCustomer');
            if (openCallback === false) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddCustomer');
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
    Bisnis.Util.Event.bind('click', '#btnAddCustomer', function () {
        var representativesParams = {
            placeholder: 'CARI NAMA PERWAKILAN',
            module: 'representatives',
            prependText: '/api/representatives/',
            fields: [
                {
                    field: 'name',
                    label: 'Perwakilan'
                },
            ]
        };
        Bisnis.Util.Style.ajaxSelect('#addRepresentative', representativesParams);

        var citiesParams = {
            placeholder: 'CARI NAMA KOTA',
            module: 'cities',
            prependText: '/api/cities/',
            fields: [
                {
                    field: 'name',
                    label: 'Kota'
                },
            ]
        };
        Bisnis.Util.Style.ajaxSelect('#addCity', citiesParams, null, function (selectedData) {
            console.log(selectedData);
        });

        var taxCitiesParams = {
            placeholder: 'CARI NAMA KOTA',
            module: 'cities',
            prependText: '/api/cities/',
            fields: [
                {
                    field: 'name',
                    label: 'Kota'
                },
            ]
        };
        Bisnis.Util.Style.ajaxSelect('#addTaxCity', taxCitiesParams);

        var banksParams = {
            placeholder: 'CARI NAMA BANK',
            module: 'banks',
            prependText: '/api/banks/',
            fields: [
                {
                    field: 'name',
                    label: 'Bank'
                },
            ]
        };
        Bisnis.Util.Style.ajaxSelect('#addBank', banksParams);

        var billingGroupsParams = {
            placeholder: 'CARI NAMA GRUP TAGIHAN',
            module: 'billing/groups',
            prependText: '/api/billing/groups/',
            fields: [
                {
                    field: 'name',
                    label: 'Grup Tagihan'
                },
            ]
        };
        Bisnis.Util.Style.ajaxSelect('#addBillingGroup', billingGroupsParams);

        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addRepresentative').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.Customers.add(params, function (callback) {
            if (callback.violations) {
                Bisnis.Util.Grid.validate('addForm', callback.violations);
            } else {
                Bisnis.Util.Dialog.hideModal('#addModal');
                loadGrid(1);
            }
            thisBtn.disabled = false;
        });
    });

    Bisnis.Adv.Customers.add = function (params, callback) {
        // di filter pake hash, agar tidak terdeteksi sebagai int
        var params = Bisnis.Util.Form.hashPrepand(params);

        Bisnis.request({
            module: 'advertising/customers',
            method: 'post',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);

            if (Bisnis.validCallback(callback)) {
                callback(rawData);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };
    // end add modal

    // detail modal
    var loadDetail = function (id) {
        Bisnis.Util.Storage.store('ACCOUNT_EXECUTIVE_MANAGER_ID', id);
        Bisnis.Adv.Customers.fetchById(id, function (callback) {
            var teamWorkElem = document.getElementById('detailTeamWork');
            teamWorkElem.innerHTML = '<option value="/api/advertising/team-works/'+callback.teamWork.id+'">'+callback.teamWork.name+'</option>';

            Bisnis.Util.Event.bind('change', '#detailTeamWork');
            Bisnis.Util.Style.modifySelect('#detailTeamWork');
            var params = {
                placeholder: 'CARI KODE / NAMA TIM KERJA',
                module: 'advertising/team-works',
                prependText: '/api/advertising/team-works/',
                fields: [
                    {
                        field: 'code',
                        label: 'Kode'
                    },
                    {
                        field: 'name',
                        label: 'Tim Kerja'
                    },
                ]
            };
            Bisnis.Util.Style.ajaxSelect('#detailTeamWork', params);

            var codeElem = document.getElementById('detailCode');
            codeElem.value = callback.code;

            var nameElem = document.getElementById('detailName');
            nameElem.value = callback.name;
        });
        Bisnis.Util.Dialog.showModal('#detailModal');
    };

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
    });

    Bisnis.Adv.Customers.fetchById = function (id, callback) {
        Bisnis.request({
            module: 'advertising/customers/' + id,
            method: 'get'
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);

            if (Bisnis.validCallback(callback)) {
                callback(rawData);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };

    Bisnis.Adv.Customers.updateById = function (id, params, callback) {
        Bisnis.request({
            module: 'advertising/customers/' + id,
            method: 'put',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);

            if (Bisnis.validCallback(callback)) {
                callback(rawData);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };

    Bisnis.Util.Event.bind('click', '#btn-update', function () {
        var id = Bisnis.Util.Storage.fetch('ACCOUNT_EXECUTIVE_MANAGER_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.Customers.updateById(id, params, function (callback) {
            if (callback.violations) {
                Bisnis.Util.Grid.validate('detailForm', callback.violations);
            } else {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailModal');
                var page = Bisnis.Util.Storage.fetch('ADV_CUSTOMERS_CURRENT_PAGE');
                loadGrid(page);
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
                Bisnis.Adv.Customers.delete(id, function (textStatus) {
                    if (textStatus === 'success') {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('ADV_CUSTOMERS_CURRENT_PAGE');
                        loadGrid(page);
                    } else {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                })
            }
        });
    });

    Bisnis.Adv.Customers.delete = function (id, callback) {
        Bisnis.request({
            module: 'advertising/customers/' + id,
            method: 'delete'
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(callback)) {
                callback(textStatus);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };
    // end delete account executive manager

    // prevent submit form on enter
    window.onload = function() {
        document.getElementById("addForm").onkeypress = function(e) {
            var key = e.charCode || e.keyCode || 0;
            if (key == 13) {
                Bisnis.Util.Dialog.alert("PERHATIAN", "SILAKAN TEKAN TOMBOL SIMPAN");
                e.preventDefault();
            }
        };

        document.getElementById("detailForm").onkeypress = function (e) {
            var key = e.charCode || e.keyCode || 0;
            if (key == 13) {
                Bisnis.Util.Dialog.alert("PERHATIAN", "SILAKAN TEKAN TOMBOL SIMPAN");
                e.preventDefault();
            }
        };
    };
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