(function (Bisnis) {
    Bisnis.Adv.Prices = {};

    Bisnis.Adv.Prices.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/prices',
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
})(window.Bisnis || {});