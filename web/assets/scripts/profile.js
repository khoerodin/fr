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

                if( $('#plainPassword').val().length ) {

                    val = $('#plainPassword').val();

                    var data = {
                        module : 'change-password',
                        method : 'put',
                        params : [ { name : 'plainPassword', value : val } ]
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
                                            toastr.error('Error when updating your password');
                                            jQuery('#form-profile #' + val.propertyPath).parent('div').addClass('has-error');
                                            jQuery('<p class="help-block">' + val.message + '</p>').insertAfter('#form-profile #' + val.propertyPath);
                                        });
                                    }
                                });

                            } else {
                                toastr.success('Password successfully updated');
                            }
                            $('#plainPassword').val('');
                            $('#update-profile').text('UPDATE').prop('disabled', false);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            $('#update-profile').text('UPDATE').prop('disabled', false);
                            $('#plainPassword').val('');
                        }
                    });

                }

            }
            $('#plainPassword').val('');
            $('#update-profile').text('UPDATE').prop('disabled', false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#update-profile').text('UPDATE').prop('disabled', false);
            $('#plainPassword').val('');

        }
    });

});

$(document).on('keypress', '#form-profile input', function (e) {
    if (e.which === 13) {
        $('#update-profile').click();
        return false;
    }
});

function readFile() {

    if (this.files && this.files[0]) {

        var FR= new FileReader();

        FR.addEventListener("load", function(e) {
            jQuery(".profile-image").css('background-image', 'url('+e.target.result+')');
            var dataExt = e.target.result.split(';')[0];
            dataExt = dataExt.split(':')[1];

            var imgExt = dataExt.split('/')[1];
            var imgString = e.target.result.split(',')[1];

            $('input[name="imageExtension"]').val(imgExt);
            $('input[name="imageString"]').val(imgString);
        });

        FR.readAsDataURL( this.files[0] );
    }

}

document.getElementById("file-image").addEventListener("change", readFile);