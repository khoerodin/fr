(function (Bisnis) {
    Bisnis.Util.CheckToggle = {};

    Bisnis.Util.CheckToggle.render = function (selector) {
        jQuery(selector).bootstrapToggle();
    };
})(window.Bisnis || {});