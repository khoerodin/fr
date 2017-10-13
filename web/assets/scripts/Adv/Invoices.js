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
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail" title="DETAIL"><i class="fa fa-eye"></i></button>' +
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
            if (hasResultCallback) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }, function (selectedCallback) {
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddInvoice');
            if (openCallback === false) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddInvoice');
            setTimeout(function () {
                if (closeCallback === false) {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }
            }, 300);
        }
    );

    // End Invoices List

    // Add Incvoice Modal

    var fetchSelect = function (selector, selectedCallback) {
        var params = {
            placeholder: 'CARI NO. ORDER',
            module: 'advertising/orders',
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

        Bisnis.Adv.OrderInvoices.fetchAll([{'order.id': orderId}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var netto = Bisnis.Util.Storage.fetch('netto' + orderId);
                var pecahAmount = document.querySelector('#pecahAmount');
                var btnPecahInvoice = document.querySelector('#btn-pecah-invoice');
                var sisa = document.querySelector('#sisa');

                if ( memberData.length < 1 ) {
                    finalAmount = Bisnis.Util.Storage.fetch('netto' + orderId);
                    sisa.value = Bisnis.Util.Money.format(finalAmount);
                    pecahAmount.disabled = false;
                    btnPecahInvoice.disabled = false;
                    pecahAmount.value = finalAmount;
                    pecahAmount.focus();
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

                            var finalAmount = parseFloat(netto) - parseFloat(amount);
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

    Bisnis.Util.Event.bind('click', '#btnAddInvoice', function () {
        fetchSelect('#normalOrder', function (selected) {
            var id = selected.id.split('/')[4];
            Bisnis.Util.Storage.store('normalOrderId', id);

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
                        document.querySelector('#normalForm').classList.add('has-error');
                        document.querySelector('#hasNormalInvoice').classList.remove('hidden');
                    } else {
                        document.querySelector('#normalForm #btn-normal-invoice').disabled = false;
                        document.querySelector('#normalForm').classList.remove('has-error');
                        document.querySelector('#hasNormalInvoice').classList.add('hidden');
                    }
                },
                function () {
                    Bisnis.Util.Dialog.alert('PERHATIAN','GAGAL VALIDASI FAKTUR');
                    document.querySelector('#normalForm #btn-normal-invoice').disabled = true;
                }
            );
        });
        
        fetchSelect('#pecahOrder', function (selected) {
            var orderId = selected.id.split('/')[4];
            Bisnis.Util.Storage.store('pecahOrderId', orderId);
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
        });

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
        var params = [
            {
                name: 'invoiceNumber',
                value: 'INVC/001/2978329/2017'
            },
            {
                name: 'amount',
                value: document.querySelector('#normalForm #amount').value
            },
        ];
        Bisnis.Adv.Invoices.add(params,
            function (dataResponse) {
                var orderId = Bisnis.Util.Storage.fetch('normalOrderId');
                storeOrderInvoice(orderId, dataResponse.id);
                Bisnis.Util.Dialog.hideModal('#addModal');
            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMBUAT FAKTUR');
                Bisnis.Util.Dialog.hideModal('#addModal');
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

    var addInvoice = function (orderId, amount) {
        var params = [
            {
                name: 'invoiceNumber',
                value: 'INVC/001/2978329/2017'
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
            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMBUAT FAKTUR');
            }
        );
    };

    // add pecah invoice
    Bisnis.Util.Event.bind('click', '#btn-pecah-invoice', function () {
        var orderId = Bisnis.Util.Storage.fetch('pecahOrderId');

        if ( Bisnis.Util.Storage.fetch('INVOICE_PECAH_ID') ) {
            var invoiceId = Bisnis.Util.Storage.fetch('INVOICE_PECAH_ID');
            storeOrderInvoice(orderId, invoiceId, function (callback) {
                if (callback) {
                    var pageNum = Bisnis.Util.Storage.fetch('INVOICE_PECAH_PAGE');
                    loadInvoices(pageNum, orderId);
                }
            });
        } else {
            var amount = document.querySelector('#pecahForm #pecahAmount').value;
            isGreater(orderId, amount,
                function (callback) {
                    if (callback === false) {
                        addInvoice(orderId, amount);
                    } else {
                        Bisnis.Util.Dialog.alert('PERHATIAN', 'JUMLAH YANG ANDA MASUKKAN TIDAK BOLEH MELEBIHI SISA');
                    }
                }
            );
        }
    });
    // End Add Incvoice Modal

    // reset modal form on modal hidden
    Bisnis.Util.Dialog.hiddenModal('#addModal', function () {
        Bisnis.Util.Grid.removeErrorForm('normalForm');
        document.getElementById("normalForm").reset();
        document.querySelector('#normalForm #normalOrder').value = [];

        Bisnis.Util.Grid.removeErrorForm('pecahForm');
        document.getElementById("pecahForm").reset();
        document.querySelector('#pecahForm #pecahOrder').value = [];

        Bisnis.Util.Storage.remove('INVOICE_PECAH_ID');
        document.querySelector('#invoicePecahList').innerHTML = '';
        document.querySelector('#pecahAmount').value = '';
        document.querySelector('#btn-pecah-invoice').disabled = false;
        document.querySelector('#sisa').value = '';

        /*Bisnis.Util.Grid.removeErrorForm('gabungForm');
        document.getElementById("gabungForm").reset();*/
    });
    // end reset modal form on modal hidden
})(window.Bisnis || {});