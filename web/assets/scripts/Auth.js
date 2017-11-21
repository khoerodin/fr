(function (Bisnis) {
    Bisnis.Auth = {};

    Bisnis.Auth.login = function (params, successCallback, errorCallback) {
        Bisnis.request({
            params: params
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(successCallback)) {
                successCallback(dataResponse, textStatus, response);
            }
        }, function (response, textStatus, errorThrown) {
            if (Bisnis.validCallback(errorCallback)) {
                errorCallback(response, textStatus, errorThrown);
            }
        }, '/login_check', 'post');
    };

    var loginError = function () {
        document.querySelector("#username").value = '';
        document.querySelector("#password").value = '';
        document.querySelector("#username").focus();

        var signBtn = document.querySelector('#sign-in');
        signBtn.innerHTML = '<i class="fa fa-sign-in"></i> MASUK';
        signBtn.disabled = false;

        document.querySelector("#login-error").classList.remove('hidden');
    };

    Bisnis.Util.Event.bind('click', '#sign-in', function () {
        this.innerHTML = '<i class="fa fa-circle-o-notch fa-spin"></i> MASUK';
        this.disabled = true;
        document.querySelector("#login-error").classList.add('hidden');

        var username = document.querySelector('#login-form #username').value;
        var password = document.querySelector('#login-form #password').value;

        var params = {
            username: username,
            password: password
        };

        Bisnis.Auth.login(params,
            function (dataResponse) {
                if (dataResponse === '1') {
                    location.href = '/';
                } else {
                    loginError();
                }
            }, function () {
                loginError();
            }
        );
    });

    Bisnis.Util.Event.bind('keypress', 'input.login-form', function (e) {
        if (e.which === 13) {
            Bisnis.Util.Event.triggerClick('#sign-in');
            return false;
        }
    });

    Bisnis.Auth.logout = function (successCallback, errorCallback) {
        Bisnis.request([], function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(successCallback)) {
                successCallback(dataResponse, textStatus, response);
            }
        }, function (response, textStatus, errorThrown) {
            if (Bisnis.validCallback(errorCallback)) {
                errorCallback(response, textStatus, errorThrown);
            }
        }, '/logout', 'put');
    };

    Bisnis.Util.Event.bind('click', '#sign-out', function () {
        Bisnis.Auth.logout(
            function () {
                location.href = '/';
            }, function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'ERROR!');
                location.href = '/';
            }
        );
    });
})(window.Bisnis || {});