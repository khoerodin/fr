(function (Bisnis) {
    Bisnis.Adv.OrderInvoices = {};

    Bisnis.Adv.OrderInvoices.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/order-invoices',
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

    var invoiceList = function (orderId) {
        Bisnis.Adv.OrderInvoices.fetchAll([{'order.id': orderId}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var invoicesButtons = '';
                var orderID = '';
                if (memberData.length > 0) {
                    Bisnis.each(function (idx, memberData) {
                        orderID = memberData.order.id;
                        var str = '<button class="btn btn-xs btn-flat btn-success btn-invoices" style="margin-right: 5px;margin-bottom: 5px;">'+memberData.invoiceNumber+'</button>';
                        invoicesButtons = invoicesButtons + str;
                    }, memberData);
                    document.querySelector('#totalAmount' + orderID).innerHTML = invoicesButtons;
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA FAKTUR');
            }
        );
    };

    var invoiceType= function (printInvoiceAs) {
        var invoiceAs;
        switch (printInvoiceAs) {
            case 'n':
                invoiceAs = '<span class="label label-success">NORMAL</span>';
                break;
            case 'p':
                invoiceAs = '<label class="label label-danger">PECAH</label>';
                break;
            case 'g':
                invoiceAs = '<label class="label label-warning">GABUNG</label>';
                break;
            default:
                invoiceAs = '<span class="label label-success">NORMAL</span>';
        }

        return invoiceAs;
    };

    var loadPage = function (pageNum) {
        var pageNum =
            (isNaN(pageNum) || 'undefined' === typeof pageNum || 'null' === pageNum ) ? 1 : parseInt(pageNum);
        Bisnis.Util.Storage.store('ORDER_ORDER_INVOICES_CURRENT_PAGE', pageNum);
        Bisnis.Adv.Orders.fetchAll([{page: pageNum}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#ordersPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            {value: memberData.orderNumber},
                            {value: memberData.title},
                            {value: invoiceType(memberData.printInvoiceAs)},
                            {
                                value: memberData.id, format: function (id) {
                                invoiceList(memberData.id);
                                return '<span id="totalAmount' + memberData.id + '"></span>';
                            }
                            },
                            {
                                value: memberData.id, format: function (id) {
                                return '<span class="pull-right">' +
                                    '<button data-id="' + id + '" ' +
                                    'data-ordernumber="' + memberData.orderNumber + '" ' +
                                    'data-totalamount="' + memberData.totalAmount + '" ' +
                                    'data-quantity="' + memberData.quantity + '" ' +
                                    'class="btn btn-xs btn-default btn-flat btn-generate-invoices" ' +
                                    'title="GENERATE INVOICE"><i class="fa fa-clone"></i> BUAT FAKTUR</button>' +
                                    '</span>';
                            }
                            }
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#ordersList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#ordersList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA FAKTUR');
            }
        );
    };

    loadPage(1);

    Bisnis.Util.Event.bind('click', '#ordersPagination .pagePrevious', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#ordersPagination .pageNext', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#ordersPagination .pageFirst', function () {
        loadPage(1);
    });

    Bisnis.Util.Event.bind('click', '#ordersPagination .pageLast', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '.btn-invoices', function () {
        Bisnis.Util.Dialog.alert('GO TO INVOICE', 'KE HALAMAN FAKTUR');
    });

    var params = {
        placeholder: 'CARI NO FAKTUR / NO ORDER / NO SURAT ORDER',
        module: 'advertising/orders',
        fields: [
            {
                field: 'orderNumber',
                label: 'No. Order'
            },
            {
                field: 'orderLetter',
                label: 'No. Surat Order'
            },
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchInvoices', params,
        function (hasResultCallback) {

        }, function (selectedCallback) {
            console.log(selectedCallback)
        }
    );

    // generate invoices
    var countAllInvoiceAmount = function (orderId, totalCallback) {
        Bisnis.Adv.OrderInvoices.fetchAll([{'order.id': orderId}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var amount = 0;
                if (memberData.length > 0) {
                    Bisnis.each(function (idx, memberData) {
                        amount = amount + memberData.amount;
                    }, memberData);
                }
                if (Bisnis.validCallback(totalCallback)) {
                    totalCallback(amount);
                }
            }, function () {
                if (Bisnis.validCallback(totalCallback)) {
                    totalCallback(0);
                    Bisnis.Util.Dialog.alert('Gagal mengambil data sisa');
                }
            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-generate-invoices', function () {
        var orderNumber = Bisnis.Util.Document.getDataValue(this, 'ordernumber');
        document.querySelector('#invoicesModal #orderNumber').innerHTML = orderNumber;

        var totalAmount = Bisnis.Util.Document.getDataValue(this, 'totalamount');
        var quantity = Bisnis.Util.Document.getDataValue(this, 'quantity');
        var netto = totalAmount * quantity;

        var orderId = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Storage.store('GENERATE_INV_ORDER_ID', orderId);
        Bisnis.Util.Storage.store('GENERATE_INV_NETTO', netto);

        countAllInvoiceAmount(orderId, function (totalCallback) {
            var sisa = parseFloat(netto) - parseFloat(totalCallback);
            document.querySelector('#invoicesModal #sisa').innerHTML = Bisnis.Util.Money.format(parseFloat(sisa));

            var amount = document.querySelector('#invoicesModal #amount');
            amount.value = sisa;
            amount.disabled = false;
            document.querySelector('#generateInvoice').disabled = false;

            if (sisa <= 0) {
                var amount = document.querySelector('#invoicesModal #amount');
                amount.value = '';
                amount.disabled = true;
                document.querySelector('#generateInvoice').disabled = true;
            }
        });

        loadInvoices(1, orderId);

        Bisnis.Util.Event.bind('click', '#invoicesPagination .pagePrevious', function () {
            loadInvoices(Bisnis.Util.Document.getDataValue(this, 'page'), orderId);
        });

        Bisnis.Util.Event.bind('click', '#invoicesPagination .pageNext', function () {
            loadInvoices(Bisnis.Util.Document.getDataValue(this, 'page'), orderId);
        });

        Bisnis.Util.Event.bind('click', '#invoicesPagination .pageFirst', function () {
            loadInvoices(1, orderId);
        });

        Bisnis.Util.Event.bind('click', '#invoicesPagination .pageLast', function () {
            loadInvoices(Bisnis.Util.Document.getDataValue(this, 'page'), orderId);
        });

        Bisnis.Util.Dialog.showModal('#invoicesModal');
        document.querySelector('#invoicesModal #amount').focus();
    });

    Bisnis.Adv.OrderInvoices.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/order-invoices',
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

    Bisnis.Util.Event.bind('click', '#generateInvoice', function () {
        document.querySelector('#generateInvoice').disabled = true;
        var d = new Date();
        var n = d.getMilliseconds();
        var orderId = Bisnis.Util.Storage.fetch('GENERATE_INV_ORDER_ID');
        var netto = Bisnis.Util.Storage.fetch('GENERATE_INV_NETTO');
        var invoicePage = Bisnis.Util.Storage.fetch(orderId + 'INVOICES_CURRENT_PAGE');
        var amount = document.querySelector('#invoicesModal #amount').value;
        var params = [
            {
                name: 'order',
                value: '/api/advertising/orders/' + orderId
            },
            {
                name: 'invoiceNumber',
                value: 'NO/21/INVOICE/NUMBER/' + n
            },
            {
                name: 'amount',
                value: amount
            }
        ];
        Bisnis.Adv.OrderInvoices.add(params,
            function () {
                countAllInvoiceAmount(orderId, function (totalCallback) {
                    var sisa = parseFloat(netto) - parseFloat(totalCallback);
                    Bisnis.Util.Storage.store('sisa', sisa);
                    document.querySelector('#invoicesModal #sisa').innerHTML = Bisnis.Util.Money.format(sisa);
                    if (sisa <= 0) {
                        var amount = document.querySelector('#invoicesModal #amount');
                        amount.value = '';
                        amount.disabled = true;
                        document.querySelector('#generateInvoice').disabled = true;
                    } else {
                        var amount = document.querySelector('#invoicesModal #amount');
                        amount.value = sisa;
                        amount.focus();
                        document.querySelector('#generateInvoice').disabled = false;
                    }
                });

                loadInvoices(invoicePage, orderId);
                invoiceList(orderId);
            }, function (response) {
                document.querySelector('#invoicesModal #amount').focus();
                document.querySelector('#generateInvoice').disabled = false;

                document.querySelector('#amountMessage').classList.remove('hidden');
                document.querySelector('#amountMessage').parentNode.classList.add('has-error');

                // console.log(document.querySelector('#amountMessage').parentNode)
            }
        );
    });

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
        var pageNum =
            (isNaN(pageNum) || 'undefined' === typeof pageNum || 'null' === pageNum ) ? 1 : parseInt(pageNum);
        Bisnis.Util.Storage.store(orderId + 'INVOICES_CURRENT_PAGE', pageNum);
        Bisnis.Adv.OrderInvoices.fetchAll([{page: pageNum},{'order.id': orderId}],
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
                            { value: invoiceStatus(memberData.status) }
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
    // end generate invoices

})(window.Bisnis || {});