(function (Bisnis) {
    Bisnis.Adv.AccountExecutiveCategories = {};

    Bisnis.Adv.AccountExecutiveCategories.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executive-categories',
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

    Bisnis.Adv.AccountExecutiveCategories.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executive-categories',
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

    Bisnis.Adv.AccountExecutiveCategories.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executive-categories/' + id,
            method: 'delete'
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