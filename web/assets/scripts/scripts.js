
$.ajax({
    url: "/api",
    type: "POST",
    data: {
        category : category,
        method : 'get',
    },
    beforeSend: function () {
        jQuery('#'+id).html('<option selected>LOADING...</option>');
    },
    success: function (data, textStatus, jqXHR) {
        var select = '<option></option>';
        var arr = JSON.parse(data);
        $.each(arr, function (index, value) {
            if(index === 'hydra:member'){

                $.each(value, function (idx, val) {
                    select += '<option value="/api/'+module+'/'+val.id+'">'+val[field]+'</option>';
                });

            }
        });
        jQuery('select#'+id).html(select).removeClass('loading').removeAttr('disabled');
    },
    error: function (jqXHR, textStatus, errorThrown) {
        jQuery('select#'+id).html('<option selected>ERROR</option>');
    }
});