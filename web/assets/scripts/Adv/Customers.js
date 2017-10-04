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
            prependValue: '/api/representatives/',
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
            prependValue: '/api/cities/',
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
            prependValue: '/api/cities/',
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
            prependValue: '/api/banks/',
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
            prependValue: '/api/billing/groups/',
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
        var fields = [
            'postalCode',
            'phoneNumber',
            'faxNumber',
            'taxNumber',
            'taxPhoneNumber',
            'taxFaxNumber',
            'bankAccountNumber'
        ];

        var params = Bisnis.Util.Form.hashPrepand(fields, params);

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
        Bisnis.Util.Storage.store('ADV_CUSTOMERS_ID', id);
        Bisnis.Adv.Customers.fetchById(id, function (callback) {
            var representativeElem = document.getElementById('detailRepresentative');
            var cityElem = document.getElementById('detailCity');
            var taxCityElem = document.getElementById('detailTaxCity');
            var bankElem = document.getElementById('detailBank');
            var billingGroupElem = document.getElementById('detailBillingGroup');


            representativeElem.innerHTML = '<option value="/api/advertising/representatives/'+callback.representative.id+'">'+callback.representative.name+'</option>';
            cityElem.innerHTML = '<option value="/api/cities/'+callback.representative.id+'">'+callback.representative.name+'</option>';
            taxCityElem.innerHTML = '<option value="/api/cities/'+callback.representative.id+'">'+callback.representative.name+'</option>';
            bankElem.innerHTML = '<option value="/api/banks/'+callback.representative.id+'">'+callback.representative.name+'</option>';
            billingGroupElem.innerHTML = '<option value="/api/billing/groups/'+callback.representative.id+'">'+callback.representative.name+'</option>';

            Bisnis.Util.Event.bind('change', '#detailRepresentative');
            Bisnis.Util.Style.modifySelect('#detailRepresentative');
            var representativesParams = {
                placeholder: 'CARI NAMA PERWAKILAN',
                module: 'representatives',
                prependValue: '/api/representatives/',
                fields: [
                    {
                        field: 'name',
                        label: 'Perwakilan'
                    },
                ]
            };
            Bisnis.Util.Style.ajaxSelect('#detailRepresentative', representativesParams);

            Bisnis.Util.Event.bind('change', '#detailCity');
            Bisnis.Util.Style.modifySelect('#detailCity');
            var citiesParams = {
                placeholder: 'CARI NAMA KOTA',
                module: 'cities',
                prependValue: '/api/cities/',
                fields: [
                    {
                        field: 'name',
                        label: 'Kota'
                    },
                ]
            };
            Bisnis.Util.Style.ajaxSelect('#detailCity', citiesParams);

            Bisnis.Util.Event.bind('change', '#detailTaxCity');
            Bisnis.Util.Style.modifySelect('#detailTaxCity');
            var taxCitiesParams = {
                placeholder: 'CARI NAMA KOTA',
                module: 'cities',
                prependValue: '/api/cities/',
                fields: [
                    {
                        field: 'name',
                        label: 'Kota'
                    },
                ]
            };
            Bisnis.Util.Style.ajaxSelect('#detailTaxCity', taxCitiesParams);

            Bisnis.Util.Event.bind('change', '#detailBank');
            Bisnis.Util.Style.modifySelect('#detailBank');
            var banksParams = {
                placeholder: 'CARI NAMA BANK',
                module: 'banks',
                prependValue: '/api/banks/',
                fields: [
                    {
                        field: 'name',
                        label: 'Bank'
                    },
                ]
            };
            Bisnis.Util.Style.ajaxSelect('#detailBank', banksParams);

            Bisnis.Util.Event.bind('change', '#detailBillingGroup');
            Bisnis.Util.Style.modifySelect('#detailBillingGroup');
            var billingGroupsParams = {
                placeholder: 'CARI NAMA GRUP TAGIHAN',
                module: 'billing/groups',
                prependValue: '/api/billing/groups/',
                fields: [
                    {
                        field: 'name',
                        label: 'Grup Tagihan'
                    },
                ]
            };
            Bisnis.Util.Style.ajaxSelect('#detailBillingGroup', billingGroupsParams);
        });

        Bisnis.Util.Dialog.showModal('#detailModal');
        document.getElementById('detailRepresentative').focus();
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
        // di filter pake hash, agar tidak terdeteksi sebagai int
        var fields = [
            'postalCode',
            'phoneNumber',
            'faxNumber',
            'taxNumber',
            'taxPhoneNumber',
            'taxFaxNumber',
            'bankAccountNumber'
        ];

        var params = Bisnis.Util.Form.hashPrepand(fields, params);

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
        var id = Bisnis.Util.Storage.fetch('ADV_CUSTOMERS_ID');
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