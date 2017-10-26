(function (Bisnis) {
    Bisnis.Util.Money = {};

    Bisnis.Util.Money.format = function (amount, symbol) {
        symbol = symbol ? 'Rp ' : '';
        return accounting.formatMoney(amount, symbol, 0, ".", ",");
    };
})(window.Bisnis || {});