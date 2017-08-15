function checkToken(code) {
    if (code === 401) {
        alert('You have been signed out');
        location.reload();
    }
}

$(document).on('click', 'div.home-menu', function () {
    title = $(this).find('.inner').find('h4').text();
    category = $(this).find('input').val();

    menusByCategory(title, category);
});

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
            $('#sign-in').text('SIGNING IN...').prop('disabled', true);
            $('#login-error').addClass('hidden');
        },
        success: function (data, textStatus, jqXHR) {
            if(data == 401) {
                $('#username').val('');
                $('#password').val('');
                $('#login-error').val('');
                $('#sign-in').text('SIGN IN').prop('disabled', false);
                $('#login-error').removeClass('hidden');
                $('#username').focus();
            } else {
                //alert(data);
                location.href = '/';
            }
        }
    });
});

$(document).on('click', '#sign-out', function () {
    $.ajax({
        url: "/logout",
        type: "PUT",
        beforeSend: function () {},
        success: function (data, textStatus, jqXHR) {
            if(jqXHR.status == 200) {
                location.href = '/login';
            }
        }
    });
});

$(document).on('keypress', 'input.login-form', function (e) {
    if (e.which === 13) {
        $('#sign-in').click();
        return false;
    }
});

// $(document).on('click', 'li.treeview > a', function () {
//     title = $(this).find('span').text();
//     category = $(this).attr('data-catagory');
//
//     menusByCategory(title, category);
//     console.log(title, category);
// });
//
// $(document).on('click', 'ol.breadcrumb li.parent-crumb', function () {
//     title = $(this).text();
//     category = $(this).attr('data-catagory');
//
//     menusByCategory(title, category);
// });
//
// function menusByCategory(title, category) {
//
//     $.ajax({
//         url: "/api/menus",
//         type: "POST",
//         data: {
//             category : category
//         },
//         beforeSend: function () {
//         },
//         success: function (data, textStatus, jqXHR) {
//             menus = '<div class="row">';
//             $.each(data, function (index, value) {
//                 menus += '<div class="col-lg-3 col-xs-6 right-menu" data-link="/'+value.path+'">';
//                 menus += '  <div class="small-box box-menu bg-red">';
//                 menus += '      <div class="inner">';
//                 menus += '          <h4>'+value.name+'</h4>';
//                 menus += '          <p style="visibility: hidden">Lorem ipsum...</p>';
//                 menus += '      </div>';
//                 menus += '      <div class="icon">';
//                 menus += '          <i class="'+value.iconCls+'"></i>';
//                 menus += '      </div>';
//                 menus += '      <span class="small-box-footer" style="visibility: hidden;">More <i class="fa fa-arrow-circle-right"></i></span>';
//                 menus += '  </div>';
//                 menus += '</div>';
//             });
//             menus += '</div>';
//
//             $('title').html(title);
//             $('section.content-header h1').html(title);
//             $('section.content').html(menus);
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//
//         }
//     });
//
// }
//
// $(document).on('click', 'div.right-menu', function () {
//     var url = $(this).attr('data-link');
//     window.location.href = url;
// });