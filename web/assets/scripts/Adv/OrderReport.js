(function (Bisnis) {
    Bisnis.Adv.Report = {};

    var reportApi = function (params) {
        Bisnis.request({
            module: 'advertising/orders/report.json',
            method: 'get',
            params: [params]
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                callback(JSON.parse(response));
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Adv.Report.byRepresentative = function (representative, year, filters) {

    };
})(window.Bisnis || {});