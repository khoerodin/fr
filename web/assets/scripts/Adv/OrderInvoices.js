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
})(window.Bisnis || {});