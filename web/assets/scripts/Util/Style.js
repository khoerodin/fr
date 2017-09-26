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

    Bisnis.Util.Style.ajaxSelect = function (selector, params, hasResultCallback, selectedCallback, openCallback, closeCallback) {
        var placeholder = typeof params.placeholder !== 'undefined' ? params.placeholder : 'CARI';
        var allowClear = typeof params.allowClear !== 'undefined' ? params.allowClear : false;
        var url = typeof params.url !== 'undefined' ? params.url : '';
        var method = typeof params.method !== 'undefined' ? params.method : 'POST';
        var module = typeof params.module !== 'undefined' ? params.module : '';
        var field = typeof params.field !== 'undefined' ? params.field : '';
        var fields = typeof params.fields !== 'undefined' ? params.fields : '';
        var minimumInputLength = typeof params.minimumInputLength !== 'undefined' ? params.minimumInputLength : 2;

        jQuery(selector).select2({
            theme: "bootstrap",
            placeholder: placeholder.toUpperCase(),
            allowClear: allowClear,
            ajax: {
                url: url,
                dataType: 'json',
                type: method.toUpperCase(),
                delay: 250,
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page,
                        module: module,
                        method: 'get',
                        field: field,
                        fields: fields
                    };
                },
                processResults: function (data) {

                    if(data.length > 0) {

                        if (Bisnis.validCallback(hasResultCallback)) {
                            hasResultCallback(true);
                        }

                        return {
                            results: $.map(data, function(obj) {
                                return { id: obj.id, text: obj[field] };
                            })
                        }
                    } else {

                        if (Bisnis.validCallback(hasResultCallback)) {
                            hasResultCallback(false);
                        }

                        return {
                            results: ''
                        }
                    }

                },
                cache: true,
            },
            escapeMarkup: function (markup) { return markup; },
            minimumInputLength: minimumInputLength
        }).on('select2:select', function () {
            if (Bisnis.validCallback(selectedCallback)) {
                var e = jQuery(selector + ' option:selected');
                var id = e.val();
                var text = e.text().split('~')[0].trim();
                var data = {id: id, text: text};
                selectedCallback(data);
            }
        }).on('select2:open', function () {
            if (Bisnis.validCallback(openCallback)) {
                openCallback(true);
            }
        }).on('select2:closing', function () {
            if (Bisnis.validCallback(closeCallback)) {
                closeCallback(true);
            }
        });
    };

    Bisnis.Util.Style.editor = function (selector) {
        jQuery(selector).summernote({
            tabsize: 4,
            height: 170,
            width: '100%'
        });
    };

    Bisnis.Util.Style.changeStyle = function (selector, css) {
        var element = jQuery(selector);
        Bisnis.each(function (idx, value) {
            element.css(value);
        }, css);
    };

    Bisnis.Util.Style.randomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';

        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    };
})(window.Bisnis || {});