(function (Bisnis) {
    Bisnis.Adv.PublishAds = {};

    Bisnis.Adv.PublishAds.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/publish-ads',
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

    Bisnis.Adv.PublishAds.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/publish-ads',
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