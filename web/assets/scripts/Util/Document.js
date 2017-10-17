(function (Bisnis) {
    Bisnis.Util.Document = {};

    Bisnis.Util.Document.putHtml = function (selector, content) {
        jQuery(selector).empty().html(content);
    };

    Bisnis.Util.Document.getHtml = function (selector) {
        return document.querySelector(selector).innerHTML;
    };

    Bisnis.Util.Document.getDataValue = function (selector, attribute) {
        return document.querySelector(selector).getAttribute('data-' + attribute);
    };

    Bisnis.Util.Document.putValue = function (selector, value) {
        document.querySelector(selector).value = value;
    };

    Bisnis.Util.Document.getValue = function (selector) {
        return document.querySelector(selector).value;
    };

    Bisnis.Util.Document.putEditor = function (selector, value) {
        jQuery(selector).summernote('code', value);
    };

    Bisnis.Util.Document.hide = function (selector) {
        jQuery(selector).hide();
    };

    Bisnis.Util.Document.hasClass = function (element, className) {
        return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
    };

    Bisnis.Util.Document.inArray = function (value, array) {
        Array.prototype.inArray = function (value)
        {
            // Returns true if the passed value is found in the
            // array. Returns false if it is not.
            var i;
            for (i=0; i < this.length; i++)
            {
                if (this[i] == value)
                {
                    return true;
                }
            }
            return false;
        };

        return array.inArray(value);
    };
})(window.Bisnis || {});