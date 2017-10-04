(function (Bisnis) {
    Bisnis.Util.DatePicker = {};

    Bisnis.Util.DatePicker.render = function (selector, defaultDate) {
        var defaultDate = typeof defaultDate !== 'undefined' ? moment(defaultDate) : moment();
        jQuery(selector).datetimepicker({
            locale: 'id',
            format: "DD/MM/YYYY",
            ignoreReadonly: true,
            defaultDate: defaultDate
        });
    };
})(window.Bisnis || {});