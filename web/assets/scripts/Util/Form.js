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

    Bisnis.Util.Form.hashPrepand = function (serializeArrayData) {
        var params = [];
        var prepend;
        serializeArrayData.forEach(function (value) {
            switch (value.name) {
                case 'postalCode':
                    prepend = "#";
                    break;
                case 'phoneNumber':
                    prepend = "#";
                    break;
                case 'faxNumber':
                    prepend = "#";
                    break;
                case 'taxNumber':
                    prepend = "#";
                    break;
                case 'taxPhoneNumber':
                    prepend = "#";
                    break;
                case 'taxFaxNumber':
                    prepend = "#";
                    break;
                case 'bankAccountNumber':
                    prepend = "#";
                    break;
                default:
                    prepend = "";
            }
            params.push({name: value.name, value: prepend+value.value});
        });
        return params;
    };
})(window.Bisnis || {});
