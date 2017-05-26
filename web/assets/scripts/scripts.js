$(document).on('click', 'li.treeview', function () {

    title = $(this).find('span').text();
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
            //data = JSON.parse(data);
            menus = '<div class="row">';
            $.each(data, function (index, value) {
                menus += '<div class="col-lg-3 col-xs-6">';
                menus += '  <div class="small-box bg-red">';
                menus += '      <div class="inner">';
                menus += '          <h4>'+value.name+'</h4>';
                menus += '          <p style="visibility: hidden">Lorem ipsum...</p>';
                menus += '      </div>';
                menus += '      <div class="icon">';
                menus += '          <i class="'+value.iconCls+'"></i>';
                menus += '      </div>';
                menus += '      <a href="/'+value.path+'" class="small-box-footer">More <i class="fa fa-arrow-circle-right"></i></a>';
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

});