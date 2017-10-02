(function (Bisnis) {
    Bisnis.Adv.OrdersInvoices = {};

    Bisnis.Adv.OrdersInvoices.fetchAll = function (params, callback) {
        Bisnis.request({
            module: 'advertising/orders',
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

    var loadPage = function (pageNum) {
        Bisnis.Adv.OrdersInvoices.fetchAll([{page: pageNum}], function (rawData) {
            var memberData = rawData['hydra:member'];
            var viewData = rawData['hydra:view'];

            if ('undefined' !== typeof viewData['hydra:last']) {
                var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);

                Bisnis.Util.Storage.store('INVOICE_CURRENT_PAGE', currentPage);
                Bisnis.Util.Grid.createPagination('#invoicePagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
            }

            var records = [];
            Bisnis.each(function (idx, memberData) {

                var invoiceAs;
                switch (memberData.printInvoiceAs) {
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

                records.push([
                    { value: memberData.orderNumber },
                    { value: memberData.title },
                    { value: invoiceAs },
                    { value: memberData.id, format: function (id) {
                        return '<button class="btn btn-xs btn-flat btn-success btn-invoices">no faktur</button>&nbsp;' +
                            '<button class="btn btn-xs btn-flat btn-success btn-invoices">no faktur</button>&nbsp;' +
                            '<button class="btn btn-xs btn-flat btn-success btn-invoices">no faktur</button>';
                    }},
                    { value: memberData.id, format: function (id) {
                        return '<span class="pull-right"><button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-generate-invoices" title=""><i class="fa fa-file-text-o"></i></button></span>';
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