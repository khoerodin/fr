(function (Bisnis) {
    Bisnis.Admin.Roles = {};

    Bisnis.Admin.Roles.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'roles',
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