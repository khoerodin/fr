(function (Bisnis) {
    Bisnis.Util.Storage = {};

    Bisnis.Util.Storage.store = function (key, value) {
        localStorage.setItem(key, value);
    };

    Bisnis.Util.Storage.fetch = function (key) {
        return localStorage.getItem(key);
    };

    Bisnis.Util.Storage.remove = function (key) {
        return localStorage.removeItem(key);
    };

    Bisnis.Util.Storage.storeArray = function(name, data) {
        var a = JSON.parse(localStorage.getItem(name));
        var b = a ? a : [];
        b.push(data);
        localStorage.setItem(name, JSON.stringify(b));
    };

    Bisnis.Util.Storage.removeArray = function(name, data) {
        var a = JSON.parse(localStorage.getItem(name));
        var b = a ? a : [];
        var i = b.indexOf(data);
        if(i !== -1) {
            b.splice(i, 1);
        }
        localStorage.setItem(name, JSON.stringify(b));
    };
})(window.Bisnis || {});