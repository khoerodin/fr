(function (Bisnis) {
    Bisnis.Adv.Invoices = {};

    Bisnis.Adv.Invoices.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/invoices',
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

    Bisnis.Adv.Invoices.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/invoices',
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

    // Invoices List

    var invoiceStatus = function (status) {
        var str;
        switch (status) {
            case 'a':
                str = '<span class="label label-success">ACTIVE</span>';
                break;
            case 'c':
                str = '<label class="label label-danger">CLOSE</label>';
                break;
            case 'v':
                str = '<label class="label label-warning">VOID</label>';
                break;
            default:
                str = '<span class="label label-danger">ERROR</span>';
        }

        return str;
    };

    var loadPage = function (pageNum) {
        pageNum = (!pageNum || 'null' === pageNum ) ? 1 : pageNum;
        Bisnis.Util.Storage.store('INVOICES_CURRENT_PAGE', pageNum);
        Bisnis.Adv.Invoices.fetchAll([{page: pageNum}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#invoicesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.invoiceNumber },
                            { value: '<span class="pull-right">' + Bisnis.Util.Money.format(memberData.amount) + '</span>' },
                            { value: invoiceStatus(memberData.status) },
                            { value: memberData.id, format: function (id) {
                                return '<span class="pull-right">' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat" title="DETAIL"><i class="fa fa-print"></i> CETAK</button>' +
                                    '</span>';
                            } }
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#invoicesList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#invoicesList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT LIST FAKTUR');
            }
        );
    };

    loadPage(1);

    Bisnis.Util.Event.bind('click', '#invoicesPagination .pagePrevious', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#invoicesPagination .pageNext', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#invoicesPagination .pageFirst', function () {
        loadPage(1);
    });

    Bisnis.Util.Event.bind('click', '#invoicesPagination .pageLast', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    var params = {
        placeholder: 'CARI NO FAKTUR',
        module: 'advertising/invoices',
        allowClear: true,
        fields: [
            {
                field: 'invoiceNumber',
                label: 'No. Faktur'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchInvoices', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddInvoice');
            hasResultCallback ? btn.disabled = true : btn.disabled = false;
        }, function (selectedCallback) {
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddInvoice');
            openCallback ? btn.disabled = true : btn.disabled = false;
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddInvoice');
            setTimeout(function () {
                closeCallback ? btn.disabled = true : btn.disabled = false;
            }, 300);
        }
    );

    // End Invoices List

    // Add Incvoice Modal
    var fetchSelect = function (selector, invoiceAs, selectedCallback) {
        var params = {
            placeholder: 'CARI NO. ORDER',
            module: 'advertising/orders',
            filters: [
                {
                  key: 'printInvoiceAs',
                  value: invoiceAs
                }
            ],
            prependValue: '/api/advertising/orders/',
            fields: [
                {
                    field: 'orderNumber',
                    label: 'No. Order'
                }
            ]
        };
        Bisnis.Util.Style.ajaxSelect(selector, params, null, function (selected) {
            if (Bisnis.validCallback(selectedCallback)) {
                selectedCallback(selected);
            }
        });
    };

    var showPecahAmount = function (orderId) {
        var finalAmount = '';
        Bisnis.Adv.Orders.fetchById(orderId,
            function (dataResponse) {
                var netto = dataResponse.totalAmount * dataResponse.quantity;
                Bisnis.Util.Storage.store('netto' + orderId, netto);
            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN','GAGAL MEMUAT DATA NETTO');
            }
        );

        Bisnis.Adv.OrderInvoices.fetchAll([{'order.id': orderId}, {'order': {'createdAt': 'ASC'}}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var netto = Bisnis.Util.Storage.fetch('netto' + orderId);
                var pecahAmount = document.querySelector('#pecahAmount');
                var btnPecahInvoice = document.querySelector('#btn-pecah-invoice');
                var sisa = document.querySelector('#sisa');
                var invoiceSequence = parseFloat(memberData.length) +1;

                if ( memberData.length < 1 ) {
                    finalAmount = Bisnis.Util.Storage.fetch('netto' + orderId);
                    sisa.value = Bisnis.Util.Money.format(finalAmount);
                    pecahAmount.disabled = false;
                    btnPecahInvoice.disabled = false;
                    pecahAmount.value = finalAmount;
                    pecahAmount.focus();
                    Bisnis.Util.Storage.store('pecahInvoiceNumber', Bisnis.Util.Storage.fetch('pecahOrderNumber') + '-' + invoiceSequence);
                } else {

                    var amount = 0;
                    Bisnis.each(function (idx, memberData) {
                        amount = amount + memberData.invoice.amount;
                    }, memberData);

                    finalAmount = parseFloat(netto) - parseFloat(amount);
                    document.querySelector('#sisa').value = Bisnis.Util.Money.format(finalAmount);

                    if ( finalAmount <= 0 ) {
                        btnPecahInvoice.disabled = true;
                        pecahAmount.value = '';
                        pecahAmount.disabled = true;
                    } else {
                        pecahAmount.value = finalAmount;
                        pecahAmount.focus();
                        pecahAmount.disabled = false;
                        btnPecahInvoice.disabled = false;
                        Bisnis.Util.Storage.store('pecahInvoiceNumber', Bisnis.Util.Storage.fetch('pecahOrderNumber') + '-' + invoiceSequence);
                    }
                }

            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN','GAGAL MEMUAT DATA ORDER FAKTUR');
            }
        );
    };

    var addOrder = function (orderId) {
        Bisnis.Adv.Orders.fetchById(orderId,
            function (dataReasponse) {
                var netto = parseInt(dataReasponse.totalAmount) * parseInt(dataReasponse.quantity);

                Bisnis.Util.Storage.store('gabungOrderNumber', dataReasponse.orderNumber);
                Bisnis.Util.Storage.store('gabungTitle', dataReasponse.title);
                Bisnis.Util.Storage.store('gabungNetto', netto);


                Bisnis.Util.Event.bind('click', '#add-order', function (e) {
                    var stamp = Bisnis.Util.Storage.fetch('addOrderStamp');
                    Bisnis.Util.Storage.store('addOrderStamp', e.timeStamp);

                    if (parseFloat(stamp) !== e.timeStamp) {

                        var val = document.querySelector('#nettoGabung').value;
                        if (!val) {
                            document.querySelector('#nettoGabung').value = '0';
                            val = 0;
                        }

                        var hasValue = parseFloat(val) + parseFloat(Bisnis.Util.Storage.fetch('gabungNetto'));
                        document.querySelector('#nettoGabung').value = hasValue;
                        Bisnis.Util.Storage.store('nettoGabungAll', hasValue);

                        Bisnis.Util.Storage.storeArray('gabungOrdersIds', Bisnis.Util.Storage.fetch('orderIdToGabung'));

                        var tbody = document.querySelector('#orderGabungList');
                        var lastNum = tbody.rows[ tbody.rows.length - 1 ].cells[0].innerText;
                        var rowNum = 1;
                        if ( Number.isInteger( parseInt(lastNum) ) ) {
                            rowNum = parseInt(lastNum) + 1;
                        } else {
                            tbody.innerHTML = '';
                        }

                        var row = tbody.insertRow(-1);
                        row.insertCell(0).innerHTML = rowNum.toString();
                        row.insertCell(1).innerHTML = Bisnis.Util.Storage.fetch('gabungOrderNumber');
                        row.insertCell(2).innerHTML = Bisnis.Util.Storage.fetch('gabungTitle');
                        row.insertCell(3).innerHTML = Bisnis.Util.Money.format(Bisnis.Util.Storage.fetch('gabungNetto'));
                        row.insertCell(4).innerHTML = '<button type="button" data-netto="'+ Bisnis.Util.Storage.fetch('gabungNetto') +'" data-id="'+ Bisnis.Util.Storage.fetch('orderIdToGabung') +'" class="btn btn-flat btn-default btn-xs pull-right btn-remove-gabung-order"><i class="fa fa-times"></i></button>';

                        document.querySelector('#add-order').disabled = true;
                        document.querySelector('#btn-gabung-invoice').disabled = false;
                        document.querySelector('#gabungOrder').value = [];
                        Bisnis.Util.Event.trigger('change', '#gabungOrder');

                    }
                });
            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENGAMBIL DATA ORDER!');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-remove-gabung-order', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        var netto = Bisnis.Util.Document.getDataValue(this, 'netto');
        this.closest('tr').remove();

        var nettoAll = parseFloat(Bisnis.Util.Storage.fetch('nettoGabungAll')) - parseFloat(netto);
        document.querySelector('#nettoGabung').value = nettoAll;
        Bisnis.Util.Storage.store('nettoGabungAll', nettoAll);

        Bisnis.Util.Storage.removeArray('gabungOrdersIds', id);

        var arrIds = JSON.parse(localStorage.getItem('gabungOrdersIds'));
        if ( arrIds.length > 0 ) {
            document.querySelector('#btn-gabung-invoice').disabled = false;
        } else {
            document.querySelector('#btn-gabung-invoice').disabled = true;
            document.querySelector('#orderGabungList').innerHTML = '<tr><td colspan="10">SILAKAN TAMBAH ORDER IKLAN</td></tr>';
        }
    });

    Bisnis.Util.Event.bind('click', '#btnAddInvoice', function () {

        // select for normal invoice
        fetchSelect('#normalOrder', 'n',
            function (selected) {
                let id = selected.id.split('/')[4];
                Bisnis.Util.Storage.store('normalOrderId', id);
                Bisnis.Util.Storage.store('normalOrderNumber', selected.text);

                Bisnis.Adv.Orders.fetchById(id,
                    function (dataResponse) {
                        var netto = dataResponse.totalAmount * dataResponse.quantity;
                        document.querySelector('#normalForm #netto').value = Bisnis.Util.Money.format(netto);
                        document.querySelector('#normalForm #amount').value = netto;
                    },
                    function () {
                        Bisnis.Util.Dialog.alert('PERHATIAN','GAGAL MEMUAT DATA ORDER IKLAN');
                    }
                );

                Bisnis.Adv.OrderInvoices.fetchAll([{'order.id': id}],
                    function (dataResponse) {
                        var memberData = dataResponse['hydra:member'];
                        if ( memberData.length > 0 ) {
                            document.querySelector('#normalForm #btn-normal-invoice').disabled = true;
                            document.querySelector('#normalForm').classList.add('has-success');
                            // document.querySelector('#hasNormalInvoice').classList.remove('hidden');
                        } else {
                            document.querySelector('#normalForm #btn-normal-invoice').disabled = false;
                            document.querySelector('#normalForm').classList.remove('has-success');
                            // document.querySelector('#hasNormalInvoice').classList.add('hidden');
                        }
                    },
                    function () {
                        Bisnis.Util.Dialog.alert('PERHATIAN','GAGAL VALIDASI FAKTUR');
                        document.querySelector('#normalForm #btn-normal-invoice').disabled = true;
                    }
                );
            }
        );

        // select for pecah invoice
        fetchSelect('#pecahOrder', 'p',
            function (selected) {
                var orderId = selected.id.split('/')[4];
                Bisnis.Util.Storage.store('pecahOrderId', orderId);
                Bisnis.Util.Storage.store('pecahOrderNumber', selected.text);
                showPecahAmount(orderId);

                var pageNum = Bisnis.Util.Storage.fetch('INVOICE_PECAH_PAGE');
                loadInvoices(pageNum, orderId);

                Bisnis.Util.Event.bind('click', '#invoicePecahPagination .pagePrevious', function () {
                    loadInvoices(Bisnis.Util.Document.getDataValue(this, 'page'), orderId);
                });

                Bisnis.Util.Event.bind('click', '#invoicePecahPagination .pageNext', function () {
                    loadInvoices(Bisnis.Util.Document.getDataValue(this, 'page'), orderId);
                });

                Bisnis.Util.Event.bind('click', '#invoicePecahPagination .pageFirst', function () {
                    loadInvoices(1, orderId);
                });

                Bisnis.Util.Event.bind('click', '#invoicePecahPagination .pageLast', function () {
                    loadInvoices(Bisnis.Util.Document.getDataValue(this, 'page'), orderId);
                });
            }
        );

        // select for gabung invoice
        fetchSelect('#gabungOrder', 'g',
            function (selected) {
                var orderId = selected.id.split('/')[4];
                var ids = Bisnis.Util.Storage.fetch('gabungOrdersIds');
                ids = (ids) ? JSON.parse(ids) : [];
                Bisnis.Util.Storage.store('orderIdToGabung', orderId);

                if ( ids.length < 1) {
                    document.querySelector('#orderGabungList').innerHTML = '<tr><td colspan="10">SILAKAN TAMBAH ORDER IKLAN</td></tr>';
                }

                Bisnis.Adv.OrderInvoices.fetchAll([{'order.id': orderId}],
                    function (dataResponse) {
                        var memberData = dataResponse['hydra:member'];
                        if ( memberData.length > 0 ) {
                            document.querySelector('#add-order').disabled = true;
                            document.querySelector('#gabungOrder').closest('div').classList.add('has-error');
                            // document.querySelector('#hasGabungInvoice').classList.remove('hidden');
                        } else {
                            document.querySelector('#gabungOrder').closest('div').classList.remove('has-error');
                            // document.querySelector('#hasGabungInvoice').classList.add('hidden');
                            if ( ids.indexOf(orderId) !== -1 ) {
                                document.querySelector('#add-order').disabled = true;
                            } else {
                                document.querySelector('#add-order').disabled = false;
                                addOrder(orderId);
                            }
                        }
                    },
                    function () {
                        Bisnis.Util.Dialog.alert('PERHATIAN','GAGAL VALIDASI FAKTUR');
                        document.querySelector('#normalForm #btn-normal-invoice').disabled = true;
                    }
                );
            }
        );

        Bisnis.Util.Dialog.showModal('#addModal');
    });

    var storeOrderInvoice = function (orderId, invoiceId, callback) {
        var params = [
            {
                name: 'order',
                value: '/api/advertising/orders/' + orderId
            },
            {
                name: 'invoice',
                value: '/api/advertising/invoices/' + invoiceId
            }
        ];
        Bisnis.Adv.OrderInvoices.add(params,
            function () {
                var pageNum = Bisnis.Util.Storage.fetch('INVOICES_CURRENT_PAGE');
                loadPage(pageNum);
                if (Bisnis.validCallback(callback)) {
                    callback(true);
                }
            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMBUAT FAKTUR ORDER');
                if (Bisnis.validCallback(callback)) {
                    callback(false);
                }
            }
        );
    };

    var isGreater = function (orderId, givenAmount, callback) {
        Bisnis.Adv.Orders.fetchById(orderId,
            function (dataResponse) {
                var netto = dataResponse.totalAmount * dataResponse.quantity;
                Bisnis.Util.Storage.store('netto' + orderId, netto);
            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN','GAGAL MEMUAT DATA NETTO');
            }
        );

        Bisnis.Adv.OrderInvoices.fetchAll([{'order.id': orderId}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                if ( memberData.length < 1 ) {
                    if (Bisnis.validCallback(callback)) {
                        callback(false);
                    }
                } else {
                    Bisnis.Adv.OrderInvoices.fetchAll([{'order.id': orderId}],
                        function (dataResponse) {
                            var memberData = dataResponse['hydra:member'];
                            var amount = 0;
                            if (memberData.length > 0) {
                                Bisnis.each(function (idx, memberData) {
                                    amount = amount + memberData.invoice.amount;
                                }, memberData);
                            }
                            var netto = Bisnis.Util.Storage.fetch('netto' + orderId)
                            amount = parseFloat(netto) - parseFloat(amount);

                            if (Bisnis.validCallback(callback)) {
                                callback(( parseFloat(givenAmount) > parseFloat(amount) ));
                            }

                        }, function () {
                            Bisnis.Util.Dialog.alert('PERHATIAN','GAGAL MEMUAT DATA SISA');
                        }
                    );
                }

            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN','GAGAL MEMUAT DATA ORDER FAKTUR');
            }
        );
    };

    // add normal invoice
    Bisnis.Util.Event.bind('click', '#btn-normal-invoice', function () {
        document.querySelector('#btn-normal-invoice').disabled = true;
        var params = [
            {
                name: 'invoiceNumber',
                value: Bisnis.Util.Storage.fetch('normalOrderNumber')
            },
            {
                name: 'amount',
                value: document.querySelector('#normalForm #amount').value
            },
        ];
        Bisnis.Adv.Invoices.add(params,
            function (dataResponse) {
                let orderId = Bisnis.Util.Storage.fetch('normalOrderId');
                storeOrderInvoice(orderId, dataResponse.id);
                Bisnis.Util.Dialog.hideModal('#addModal');
                document.querySelector('#btn-normal-invoice').disabled = false;
            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMBUAT FAKTUR');
                Bisnis.Util.Dialog.hideModal('#addModal');
                document.querySelector('#btn-normal-invoice').disabled = false;
            }
        );
    });

    // add pecah invoice
    var invoiceStatus = function (status) {
        var str;
        switch (status) {
            case 'a':
                str = '<span class="label label-success">ACTIVE</span>';
                break;
            case 'c':
                str = '<label class="label label-danger">CLOSE</label>';
                break;
            case 'v':
                str = '<label class="label label-warning">VOID</label>';
                break;
            default:
                str = '<span class="label label-danger">ERROR</span>';
        }

        return str;
    };

    var loadInvoices = function (pageNum, orderId) {
        pageNum = (!pageNum || 'null' === pageNum ) ? 1 : pageNum;
        Bisnis.Util.Storage.store('INVOICE_PECAH_PAGE', pageNum);
        Bisnis.Adv.OrderInvoices.fetchAll([{'order.id': orderId}, {page: pageNum}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#invoicePecahPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            {value: memberData.invoice.invoiceNumber},
                            {value: memberData.invoice.amount, format: function (amount) {
                                return '<span class="pull-right">' + Bisnis.Util.Money.format(amount) + '</span>';
                            }},
                            {value: memberData.invoice.status, format: function (status) {
                                return invoiceStatus(status);
                            }}
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#invoicePecahList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#invoicePecahList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA FAKTUR PECAH');
            }
        );
    };

    var addPecahInvoice = function (orderId, amount) {
        var params = [
            {
                name: 'invoiceNumber',
                value: Bisnis.Util.Storage.fetch('pecahInvoiceNumber')
            },
            {
                name: 'amount',
                value: amount
            },
        ];
        Bisnis.Adv.Invoices.add(params,
            function (dataResponse) {
                storeOrderInvoice(orderId, dataResponse.id, function (callback) {
                    if (callback) {
                        var pageNum = Bisnis.Util.Storage.fetch('INVOICE_PECAH_PAGE');
                        loadInvoices(pageNum, orderId);
                        showPecahAmount(orderId);
                    }
                });
                document.querySelector('#btn-pecah-invoice').disabled = false;
            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMBUAT FAKTUR');
                document.querySelector('#btn-pecah-invoice').disabled = false;
            }
        );
    };

    // add pecah invoice
    Bisnis.Util.Event.bind('click', '#btn-pecah-invoice', function () {
        document.querySelector('#btn-pecah-invoice').disabled = true;
        var orderId = Bisnis.Util.Storage.fetch('pecahOrderId');

        var amount = document.querySelector('#pecahForm #pecahAmount').value;
        isGreater(orderId, amount,
            function (callback) {
                if (callback === false) {
                    addPecahInvoice(orderId, amount);
                } else {
                    Bisnis.Util.Dialog.alert('PERHATIAN', 'JUMLAH YANG ANDA MASUKKAN TIDAK BOLEH MELEBIHI SISA');
                    document.querySelector('#btn-pecah-invoice').disabled = false;
                }
            }
        );
    });

    // save orders
    var saveOrders = function (orderId, invoiceId, last) {
        document.querySelector('#btn-gabung-invoice').disabled = true;
        var params = [
            {
                name: 'order',
                value: '/api/advertising/orders/' + orderId
            },
            {
                name: 'invoice',
                value: '/api/advertising/invoices/' + invoiceId
            }
        ];

        Bisnis.Adv.OrderInvoices.add(params,
            function () {
                if (last) {
                    var pageNum = Bisnis.Util.Storage.fetch('INVOICES_CURRENT_PAGE');
                    loadPage(pageNum);
                    document.querySelector('#btn-gabung-invoice').disabled = false;
                    Bisnis.Util.Dialog.hideModal('#addModal');
                }
            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENAMBAH ORDER');
            }
        );
    };
    // add gabung invoice
    Bisnis.Util.Event.bind('click', '#btn-gabung-invoice', function () {
        var params = [
            {
                name: 'invoiceNumber',
                value: 'INVOICE/NUM/HERE/001'
            },
            {
                name: 'amount',
                value: document.querySelector('#nettoGabung').value
            }
        ];
        Bisnis.Adv.Invoices.add(params,
            function (dataResponse) {
                var id = dataResponse.id;
                var orderIds = JSON.parse(Bisnis.Util.Storage.fetch('gabungOrdersIds'));
                var length = orderIds.length;
                var urut = 1;
                var last = false;
                orderIds.forEach(function (value) {
                    if (length === urut++) {
                        last = true;
                    }
                    saveOrders(value, id, last);
                });

            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENYIMPAN FAKTUR GABUNG');
            }
        );
        //2. simpan no order
    });

    // End Add Incvoice Modal

    // reset gabung order
    Bisnis.Util.Storage.remove('gabungOrdersIds');
    // end reset gabung order

    // reset modal form on modal hidden
    Bisnis.Util.Dialog.hiddenModal('#addModal', function () {
        Bisnis.Util.Grid.removeErrorForm('normalForm');
        document.getElementById("normalForm").reset();
        document.querySelector('#normalForm #normalOrder').value = [];

        Bisnis.Util.Grid.removeErrorForm('pecahForm');
        document.getElementById("pecahForm").reset();
        document.querySelector('#pecahForm #pecahOrder').value = [];

        Bisnis.Util.Storage.remove('INVOICE_PECAH_ID');
        document.querySelector('#invoicePecahList').innerHTML = '<tr><td colspan="10">SILAKAN PILIH ORDER IKLAN</td></tr>';
        document.querySelector('#pecahAmount').disabled = true;
        document.querySelector('#pecahAmount').value = '';
        document.querySelector('#btn-pecah-invoice').disabled = false;
        document.querySelector('#sisa').value = '';

        Bisnis.Util.Grid.removeErrorForm('gabungForm');
        Bisnis.Util.Storage.remove('gabungOrdersIds');
        document.getElementById("gabungForm").reset();
        document.querySelector('#gabungOrder').value = [];
        document.querySelector('#gabungOrder').closest('div').classList.remove('has-error');
        // document.querySelector('#hasGabungInvoice').classList.add('hidden');
        document.querySelector('#orderGabungList').innerHTML = '<tr><td colspan="10">SILAKAN TAMBAH ORDER IKLAN</td></tr>';

    });
    // end reset modal form on modal hidden
})(window.Bisnis || {});