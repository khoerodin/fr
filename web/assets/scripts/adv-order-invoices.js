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
            records.push([
                { value: memberData.orderNumber },
                { value: memberData.title },
                { value: memberData.id, format: function (id) {
                    return '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat" title=""><i class="fa fa-pencil"></i></button>';
                }}
            ]);
        }, memberData);
        Bisnis.Util.Grid.renderRecords('#invoicesList', records);
    });

})(window.Bisnis || {});