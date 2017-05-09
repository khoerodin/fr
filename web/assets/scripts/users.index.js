jQuery(function($) {

    function response(data) {
        var msg = {};
        $.each(JSON.parse(data), function (index, value) {
            if(index == 'violations'){
                for (var key in value) {
                    // skip loop if the property is from prototype
                    if (!value.hasOwnProperty(key)) continue;

                    var obj = value[key];
                    for (var prop in obj) {
                        // skip loop if the property is from prototype
                        if(!obj.hasOwnProperty(prop)) continue;

                        //console.log(prop + " : " + obj[prop]);
                        msg[prop] = obj[prop];
                    }
                }
            }
        });
        // belum dicoba kalo obj
        $.each(msg, function (index, value) {
            console.log( index + ' : ' + value );
        });
    }

    $(document).on('click', '#addUser', function () {
        $('#addModal').modal('show')
    });

    $(document).on('click', '#save', function () {
        var formData = {
            fullname: $('input[name="fullname"]').val(),
            username: $('input[name="username"]').val(),
            email: $('input[name="email"]').val(),
            company: $('select[name="company"]').val(),
            plainPassword: $('input[name="plainPassword"]').val(),
            enabled: $('input[name="enabled"]').is(':checked'),
        };

        $.ajax({
            url: "/users/add",
            type: "POST",
            data: formData,
            success: function (data, textStatus, jqXHR) {
                response(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        });

    });
});