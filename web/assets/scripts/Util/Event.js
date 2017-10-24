(function (Bisnis) {
    Bisnis.Util.Event = {};

    Bisnis.Util.Event.triggerClick = function (selector) {
        jQuery(selector).click();
    };

    Bisnis.Util.Event.bind = function (event, selector, callback) {
        jQuery(document).on(event, selector, callback);
    };

    Bisnis.Util.Event.trigger = function (event, selector) {
        var event = new Event(event);
        document.querySelector(selector).dispatchEvent(event);
    };
})(window.Bisnis || {});