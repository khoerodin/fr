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
})(window.Bisnis || {});