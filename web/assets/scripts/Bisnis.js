(function (window) {
    var Bisnis = {};

    Bisnis.each = function (callback, iterable) {
        if (Bisnis.validCallback(callback)) {
            jQuery.each(iterable, callback);
        }
    };

    Bisnis.validCallback = function(callback) {
        return 'function' === typeof callback;
    };

    Bisnis.init = function (callback) {
        if ('undefined' === typeof window.jQuery) {
            console.log('jQuery is need to start this app.');
        }

        if (Bisnis.validCallback(callback)) {
            jQuery(document).ready(callback);
        }
    };

    Bisnis.request = function (params, successCallback, errorCallback, url, method) {
        url = 'undefined' === typeof url ? '/api' : url;
        method = 'undefined' === typeof method ? 'post' : method;
        params.params = 'undefined' === typeof params.params ? [] : params.params;

        if (method.toUpperCase() === 'post') {
            params.params.push({
                order: {
                    createdAt: 'DESC'
                }
            });
        }

        jQuery.ajax({
            url: url,
            type: method.toUpperCase(),
            data: params,
            beforeSend: function () {},
            success: function (dataResponse, textStatus, response) {
                if (Bisnis.validCallback(successCallback)) {
                    successCallback(dataResponse, textStatus, response);
                }
            },
            error: function (response, textStatus, errorThrown) {
                if (Bisnis.validCallback(errorCallback)) {
                    errorCallback(response, textStatus, errorThrown);
                }
            }
        });
    };

    Bisnis.errorMessage = function (message) {
        toastr.error(message);
    };

    Bisnis.successMessage = function (message) {
        toastr.success(message);
    };

    /** Module List */
    Bisnis.Helpdesk = {};
    Bisnis.SimpleGrid = {};
    Bisnis.Util = {};
    Bisnis.Notification = {};
    Bisnis.Adv = {};

    window.Bisnis = Bisnis;
})(window);