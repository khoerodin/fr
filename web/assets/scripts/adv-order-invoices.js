(function (Bisnis) {
    Bisnis.Advertising.Invoices = {};

    Bisnis.Advertising.Invoices.fetchAll = function (params, callback) {
        Bisnis.request({
            module: 'advertising/orders',
            method: 'get',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);
            var memberData = rawData['hydra:member'];

            if (Bisnis.validCallback(callback)) {
                callback(memberData);
            }
        }, function () {
            console.log('Oo');
        });
    };

    Bisnis.Advertising.Invoices.fetchAll([], function (memberData) {
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

    Bisnis.Util.Event.bind('click', '.btn-generate-invoices', function () {
        Bisnis.Util.Dialog.showModal('#invoicesModal');
    });

    Bisnis.Util.Event.bind('click', '.btn-invoices', function () {
        Bisnis.Util.Dialog.yesNo('GO TO INVOICE', 'KE HALAMAN FAKTUR');
    });

})(window.Bisnis || {});