(function (Bisnis) {
    Bisnis.Adv.AccountExecutiveCategories = {};

    Bisnis.Adv.AccountExecutiveCategories.fetchAll = function (params, callback) {
        Bisnis.request({
            module: 'advertising/account-executive-categories',
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

    Bisnis.Adv.AccountExecutiveCategories.add = function (params, callback) {
        Bisnis.request({
            module: 'advertising/account-executive-categories',
            method: 'post',
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

    Bisnis.Adv.AccountExecutiveCategories.delete = function (id, callback) {
        Bisnis.request({
            module: 'advertising/account-executive-categories/' + id,
            method: 'delete'
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(callback)) {
                callback(textStatus);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };

})(window.Bisnis || {});