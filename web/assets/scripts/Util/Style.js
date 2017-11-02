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
        var prependValue = typeof params.prependValue !== 'undefined' ? params.prependValue : '';
        var appendValue = typeof params.appendValue !== 'undefined' ? params.appendValue : '';
        var filters = params.filters;

        var optionTemplate = function (data) {
            if (!data.id) {
                return data.text;
            }

            var $state = $(
                '<span>' + data.text + ' ~ <em>' + data.label + '</em></span>'
            );
            return $state;
        };

        var history = !!params.showHistory;

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
                        fields: fields,
                        filters : filters
                    };
                },
                processResults: function (data) {

                    if(data.length > 0) {

                        if (Bisnis.validCallback(hasResultCallback)) {
                            hasResultCallback(true);
                        }

                        return {
                            results: jQuery.map(data, function(obj) {
                                return { id: prependValue+obj.id+appendValue, text: obj['text'], label: obj['label'] };
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
                var e = jQuery(selector).select2('data')[0];
                // e = {disabled, element, id, label, selected, text, _resultId}
                selectedCallback(e);
                var data = {
                    id: e.id,
                    text: e.text,
                    label: e.label
                };

                if (history) {
                    createHistory(selector, data);
                }
            }
        }).on('select2:open', function () {
            if (Bisnis.validCallback(openCallback)) {
                openCallback(true);
            }
            if (history) {
                showHistory(selector, function (selectedHistoryData) {
                    if (Bisnis.validCallback(selectedCallback)) {
                        selectedCallback(selectedHistoryData);
                    }
                });
            }
        }).on('select2:closing', function () {
            if (Bisnis.validCallback(closeCallback)) {
                closeCallback(true);
            }
        });
    };

    Bisnis.Util.Style.destroySelect = function (selector) {
        jQuery(selector).select2('destroy');
    };

    Bisnis.Util.Style.resetSelect = function (selector) {
        jQuery(selector).val([]);
    };

    Bisnis.Util.Style.editor = function (selector) {
        jQuery(selector).summernote({
            tabsize: 4,
            height: 170,
            width: '100%'
        });
    };

    var removeDuplicate = function (arr) {
        var hashTable = {};

        return arr.filter(function (el) {
            var key = JSON.stringify(el);
            var match = Boolean(hashTable[key]);

            return (match ? false : hashTable[key] = true);
        });
    };

    var createHistory = function (selector, data, callback) {
        var id = data.id, text = data.text, label = data.label;

        if(selector+"searchHistory" in localStorage){
            var searchStorage = localStorage.getItem(selector+'searchHistory');
            var searchHistory = JSON.parse(searchStorage);
            searchHistory.push({id: id, text: text, label: label});

            searchHistory = removeDuplicate(searchHistory);

            if (searchHistory.length > 5) searchHistory.splice(0, searchHistory.length - 5);
            localStorage.setItem(selector+'searchHistory', JSON.stringify(searchHistory));
        } else {
            var searchHistory = ( typeof searchHistory != 'undefined' && searchHistory instanceof Array ) ? searchHistory : [];
            searchHistory.push({id: id, text: text, label: label});
            localStorage.setItem(selector+'searchHistory', JSON.stringify(searchHistory));
        }

        if (Bisnis.validCallback(callback)) {
            callback();
        }
    };

    var showHistory = function (selector, callback) {
        if(selector+"searchHistory" in localStorage){
            var searchStorsge = localStorage.getItem(selector+'searchHistory');
            var searchHistory = JSON.parse(searchStorsge).reverse();
            var opt = '';
            jQuery.each(searchHistory, function (index, value) {
                if (index === 0) {
                    var selected = 'selected';
                }
                opt += '<li class="optionHistory '+selected+' select2-results__option" data-id="'+value.id+'" data-text="'+value.text+'" data-label="'+value.label+'">'+value.text+' ~ <em>'+value.label+'</em></li>';
            });

            setTimeout(function(){
                jQuery('.select2-results__options').html(opt);

                jQuery('.optionHistory').hover(
                    function () {
                        jQuery(this).addClass('selected');
                    },

                    function () {
                        jQuery(this).removeClass('selected');
                    }
                );

                jQuery('.optionHistory').click(function (e) {
                    var id = jQuery(this).data('id');
                    var text = jQuery(this).data('text');
                    var label = jQuery(this).data('label');

                    if(selector+"searchHistory" in localStorage){
                        var searchStorage = localStorage.getItem(selector+'searchHistory');
                        var searchHistory = JSON.parse(searchStorage);
                        searchHistory.push({id: id, text: text, label: label});

                        searchHistory = removeDuplicate(searchHistory);

                        if (searchHistory.length > 5) searchHistory.splice(0, searchHistory.length - 5);
                        localStorage.setItem(selector+'searchHistory', JSON.stringify(searchHistory));
                    } else {
                        var searchHistory = ( typeof searchHistory != 'undefined' && searchHistory instanceof Array ) ? searchHistory : [];
                        searchHistory.push({id: id, text: text, label: label});
                        localStorage.setItem(selector+'searchHistory', JSON.stringify(searchHistory));
                    }

                    jQuery(selector).select2('close');

                    if (Bisnis.validCallback(callback)) {
                        var data = {
                            id: id,
                            text: text,
                            label: label,
                        };
                        callback(data);
                    }
                });


            }, 1);
        }
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

    Bisnis.Util.Style.multipleSelect = function (selector, moduleUrl) {
        jQuery(selector).select2({
            tags: true,
            theme: 'bootstrap',
            tokenSeparators: [','],
            createTag: function (tag) {

                // Check if the option is already there
                var found = false;
                jQuery(selector + " option").each(function() {
                    if ($.trim(tag.term).toUpperCase() === $.trim(jQuery(this).text()).toUpperCase()) {
                        found = true;
                    }
                });

                // Show the suggestion only if a match was not found
                if (!found) {
                    return {
                        id: tag.term,
                        text: tag.term.toUpperCase(),
                        isNew: true
                    };
                }
            }
        }).on("change", function(e) {
            var isNew = jQuery(this).find('[data-select2-tag="true"]');
            if(isNew.length){
                isNew.replaceWith('<option value="'+e.timeStamp+'">'+isNew.val().toUpperCase()+'</option>');
                jQuery.ajax({
                    type: 'post',
                    url: '/api',
                    data: {
                        module : moduleUrl,
                        method: 'post',
                        params: [
                            {
                                name: 'name',
                                value: isNew.val()
                            }
                        ]
                    },
                    success: function (data) {
                        jQuery('option[value="'+e.timeStamp+'"]').attr('value', data.id).prop('selected', true);
                    },
                    error: function () {
                        jQuery('option[value="'+e.timeStamp+'"]').remove();
                    }
                });
            }
        });
    };

})(window.Bisnis || {});