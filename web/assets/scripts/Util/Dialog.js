(function (Bisnis) {
    Bisnis.Util.Dialog = {};

    Bisnis.Util.Dialog.yesNo = function (title, message, callback) {
        bootbox.confirm({
            title: title,
            message: message,
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Yes'
                }
            },
            callback: function (result) {
                if (Bisnis.validCallback(callback)) {
                    callback(result);
                }
            }
        });
    };

    Bisnis.Util.Dialog.showModal = function (selector) {
        jQuery(selector).modal({show: true, backdrop: 'static'});
    };

    Bisnis.Util.Dialog.hideModal = function (selector) {
        jQuery(selector).modal('hide');
    };
})(window.Bisnis || {});