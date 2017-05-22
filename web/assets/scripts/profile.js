var module;
var columns;

$(document).on('click', '#update-profile', function () {

    var userId = $('input#userId').val();
    var data = {
        module : 'users/'+userId,
        method : 'put',
        params : jQuery('#form-profile').serializeArray()
    };

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {
            $('.has-error').removeClass('has-error');
            $('p.help-block').remove();
            $('#update-profile').text('UPDATING...').prop('disabled', true);
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            if ("violations" in data) {

                $.each(data, function (index, value) {
                    if (index === 'violations') {
                        $.each(value, function (idx, val) {
                            toastr.error('Error when updating your profile');
                            jQuery('#form-profile #' + val.propertyPath).parent('div').addClass('has-error');
                            jQuery('<p class="help-block">' + val.message + '</p>').insertAfter('#form-profile #' + val.propertyPath);
                        });
                    }
                });

            } else {

                $('#fullname').val(data.fullname);
                $('#email').val(data.email);
                $('#username').val(data.username);
                toastr.success('Profile successfully updated');

            }

            $('#update-profile').text('UPDATE').prop('disabled', false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#update-profile').text('UPDATE').prop('disabled', false);
        }
    });

});

$(document).on('keypress', '#form-profile input', function (e) {
    if (e.which === 13) {
        $('#update-profile').click();
        return false;
    }
});