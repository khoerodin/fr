(function (Bisnis) {
    Bisnis.Util.Style = {};

    Bisnis.Util.Style.bold = function (selector) {
        jQuery(selector).css('font-weight', 'bold');
    };

    Bisnis.Util.Style.modifySelect = function (selector) {
        jQuery(selector).select2({
            theme: 'bootstrap'
        });
    };
})(window.Bisnis || {});