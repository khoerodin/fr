



$(document).on('click', '#sign-in', function (e) {

    e.preventDefault();

    var username = $('#login-form #username').val();
    var password = $('#login-form #password').val();

    $.ajax({
        url: "/login_check",
        type: "POST",
        data: {
            username:username,
            password:password
        },
        beforeSend: function () {
            $('#sign-in').html('<i class="fa fa-sign-in"></i> MASUK...').prop('disabled', true);
            $('#login-error').addClass('hidden');
        },
        success: function (dataResponse, textStatus, response) {
            console.log(dataResponse, textStatus, response);
            //if(data === '401') {
                /*$('#username').val('');
                $('#password').val('');
                $('#login-error').val('');
                $('#sign-in').html('<i class="fa fa-sign-in"></i> MASUK').prop('disabled', false);
                $('#login-error').removeClass('hidden');
                $('#username').focus();*/
            //} else {
               //location.href = '/';
            //}
        }
    });
});

$(document).on('click', '#sign-out', function () {
    $.ajax({
        url: "/logout",
        type: "PUT",
        beforeSend: function () {},
        success: function (data, textStatus, jqXHR) {
            location.href = '/';
        }
    });
});

$(document).on('keypress', 'input.login-form', function (e) {
    if (e.which === 13) {
        $('#sign-in').click();
        return false;
    }
});
