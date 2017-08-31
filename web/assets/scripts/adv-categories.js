//Initialization of treeviews
$('#categoriesTree').treed({openedClass:'glyphicon-folder-open', closedClass:'glyphicon-folder-close'});
$(window).load(function() {
    $("#categoriesTree > .branch").trigger('click');
});

$(document).on('click', '#categoriesTree li span', function () {
    $('#categoriesTree li span').removeClass('active');
    $(this).addClass('active');
});

$('#categoriesTree li span').bind('contextmenu', function() {
    $('#categoriesTree li span').removeClass('active');
    $(this).addClass('active');
});

new BootstrapMenu('#categoriesTree li span', {
    menuEvent: 'right-click',
    menuSource: 'element',
    fetchElementData: function($catElem) {
        var catId = $catElem.data('id');
        var catName = $catElem.data('name');
        return {id: catId, name: catName};
    },
    actions: [{
        name: 'TAMBAH',
        onClick: function(data) {
            $('#addCategory #parent').val('/api/advertising/categories/'+data.id);
            $('#addCategory').modal({show: true, backdrop: 'static'});
            $('#addCategory #name').focus();
        }
    }, {
        name: 'EDIT',
        onClick: function(data) {
            $('#editCategory').modal({show: true, backdrop: 'static'});
            $('#editCategory #id').val(data.id);
            $('#editCategory #name').val(data.name).focus();
        }
    }, {
        name: 'HAPUS',
        onClick: function(data) {
            bootbox.confirm({
                message: "YAKIN AKAN MENGHAPUS KATEGORI INI?<br/>ANAK KATEGORI (JIKA ADA) JUGA AKAN IKUT TERHAPUS, HATI-HATI!",
                animate: false,
                buttons: {
                    confirm: {
                        className: 'btn-danger btn-flat'
                    },
                    cancel: {
                        className: 'btn-default btn-flat'
                    }
                },
                callback: function (result) {
                    if (result) {
                        deleteCategory(data.id);
                    }
                }
            });
        }
    }]
});

$(document).on('click', '#addCategory #saveCategory', function () {

    $('div .has-error').removeClass('has-error');
    $('p.help-block').remove();
    $('#saveCategory').text('MENYIMPAN...').prop('disabled', true);
    var idValue = $('#addCategory form #parent').val();
    var id = idValue.split('/').pop();

    $.ajax({
        type: 'post',
        url: '/api',
        data: {
            module: 'advertising/categories',
            method: 'post',
            params: $('#addCategory form').serializeArray()
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            if ("violations" in data) {

                $.each(data, function (index, value) {
                    if(index === 'violations'){
                        $.each(value, function (idx, val) {
                            $('#addCategory #'+val.propertyPath).parent('div').addClass('has-error');
                            $( '<p class="help-block">'+val.message+'</p>' ).insertAfter( '#addCategory #'+val.propertyPath );
                        });
                    }
                });

                toastr.error('Error menambahkan kategori');

            } else if('id' in data) {

                if ( $('[data-id="'+id+'"]').closest('li').hasClass('branch') ) {
                    $('[data-id="'+id+'"]').closest('li').children('ul').append('<li style="display: list-item;"><span data-id="'+data.id+'" data-name="'+data.name+'">'+data.name+'</span></li>');
                } else {
                    $('<i class="indicator glyphicon glyphicon-folder-open"></i>').insertBefore( '[data-id="'+id+'"]' );
                    $('[data-id="'+id+'"]').closest('li').addClass('branch')
                        .append('<ul><li style="display: list-item;"><span data-id="'+data.id+'" data-name="'+data.name+'">'+data.name+'</span></li></ul>');
                }

                $('#addCategory #name').val('');
                toastr.success('Berhasil menambahkan kategori');
                $('#addCategory').modal('hide');

                $('#categoriesTree li span').bind('contextmenu', function() {
                    $('#categoriesTree li span').removeClass('active');
                    $(this).addClass('active');
                });

            } else {
                toastr.error('Error menambahkan kategori');
            }
            $('#saveCategory').text('SIMPAN').prop('disabled', false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error menambahkan kategori');
            $('#saveCategory').text('SIMPAN').prop('disabled', false);
        }
    });

});

$(document).on('click', '#editCategory #updateCategory', function () {

    $('div .has-error').removeClass('has-error');
    $('p.help-block').remove();
    $('#updateCategory').text('MENYIMPAN...').prop('disabled', true);
    var id = $('#editCategory form #id').val();

    $.ajax({
        type: 'post',
        url: '/api',
        data: {
            module: 'advertising/categories/' + id,
            method: 'put',
            params: $('#editCategory form').serializeArray()
        },
        success: function (data, textStatus, jqXHR) {
            var data = JSON.parse(data);
            if ("violations" in data) {

                $.each(data, function (index, value) {
                    if(index === 'violations'){
                        $.each(value, function (idx, val) {
                            $('#editCategory #'+val.propertyPath).parent('div').addClass('has-error');
                            $( '<p class="help-block">'+val.message+'</p>' ).insertAfter( '#editCategory #'+val.propertyPath );
                        });
                    }
                });

                toastr.error('Error memperbarui kategori');

            } else if('id' in data) {
                $('#editCategory #name').val('');
                toastr.success('Berhasil memperbarui kategori');
                $('[data-id="'+id+'"]').text(data.name).attr('data-name', data.name);
                $('#editCategory').modal('hide');

                $('#categoriesTree li span').bind('contextmenu', function() {
                    $('#categoriesTree li span').removeClass('active');
                    $(this).addClass('active');
                });
            } else {
                toastr.error('Error memperbarui kategori');
            }
            $('#updateCategory').text('SIMPAN').prop('disabled', false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error memperbarui kategori');
            $('#updateCategory').text('SIMPAN').prop('disabled', false);
        }
    });

});

function deleteCategory(id) {

    $.ajax({
        url: '/api',
        type: 'post',
        data: {
            module: 'advertising/categories/' + id,
            method: 'delete'
        },
        success: function (data, textStatus, jqXHR) {
            toastr.success('Berhasil menghapus kategori');
            $('[data-id="'+id+'"]').closest('li').remove();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error menghapus kategori');
        }
    });

}