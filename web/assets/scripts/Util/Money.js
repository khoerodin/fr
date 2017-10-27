(function (Bisnis) {
    Bisnis.Util.Money = {};

    Bisnis.Util.Money.format = function (amount, symbol) {
        symbol = symbol ? 'Rp ' : '';
        return accounting.formatMoney(amount, symbol, 0, ",", ".");
        return accounting.unformat(accounting.formatMoney(amount, symbol, 0, ",", "."));
    };

    Bisnis.Util.Money.unFormat = function (moneyString) {
        return accounting.unformat(moneyString);
    };

    Bisnis.Util.Money.formatInput = function (selector) {
        //this.value = Bisnis.Util.Money.format(this.value);

        Bisnis.Util.Event.bind('input', selector, function () {
            this.value = Bisnis.Util.Money.format( Bisnis.Util.Money.unFormat(this.value) );
        });
    };
})(window.Bisnis || {});