(function (Bisnis) {
    Bisnis.Util.Form = {};

    Bisnis.Util.Form.serializeArray = function (selector) {
        //Store the reference to the original method:
        var _serializeArray = jQuery.fn.serializeArray;

        //Now extend it with newer "unchecked checkbox" functionality:
        jQuery.fn.extend({
            serializeArray: function() {
                //Important: Get the results as you normally would...
                var results = _serializeArray.call(this);

                //Now, find all the checkboxes and append their "checked" state to the results.
                this.find('input[type=checkbox]').each(function(id, item) {
                    var $item = jQuery(item);
                    results.push({name: $item.attr('name'), value: $item.is(":checked") ? true : false});
                });
                return results;
            }
        });

        return jQuery(selector).serializeArray();
    };
})(window.Bisnis || {});
