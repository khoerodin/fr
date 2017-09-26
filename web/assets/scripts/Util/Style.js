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
        var url = typeof params.url !== 'undefined' ? params.url : '/api/searchGrid';
        var method = typeof params.method !== 'undefined' ? params.method : 'POST';
        var module = typeof params.module !== 'undefined' ? params.module : '';
        var fields = typeof params.fields !== 'undefined' ? params.fields : '';
        var minimumInputLength = typeof params.minimumInputLength !== 'undefined' ? params.minimumInputLength : 2;

        var optionTemplate = function (data) {
            if (!data.id) {
                return data.text;
            }

            var $state = $(
                '<span>' + data.text + ' ~ <em>' + data.label + '</em></span>'
            );
            return $state;
        };

        jQuery(selector).select2({
            theme: "bootstrap",
            placeholder: placeholder.toUpperCase(),
            allowClear: allowClear,
            templateResult: optionTemplate,
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
                                return { id: obj.id, text: obj['text'], label: obj['label'] };
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
                var e = jQuery(selector).select2('data');
                // e[0] = {disabled, element, id, label, selected, text, _resultId}
                selectedCallback(e[0]);
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
})(window.Bisnis || {});