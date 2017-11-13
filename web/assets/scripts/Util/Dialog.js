(function (Bisnis) {
    Bisnis.Util.Dialog = {};

    Bisnis.Util.Dialog.yesNo = function (title, message, callback) {
        bootbox.confirm({
            title: title,
            message: message,
            animate: false,
            buttons: {
                cancel: {
                    label: 'Batal',
                    className: "btn btn-default btn-flat"
                },
                confirm: {
                    label: 'Ya',
                    className: "btn btn-danger btn-flat"
                }
            },
            callback: function (result) {
                if (Bisnis.validCallback(callback)) {
                    callback(result);
                }
            }
        });
    };

    Bisnis.Util.Dialog.alert = function (title, message, callback) {
        bootbox.alert({
            title: title,
            message: message,
            animate: false,
            buttons: {
                ok: {
                    label: 'OKE',
                    className: "btn btn-danger btn-flat"
                }
            },
            callback: function(result){
                if (Bisnis.validCallback(callback)) {
                    callback(result);
                }
            }
        });
        jQuery('.bootbox-alert button').focus();
    };

    Bisnis.Util.Dialog.showModal = function (selector) {
        jQuery(selector).modal({show: true, backdrop: 'static'});
    };

    Bisnis.Util.Dialog.hideModal = function (selector) {
        jQuery(selector).modal('hide');
    };

    Bisnis.Util.Dialog.hiddenModal = function (selector, callback) {
        jQuery(selector).on('hidden.bs.modal', function (e) {
            if (Bisnis.validCallback(callback)) {
                callback(e);
            }
        });
    };

    Bisnis.Util.Dialog.shownTab = function (selector, callback) {
        jQuery(selector).on('shown.bs.tab', function (e) {
            if (Bisnis.validCallback(callback)) {
                callback(e);
            }
        });
    };

})(window.Bisnis || {});