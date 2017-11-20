(function (window) {
    var Bisnis = {};

    Bisnis.each = function (callback, iterable) {
        if (Bisnis.validCallback(callback)) {
            jQuery.each(iterable, callback);
        }
    };

    Bisnis.validCallback = function(callback) {
        return 'function' === typeof callback;
    };

    Bisnis.init = function (callback) {
        if ('undefined' === typeof window.jQuery) {
            console.log('jQuery is need to start this app.');
        }

        if (Bisnis.validCallback(callback)) {
            jQuery(document).ready(callback);
        }
    };

    var checkParams = function (params) {
        if (Array.isArray(params.params)) {
            params.params = 'undefined' === typeof params.params ? [] : params.params;

            var order = false;
            params.params.forEach(function (value) {
                if (value.order) {
                    order = true;
                }
            });

            if (params.method.toLowerCase() === 'get' && order === false) {
                params.params.push({
                    order: {
                        createdAt: 'DESC'
                    }
                });
            }
        } else {
            params = (typeof params.params === 'undefined') ? params : params.params;
        }

        return params;
    };

    Bisnis.request = function (params, successCallback, errorCallback, url, method) {
        url = 'undefined' === typeof url ? '/api' : url;
        method = 'undefined' === typeof method ? 'post' : method;
        params = checkParams(params);

        jQuery.ajax({
            url: url,
            type: method.toUpperCase(),
            data: params,
            beforeSend: function () {},
            success: function (dataResponse, textStatus, response) {
                if ((typeof dataResponse === 'string' || dataResponse instanceof String) && dataResponse !== '1') {
                    var string = dataResponse.toLowerCase();
                    if (string.indexOf('fatal error') !== -1) {
                        if (string.indexOf('access denied') !== -1) {
                            Bisnis.Util.Dialog.alert('PERHATIAN', 'Anda tidak memiliki akses untuk aksi ini', function () {
                                window.location.reload();
                            });
                        } else {
                            Bisnis.Util.Dialog.alert('PERHATIAN', 'Maaf terjadi kesalahan', function () {
                                window.location.reload();
                            });
                        }
                    }
                } else {
                    if (Bisnis.validCallback(successCallback)) {
                        successCallback(dataResponse, textStatus, response);
                    }
                }
            },
            error: function (response, textStatus, errorThrown) {
                if (errorThrown.toLowerCase() === 'unauthorized') {
                    Bisnis.Util.Dialog.alert('PERHATIAN', 'Sesi Anda telah habis, silakan login kembali', function () {
                        location.href = '/login';
                    });
                } else if (errorThrown.toLowerCase() === 'forbidden') {
                    Bisnis.Util.Dialog.alert('PERHATIAN', 'Anda tidak memiliki akses untuk aksi ini', function () {
                        window.location.reload();
                    });
                } else {
                    if (Bisnis.validCallback(errorCallback)) {
                        errorCallback(response, textStatus, errorThrown);
                    }
                }
            }
        });
    };

    Bisnis.errorMessage = function (message) {
        toastr.error(message);
    };

    Bisnis.successMessage = function (message) {
        toastr.success(message);
    };

    Bisnis.BACKEND_HOST = '';

    /** Module List */
    Bisnis.Helpdesk = {};
    Bisnis.Util = {};
    Bisnis.Notification = {};
    Bisnis.Adv = {};
    Bisnis.Billing = {};
    Bisnis.Admin = {};
    Bisnis.Chart = {};
    Bisnis.WebSocket = {};

    window.Bisnis = Bisnis;
})(window);