(function (Bisnis) {
    Bisnis.Adv.OrderInvoices = {};

    Bisnis.Adv.OrderInvoices.fetchAll = function (params, callback) {
        Bisnis.request({
            module: 'advertising/order-invoices',
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

    var invoiceList = function (orderId) {
        var records = 'BELUM ADA';
        Bisnis.Adv.OrderInvoices.fetchAll([{'order.id': orderId}], function (callback) {
            var memberData = callback['hydra:member'];
            if (memberData.length > 0) {
                Bisnis.each(function (idx, memberData) {
                    records = records + '<button class="btn btn-xs btn-flat btn-success btn-invoices" style="margin-right: 5px;">'+memberData.invoiceNumber+'</button>';
                }, memberData);
            }
        });
        return records;
    };

    var invoiceStatus = function (printInvoiceAs) {
        var invoiceAs;
        switch (printInvoiceAs) {
            case 'n':
                invoiceAs = '<span class="label label-success">NORMAL</span>';
                break;
            case 'p':
                invoiceAs = '<label class="label label-danger">PECAH</label>';
                break;
            case 'b':
                invoiceAs = '<label class="label label-warning">GABUNG</label>';
                break;
            default:
                invoiceAs = '<span class="label label-success">NORMAL</span>';
        }

        return invoiceAs;
    };

    var loadPage = function (pageNum) {
        Bisnis.Adv.Orders.fetchAll([{page: pageNum}], function (rawData) {
            var memberData = rawData['hydra:member'];
            var viewData = rawData['hydra:view'];

            if ('undefined' !== typeof viewData['hydra:last']) {
                var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);

                Bisnis.Util.Storage.store('INVOICE_CURRENT_PAGE', currentPage);
                Bisnis.Util.Grid.createPagination('#invoicePagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
            }

            var records = [];
            Bisnis.each(function (idx, memberData) {
                records.push([
                    { value: memberData.orderNumber },
                    { value: memberData.title },
                    { value: invoiceStatus(memberData.printInvoiceAs) },
                    { value: memberData.id, format: function (id) {
                        return ''+invoiceList(memberData.id)+'';
                    }},
                    { value: memberData.id, format: function (id) {
                        return '<span class="pull-right"><button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-generate-invoices" title="GENERATE INVOICE"><i class="fa fa-file-text-o"></i></button></span>';
                    }}
                ]);
            }, memberData);
            Bisnis.Util.Grid.renderRecords('#invoicesList', records);
        });
    };

    loadPage(1);

    Bisnis.Util.Event.bind('click', '#invoicePagination .pagePrevious', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#invoicePagination .pageNext', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#invoicePagination .pageFirst', function () {
        loadPage(1);
    });

    Bisnis.Util.Event.bind('click', '#invoicePagination .pageLast', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '.btn-generate-invoices', function () {
        Bisnis.Util.Dialog.showModal('#invoicesModal');
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
            //selectedCallback = {disabled, element, id, label, selected, text, _resultId}
            console.log(selectedCallback)
        }, function (openCallback) {

        }, function (closeCallback) {

        }
    );

})(window.Bisnis || {});