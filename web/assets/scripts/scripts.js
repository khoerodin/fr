$(document).on('click', 'li.treeview', function () {

    category = $(this).attr('data-catagory');

    $.ajax({
        url: "/api/menus",
        type: "POST",
        data: {
            category : category
        },
        beforeSend: function () {
        },
        success: function (data, textStatus, jqXHR) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });

});