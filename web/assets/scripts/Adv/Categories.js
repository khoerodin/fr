(function (Bisnis) {
    Bisnis.Adv.Categories = {};

    Bisnis.Adv.Categories.fetchAll = function (params, callback) {
        Bisnis.request({
            module: 'advertising/categories',
            method: 'get',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);
            var memberData = rawData['hydra:member'];

            if (Bisnis.validCallback(callback)) {
                callback(memberData);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };
})(window.Bisnis || {});