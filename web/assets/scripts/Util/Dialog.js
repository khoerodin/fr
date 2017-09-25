(function (Bisnis) {
    Bisnis.Util.Dialog = {};

    Bisnis.Util.Dialog.yesNo = function (title, message, callback) {
        bootbox.confirm({
            title: title,
            message: message,
            animate: false,
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel',
                    className: "btn btn-default btn-flat"
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Yes',
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
                    label: '<i class="fa fa-check"></i> OK',
                    className: "btn btn-danger btn-flat"
                }
            },
            callback: function(result){
                if (Bisnis.validCallback(callback)) {
                    callback(result);
                }
            }
        })
    };

    Bisnis.Util.Dialog.showModal = function (selector) {
        jQuery(selector).modal({show: true, backdrop: 'static'});
    };

    Bisnis.Util.Dialog.hideModal = function (selector) {
        jQuery(selector).modal('hide');
    };
})(window.Bisnis || {});