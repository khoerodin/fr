(function (window) {
    var Bisnis = {};

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

    Bisnis.each = function (callback, iterable) {
        if (Bisnis.validCallback(callback)) {
            jQuery.each(iterable, callback);
        }
    };

    Bisnis.validCallback = function(callback) {
        return 'function' === typeof callback;
    };

    Bisnis.putHtml = function (selector, content) {
        jQuery(selector).html(content);
    };

    Bisnis.getHtml = function (selector) {
        return jQuery(selector).html();
    };

    Bisnis.putValue = function (selector, value) {
        jQuery(selector).val(value);
    };

    Bisnis.getValue = function (selector) {
        return jQuery(selector).val();
    };

    Bisnis.bind = function (event, selector, callback) {
        jQuery(document).on(event, selector, callback);
    };

    Bisnis.click = function (selector) {
        jQuery(selector).click();
    };

    Bisnis.showModal = function (selector) {
        jQuery(selector).modal({show: true, backdrop: 'static'});
    };

    Bisnis.hideModal = function (selector) {
        jQuery(selector).modal('hide');
    };

    Bisnis.getData = function (selector, attribute) {
        return jQuery(selector).data(attribute);
    };

    Bisnis.store = function (key, value) {
        localStorage.setItem(key, value);
    };

    Bisnis.fetch = function (key) {
        return localStorage.getItem(key);
    };

    Bisnis.modifySelect = function (selector) {
        jQuery(selector).select2({
            theme: "bootstrap"
        });
    };

    /** Module List */
    Bisnis.Helpdesk = {};
    Bisnis.Util = {};

    window.Bisnis = Bisnis;
})(window);