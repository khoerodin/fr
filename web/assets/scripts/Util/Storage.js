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
})(window.Bisnis || {});