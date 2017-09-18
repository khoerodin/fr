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

    Bisnis.getQueryVariable = function (variable, query = decodeURIComponent(window.location.search.substring(1))) {
        var vars = query.split("&");
        if(typeof variable !== 'undefined') {
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
            }
        } else {
            var keys = [];
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                var param = {};
                param[pair[0]] = pair[1];

                keys.push(param);
            }
            return keys;
        }
        return(false);
    }

    Bisnis.getUrlParamValue = function(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
    }

    Bisnis.changeUrlParam = function (param, value) {
        var currentURL = window.location.href+'&';
        currentURL = currentURL.replace('#','');
        var change = new RegExp('('+param+')=(.*)&', 'g');
        var newURL = currentURL.replace(change, '$1='+value+'&');

        if (Bisnis.getUrlParamValue(param) !== null){
            try {
                window.history.replaceState('', '', newURL.slice(0, - 1) );
            } catch (e) {

            }
        } else {
            var currURL = window.location.href;
            if (currURL.indexOf("?") !== -1){
                window.history.replaceState('', '', currentURL.slice(0, - 1) + '&' + param + '=' + value);
            } else {
                window.history.replaceState('', '', currentURL.slice(0, - 1) + '?' + param + '=' + value);
            }
        }
    };

    /** Module List */
    Bisnis.Helpdesk = {};
    Bisnis.Advertising = {};
    Bisnis.Util = {};
    Bisnis.Notification = {};

    window.Bisnis = Bisnis;
})(window);