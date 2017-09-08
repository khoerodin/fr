(function (Bisnis) {
    Bisnis.Util.Event = {};

    Bisnis.Util.Event.triggerClick = function (selector) {
        jQuery(selector).click();
    };

    Bisnis.Util.Event.bind = function (event, selector, callback) {
        jQuery(document).on(event, selector, callback);
    };
})(window.Bisnis || {});