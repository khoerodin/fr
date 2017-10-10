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
        var username = document.querySelector("#username").value = '';
        document.querySelector("#password").value = '';

        var signBtn = document.querySelector('#sign-in');
        signBtn.innerHTML = '<i class="fa fa-sign-in"></i> MASUK';
        signBtn.disabled = false;

        document.querySelector("#login-error").classList.remove('hidden');
    };

    Bisnis.Util.Event.bind('click', '#sign-in', function () {
        this.innerHTML = '<i class="fa fa-sign-in"></i> MASUK...';
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

    Bisnis.Util.Event.bind('click', '#sign-out', function () {
        location.href = '/login';
    });
})(window.Bisnis || {});