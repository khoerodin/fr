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
                    results.push({name: $item.attr('name'), value: !!$item.is(":checked")});
                });
                return results;
            }
        });

        return jQuery(selector).serializeArray();
    };

    Bisnis.Util.Form.hashPrepand = function (fieldsArray, serializeArray) {
        var params = [];
        serializeArray.forEach(function (value) {
            if (Bisnis.Util.Document.inArray(value.name, fieldsArray)) {
                params.push({name: value.name, value: '#'+value.value});
            } else {
                params.push({name: value.name, value: value.value});
            }
        });
        return params;
    };

    Bisnis.Util.Form.formatDate = function (fieldsArray, serializeArray, format) {
        var params = [];
        serializeArray.forEach(function (value) {
            if (Bisnis.Util.Document.inArray(value.name, fieldsArray)) {
                params.push({name: value.name, value: moment(value.value, format).format()});
            } else {
                params.push({name: value.name, value: value.value});
            }
        });
        return params;
    };

    Bisnis.Util.Form.rmArrayDuplicates = function (data) {
        if (data instanceof Array ) {
            return data.filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });
        } else {
            console.error(data + ' bukan berupa array');
        }
    };

    Bisnis.Util.Form.unFormatMoney = function (fieldsArray, serializeArray) {
        var params = [];
        serializeArray.forEach(function (value) {
            if (Bisnis.Util.Document.inArray(value.name, fieldsArray)) {
                var unFormatMoney = Bisnis.Util.Money.unFormat(value.value);
                params.push({name: value.name, value: unFormatMoney});
            } else {
                params.push({name: value.name, value: value.value});
            }
        });
        return params;
    };
})(window.Bisnis || {});
