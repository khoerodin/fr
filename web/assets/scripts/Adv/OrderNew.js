(function (Bisnis) {
    Bisnis.Adv.OrderNew = {};

    // Perwakilan
    var repParams = {
        placeholder: 'CARI PERWAKILAN',
        module: 'representatives',
        prependValue: '/api/representatives/',
        allowClear: true,
        fields: [
            {
                field: 'code',
                label: 'Kode Perwakilan'
            },
            {
                field: 'name',
                label: 'Perwakilan'
            }
        ]
    };
    Bisnis.Util.Style.ajaxSelect('#orderFrom', repParams);
    // End Perwakilan

    // Tanggal Booking, Tanggal Faktur
    Bisnis.Util.DatePicker.render('#dtBookedAt, #dtInvoicedAt');
    // End Tanggal Booking, Tanggal Faktur

    // Pemasang Iklan
    Bisnis.Util.Event.bind('click','#customerButton', function () {
        loadCustomer();
        Bisnis.Util.Dialog.showModal('#customerModal');
        document.querySelector('#serachCustomer').focus();
        searchCustomers();
    });

    var loadCustomer = function (pageNum, name) {
        pageNum = pageNum ? pageNum : 1;
        Bisnis.Util.Storage.store('ORDER_FORM_CUSTOMER_PAGE', pageNum);
        Bisnis.Adv.Customers.fetchAll([{page: pageNum},{name: name}],
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
                            { value: memberData.id, format: function (id) {
                                return memberData.name + '<span class="pull-right">' +
                                    '<label class="label label-success choose-customer" ' +
                                    'style="cursor: pointer;" data-name="'+ memberData.name +'" data-address="'+ memberData.address +'" data-id="'+ id +'">PILIH</label><span>';
                            } },
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#customerList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#customerList', '<tr><td colspan="10">TIDAK ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA PEMASANG IKLAN');
            }
        );

        Bisnis.Util.Event.bind('click', '.choose-customer', function () {
            document.querySelector('[name="customer"]').value = '/api/advertising/customers/' + this.getAttribute('data-id');
            document.querySelector('#customerName').value = this.getAttribute('data-name');
            document.querySelector('#customerAddress').value = this.getAttribute('data-address');
            Bisnis.Util.Dialog.hideModal('#customerModal');
        });
    };

    var searchCustomers = function () {
        Bisnis.Util.Event.bind('keyup', '#serachCustomer', function () {
            loadCustomer(null, this.value);
        });
    };
    // End Pemasang Iklan

    // Klien Iklan
    Bisnis.Util.Event.bind('click','#clientButton', function () {
        loadClient();
        Bisnis.Util.Dialog.showModal('#clientModal');
        document.querySelector('#serachClient').focus();
        searchClient();
    });

    var loadClient = function (pageNum, name) {
        pageNum = pageNum ? pageNum : 1;
        Bisnis.Util.Storage.store('ORDER_FORM_CLIENT_PAGE', pageNum);
        Bisnis.Adv.Customers.fetchAll([{page: pageNum},{name: name}],
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
                            { value: memberData.code },
                            { value: memberData.id, format: function (id) {
                                return memberData.name + '<span class="pull-right">' +
                                    '<label class="label label-success choose-client" ' +
                                    'style="cursor: pointer;" data-name="'+ memberData.name +'" data-id="'+ id +'">PILIH</label><span>';
                            } },
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#clientList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#clientList', '<tr><td colspan="10">TIDAK ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA KLIEN IKLAN');
            }
        );

        Bisnis.Util.Event.bind('click', '.choose-client', function () {
            document.querySelector('[name="client"]').value = '/api/advertising/customers/' + this.getAttribute('data-id');
            document.querySelector('#clientName').value = this.getAttribute('data-name');
            Bisnis.Util.Dialog.hideModal('#clientModal');
        });
    };

    var searchClient = function () {
        Bisnis.Util.Event.bind('keyup', '#serachClient', function () {
            loadClient(null, this.value);
        });
    };
    // End Klien Iklan

    // Cekat Di Faktur
    Bisnis.Util.Style.modifySelect('[name="printAs"]');
    // End Cekat Di Faktur

    // Jenis Iklan
    Bisnis.Util.Event.bind('click','#specificationButton', function () {
        loadSpecification();
        Bisnis.Util.Dialog.showModal('#specificationModal');
        document.querySelector('#serachSpecification').focus();
        searchSpecification();
    });

    var loadSpecification = function (pageNum, name) {
        pageNum = pageNum ? pageNum : 1;
        Bisnis.Util.Storage.store('ORDER_FORM_SPECIFICATION_PAGE', pageNum);
        Bisnis.Adv.Specifications.fetchAll([{page: pageNum},{name: name}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#specificationsPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.id, format: function (id) {
                                return memberData.name + '<span class="pull-right">' +
                                    '<label class="label label-success choose-specification" ' +
                                    'style="cursor: pointer;" data-name="'+ memberData.name +'" data-id="'+ id +'">PILIH</label><span>';
                            } },
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#specificationList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#specificationList', '<tr><td colspan="10">TIDAK ADA DATA</td></tr>');
                }
            },
            function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA JENIS IKLAN');
            }
        );

        Bisnis.Util.Event.bind('click', '.choose-specification', function () {
            document.querySelector('[name="specification"]').value = '/api/advertising/specifications/' + this.getAttribute('data-id');
            document.querySelector('#specificationName').value = this.getAttribute('data-name');

            document.querySelector('#typeName').value = '';
            document.querySelector('[name="type"]').value = '';
            document.querySelector('[name="basePrice"]').value = '';
            document.querySelector('#typeButton').disabled = false;

            Bisnis.Util.Dialog.hideModal('#specificationModal');
        });
    };

    var searchSpecification = function () {
        Bisnis.Util.Event.bind('keyup', '#serachSpecification', function () {
            loadSpecification(null, this.value);
        });
    };
    // End Jenis Iklan

    // Tipe Iklan
    Bisnis.Util.Event.bind('click','#typeButton', function () {
        loadType();
        Bisnis.Util.Dialog.showModal('#typeModal');
        document.querySelector('#serachType').focus();
        searchType();
    });

    var loadType = function (pageNum, name) {
        pageNum = pageNum ? pageNum : 1;
        Bisnis.Util.Storage.store('ORDER_FORM_TYPE_PAGE', pageNum);
        var specId = document.querySelector('[name="specification"]').value.split('/')[4];
        Bisnis.Adv.SpecificationDetails.fetchAll([{page: pageNum},{'type.name': name},{'specification.id': specId}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#typesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.type.id, format: function (id) {
                                return memberData.type.name + '<span class="pull-right">' +
                                    '<label class="label label-success choose-type" ' +
                                    'style="cursor: pointer;" data-name="'+ memberData.type.name +'" data-id="'+ id +'">PILIH</label><span>';
                            } },
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#typeList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#typeList', '<tr><td colspan="10">TIDAK ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA TIPE IKLAN');
            }
        );

        Bisnis.Util.Event.bind('click', '.choose-type', function () {
            document.querySelector('[name="type"]').value = '/api/advertising/types/' + this.getAttribute('data-id');
            document.querySelector('#typeName').value = this.getAttribute('data-name');

            var params = [
                {
                    'specificationDetail.type.id': this.getAttribute('data-id'),
                    'active': true
                }
            ];
            Bisnis.Adv.Prices.fetchAll(params,
                function (dataResponse) {
                    var total = dataResponse['hydra:totalItems'];
                    var data = dataResponse['hydra:member'];

                    if (total > 0) {
                        document.querySelector('[name="basePrice"]').value = data[0]['price'];
                    } else {
                        document.querySelector('[name="basePrice"]').value = '0';
                    }
                },
                function () {
                    document.querySelector('[name="basePrice"]').value = '0';
                    Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENGAMBIL TARIF IKLAN');
                }
            );

            Bisnis.Util.Dialog.hideModal('#typeModal');
        });
    };

    var searchType = function () {
        Bisnis.Util.Event.bind('keyup', '#serachType', function () {
            loadType(null, this.value);
        });
    };
    // End Tipe Iklan
})(window.Bisnis || {});