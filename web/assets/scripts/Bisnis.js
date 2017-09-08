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

    Bisnis.getQueryParam = function (paramKey, url) {
        var sPageURL = 'undefined' === url ? window.location.search.substring(1) : url;
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === paramKey) {
                return sParameterName[1];
            }
        }
    };

    /** Module List */
    Bisnis.Helpdesk = {};
    Bisnis.Util = {};

    window.Bisnis = Bisnis;
})(window);