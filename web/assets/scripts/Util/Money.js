(function (Bisnis) {
    Bisnis.Util.Money = {};

    Bisnis.Util.Money.format = function (amount) {
        return accounting.formatMoney(amount, { symbol: "IDR",  format: "%v" });
    };
})(window.Bisnis || {});