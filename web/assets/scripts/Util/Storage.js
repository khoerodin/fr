(function (Bisnis) {
    Bisnis.Util.Storage = {};

    Bisnis.Util.Storage.store = function (key, value) {
        window.localStorage.setItem(key, value);
    };

    Bisnis.Util.Storage.fetch = function (key) {
        return window.localStorage.getItem(key);
    };

    Bisnis.Util.Storage.remove = function (key) {
        return window.localStorage.removeItem(key);
    };

    Bisnis.Util.Storage.storeArray = function(name, data) {
        var a = JSON.parse(window.localStorage.getItem(name));
        var b = a ? a : [];
        b.push(data);
        window.localStorage.setItem(name, JSON.stringify(b));
    };

    Bisnis.Util.Storage.removeArray = function(name, data) {
        var a = JSON.parse(window.localStorage.getItem(name));
        var b = a ? a : [];
        var i = b.indexOf(data);
        if(i !== -1) {
            b.splice(i, 1);
        }
        window.localStorage.setItem(name, JSON.stringify(b));
    };

    Bisnis.Util.Storage.removeByKeyPrefix = function (prefix) {
        let arr = []; // Array to hold the keys
        // Iterate over localStorage and insert the keys that meet the condition into arr
        for (let i = 0; i < window.localStorage.length; i++){
            if (window.localStorage.key(i).substring(0, prefix.length) === prefix) {
                arr.push(window.localStorage.key(i));
            }
        }

        // Iterate over arr and remove the items by key
        for (let i = 0; i < arr.length; i++) {
            window.localStorage.removeItem(arr[i]);
        }

    }
})(window.Bisnis || {});