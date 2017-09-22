(function (Bisnis) {
    Bisnis.Util.Url = {};

    Bisnis.Util.Url.getQueryParam = function (paramKey, url) {
        var sPageURL = 'undefined' === url ? window.location.search.substring(1) : url;
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === paramKey) {
                return sParameterName[1];
            }
        }
    };
})(window.Bisnis || {});