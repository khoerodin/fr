(function (Bisnis) {
    Bisnis.Adv.Customers= {};

    // fetch grid and pagination
    Bisnis.Adv.Customers.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/customers',
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
        Bisnis.Util.Storage.store('ADV_CUSTOMERS_CURRENT_PAGE', pageNum);
        Bisnis.Adv.Customers.fetchAll([{page: pageNum}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

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
                    Bisnis.Util.Grid.renderRecords('#customersList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#customersList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA PELANGGAN');
            }
        );
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
            hasResultCallback ? btn.disabled = true : btn.disabled = false;
        }, function (selectedCallback) {
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddCustomer');
            openCallback ? btn.disabled = true : btn.disabled = false;
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddCustomer');
            setTimeout(function () {
                closeCallback ? btn.disabled = true : btn.disabled = false;
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

        Bisnis.Util.DatePicker.render('#addPartnershipDate');

        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addRepresentative').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.Customers.add(params,
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

    Bisnis.Adv.Customers.add = function (params, successCallback, errorCallback) {
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

        var paramsWithHash = Bisnis.Util.Form.hashPrepand(fields, params);

        var dateFields = ['partnershipDate'];
        var params = Bisnis.Util.Form.formatDate(dateFields, paramsWithHash, 'DD/MM/YYYY');

        Bisnis.request({
            module: 'advertising/customers',
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
        Bisnis.Util.Storage.store('ADV_CUSTOMERS_ID', id);
        Bisnis.Adv.Customers.fetchById(id,
            function (dataResponse) {
                var representativeElem = document.getElementById('detailRepresentative');
                var cityElem = document.getElementById('detailCity');
                var taxCityElem = document.getElementById('detailTaxCity');
                var bankElem = document.getElementById('detailBank');
                var billingGroupElem = document.getElementById('detailBillingGroup');


                representativeElem.innerHTML = '<option value="/api/representatives/'+dataResponse.representative.id+'">'+dataResponse.representative.name+'</option>';
                cityElem.innerHTML = '<option value="/api/cities/'+dataResponse.city.id+'">'+dataResponse.city.name+'</option>';
                taxCityElem.innerHTML = '<option value="/api/cities/'+dataResponse.taxCity.id+'">'+dataResponse.taxCity.name+'</option>';
                bankElem.innerHTML = '<option value="/api/banks/'+dataResponse.bank.id+'">'+dataResponse.bank.name+'</option>';
                billingGroupElem.innerHTML = '<option value="/api/billing/groups/'+dataResponse.billingGroup.id+'">'+dataResponse.billingGroup.name+'</option>';

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

                document.getElementById('detailCode').value = dataResponse.code;
                document.getElementById('detailName').value = dataResponse.name;
                document.getElementById('detailAddress').value = dataResponse.address;
                document.getElementById('detailPostalCode').value = dataResponse.postalCode;
                document.getElementById('detailPostalCode').value = dataResponse.postalCode;
                document.getElementById('detailPhoneNumber').value = dataResponse.phoneNumber;
                document.getElementById('detailFaxNumber').value = dataResponse.faxNumber;
                Bisnis.Util.DatePicker.render('#detailPartnershipDate', dataResponse.partnershipDate);
                document.getElementById('detailTaxNumber').value = dataResponse.taxNumber;
                document.getElementById('detailTaxAddress').value = dataResponse.taxAddress;
                document.getElementById('detailTaxPhoneNumber').value = dataResponse.taxPhoneNumber;
                document.getElementById('detailTaxFaxNumber').value = dataResponse.taxFaxNumber;
                document.getElementById('detailPresidentDirectorName').value = dataResponse.presidentDirectorName;
                document.getElementById('detailMediaManagerName').value = dataResponse.mediaManagerName;
                document.getElementById('detailBankAccountNumber').value = dataResponse.bankAccountNumber;
                document.getElementById('detailRemark').value = dataResponse.remark;
                document.getElementById('detailCreditLimit').value = dataResponse.creditLimit;

                Bisnis.Util.Dialog.showModal('#detailModal');
                document.getElementById('detailRepresentative').focus();
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA PELANGGAN');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
    });

    Bisnis.Adv.Customers.fetchById = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/customers/' + id,
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

    Bisnis.Adv.Customers.updateById = function (id, params, successCallback, errorCallback) {
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

        var paramsWithHash = Bisnis.Util.Form.hashPrepand(fields, params);

        var dateFields = ['partnershipDate'];
        var params = Bisnis.Util.Form.formatDate(dateFields, paramsWithHash, 'DD/MM/YYYY');

        Bisnis.request({
            module: 'advertising/customers/' + id,
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
        var id = Bisnis.Util.Storage.fetch('ADV_CUSTOMERS_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.Customers.updateById(id, params,
            function () {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailModal');
                var page = Bisnis.Util.Storage.fetch('ADV_CUSTOMERS_CURRENT_PAGE');
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

    // delete account executive manager
    Bisnis.Util.Event.bind('click', '.btn-delete', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Adv.Customers.delete(id,
                    function () {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('ADV_CUSTOMERS_CURRENT_PAGE');
                        loadGrid(page);
                    }, function () {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                )
            }
        });
    });

    Bisnis.Adv.Customers.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/customers/' + id,
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
        Bisnis.Util.DatePicker.destroy('#addPartnershipDate');
    });
    Bisnis.Util.Dialog.hiddenModal('#detailModal', function () {
        Bisnis.Util.Grid.removeErrorForm('detailForm');
        document.getElementById("detailForm").reset();
        Bisnis.Util.DatePicker.destroy('#detailPartnershipDate');
    });
    // end reset modal form on modal hidden

})(window.Bisnis || {});