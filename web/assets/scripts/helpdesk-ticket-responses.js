$(document).on('click', '#kirim', function () {
     tampilUser();
     tampilIklan();
    //deleteUser();
});

function tampilUser() {
    $.ajax({
        type: 'POST',
        url: '/api',
        data: {
            module: 'users',
            method: 'GET'
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data);
            var aaa = memberData['hydra:member'];
            var dataUser = '';
            $.each(aaa, function (index, value) {
                dataUser += '<tr data-id="'+value.id+'">';
                dataUser += '<td>'+value.fullname+'</td>';
                dataUser += '<td>'+value.email+'</td>';
                dataUser += '<td>'+value.username+'</td>';
                dataUser += '<td><label class="label label-danger delete-user">DELETE</label></td>';
                dataUser += '<tr>';
            });

            $('#data-user').html(dataUser);
        },
        error: function () {

        }
    });
}

// function deleteUser(id) {
//     $.ajax({
//         type: 'POST',
//         url: '/api',
//         data: {
//             module: 'users/' + id,
//             method: 'DELETE'
//         },
//         success: function (data, textStatus, jqXHR) {
//             tampilUser()
//         },
//     });
// }

$(document).on('click', '.delete-user', function (e) {
    var id = $(this).closest('tr').data('id');
    deleteUser(id)
});

$(document).on('keypress', '#enter', function (e) {
    if (e.which === 13) {
        tampilUser();
        // var isi = $(this).val();
        // alert(isi);
        // console.log(e);
        return false;
    }
});


function tampilIklan() {
    $.ajax({
        type: 'POST',
        url: '/api',
        data: {
            module: 'advertising/types',
            method: 'GET'
        },
        success: function (data, textStatus, jqXHR) {
            var memberData = JSON.parse(data);
            var aaa = memberData['hydra:member'];
            var dataAd = '';
            $.each(aaa, function (index, value) {
                dataAd += '<tr data-id="'+value.id+'">';
                dataAd += '<td>'+value.name+'</td>';
                dataAd += '<td><button class="detail-btn btn btn-success btn-xs btn-flat">DETAIL</button>' ;
                dataAd += '<button class="delete-btn btn btn-danger btn-xs btn-flat delete-ads">DELETE</button></td>';
                dataAd += '<tr>';
            });

            $('#data-ad').html(dataAd);
        },
        error: function () {

        }
    });
}

function deleteAd(id) {
    $.ajax({
        type: 'POST',
        url: '/api',
        data: {
            module: 'advertising/types/' + id,
            method: 'DELETE'
        },
        success: function (data, textStatus, jqXHR) {
            tampilUser()
            tampilIklan()
        },
    });
}

$(document).on('click', '.delete-ads', function (e) {
    var id = $(this).closest('tr').data('id');
    deleteAd(id)
});

$(document).on('click', '#data-ad .detail-btn', function (e) {
    $('#adsModal').modal({show: true, backdrop: 'static'});
});
