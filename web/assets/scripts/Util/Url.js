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

    Bisnis.Util.Url.getQueryVariable = function (variable, query = decodeURIComponent(window.location.search.substring(1))) {
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
    };

    Bisnis.Util.Url.getUrlParamValue = function(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
    }

    Bisnis.Util.Url.changeUrlParam = function (param, value) {
        var currentURL = window.location.href+'&';
        currentURL = currentURL.replace('#','');
        var change = new RegExp('('+param+')=(.*)&', 'g');
        var newURL = currentURL.replace(change, '$1='+value+'&');

        if (Bisnis.Util.Url.getUrlParamValue(param) !== null){
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


})(window.Bisnis || {});