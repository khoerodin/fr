$(document).on('click', 'div.box-menu', function () {
    title = $(this).find('.inner').find('h4').text();
    category = $(this).find('input').val();

    menusByCategory(title, category);
});

$(document).on('click', 'li.treeview > a', function () {
    title = $(this).find('span').text();
    category = $(this).attr('data-catagory');

    menusByCategory(title, category);
});

function menusByCategory(title, category) {

    $.ajax({
        url: "/api/menus",
        type: "POST",
        data: {
            category : category
        },
        beforeSend: function () {
        },
        success: function (data, textStatus, jqXHR) {
            menus = '<div class="row">';
            $.each(data, function (index, value) {
                menus += '<div class="col-lg-3 col-xs-6">';
                menus += '  <div class="small-box box-menu bg-red">';
                menus += '      <div class="inner">';
                menus += '          <h4>'+value.name+'</h4>';
                menus += '          <p style="visibility: hidden">Lorem ipsum...</p>';
                menus += '      </div>';
                menus += '      <div class="icon">';
                menus += '          <i class="'+value.iconCls+'"></i>';
                menus += '      </div>';
                menus += '      <span class="small-box-footer" style="visibility: hidden;">More <i class="fa fa-arrow-circle-right"></i></span>';
                menus += '  </div>';
                menus += '</div>';
            });
            menus += '</div>';

            $('title').html(title);
            $('section.content-header h1').html(title);
            $('section.content').html(menus);
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

}

