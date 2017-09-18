(function (Bisnis) {
    Bisnis.Helpdesk.Category = {};

    Bisnis.Helpdesk.Category.fetchAll = function (callback) {
        Bisnis.request({
            module: 'helpdesk/categories',
            method: 'get',
            params: []
        }, function (response) {
            var rawData = JSON.parse(response);
            var categories = rawData['hydra:member'];

            if (Bisnis.validCallback(callback)) {
                callback(categories);
            }
        }, function () {
            console.log('KO');
        });
    };

})(window.Bisnis || {});