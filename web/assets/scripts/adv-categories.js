$.fn.extend({
    treed: function (o) {

        var openedClass = 'glyphicon-minus-sign';
        var closedClass = 'glyphicon-plus-sign';

        if (typeof o != 'undefined'){
            if (typeof o.openedClass != 'undefined'){
                openedClass = o.openedClass;
            }
            if (typeof o.closedClass != 'undefined'){
                closedClass = o.closedClass;
            }
        };

        //initialize each of the top levels
        var tree = $(this);
        tree.addClass("tree");
        tree.find('li').has("ul").each(function () {
            var branch = $(this); //li with children ul
            branch.prepend("<i class='indicator glyphicon " + closedClass + "'></i>");
            branch.addClass('branch');
            branch.on('click', function (e) {
                if (this == e.target) {
                    var icon = $(this).children('i:first');
                    icon.toggleClass(openedClass + " " + closedClass);
                    $(this).children().children().toggle();
                }
            })
            branch.children().children().toggle();
        });
        //fire event from the dynamically added icon
        tree.find('.branch .indicator').each(function(){
            $(this).on('click', function () {
                $(this).closest('li').click();
            });
        });
        //fire event to open branch if the li contains an anchor instead of text
        tree.find('.branch>a').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
        //fire event to open branch if the li contains a button instead of text
        tree.find('.branch>button').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
    }
});

//Initialization of treeviews
$('#categoriesTree').treed({openedClass:'glyphicon-folder-open', closedClass:'glyphicon-folder-close'});
$(window).load(function() {
    $("#categoriesTree > .branch").trigger('click');
});

$(document).on('click', '#categoriesTree li span', function () {
    $('#categoriesTree li span').removeClass('active');
    $(this).addClass('active');

    var id = $(this).closest('li').data('id');
    var text = $(this).text();
});

$('#categoriesTree li span').bind('contextmenu', function() {
    $('#categoriesTree li span').removeClass('active');
    $(this).addClass('active');

    var id = $(this).closest('li').data('id');
    var text = $(this).text();
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
        }
    }, {
        name: 'EDIT',
        onClick: function(data) {
            $('#editCategory #id').val(data.id);
            $('#editCategory #name').val(data.name);
            $('#editCategory').modal({show: true, backdrop: 'static'});
        }
    }, {
        name: 'HAPUS',
        onClick: function() {
            toastr.error("Terhapus dab!");
        }
    }]
});

$(document).on('click', '#addCategory #saveCategory', function () {

    $('div .has-error').removeClass('has-error');
    $('p.help-block').remove();
    $('#saveCategory').text('MENYIMPAN...').prop('disabled', true);

    $.ajax({
        type: 'post',
        url: '/api',
        data: {
            module: 'advertising/categories',
            method: 'post',
            params: $('#addCategory form').serializeArray()
        },
        success: function (data, textStatus, jqXHR) {
            var arr = JSON.parse(data);
            if ("violations" in arr) {

                $.each(arr, function (index, value) {
                    if(index === 'violations'){
                        $.each(value, function (idx, val) {
                            $('#addCategory #'+val.propertyPath).parent('div').addClass('has-error');
                            $( '<p class="help-block">'+val.message+'</p>' ).insertAfter( '#addCategory #'+val.propertyPath );
                        });
                    }
                });

                toastr.error('Error menambahkan kategori');

            } else if('id' in arr) {
                $('#addCategory #name').val('');
                toastr.success('Berhasil menambahkan kategori');
                $('#addCategory').modal('hide');
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

    $.ajax({
        type: 'post',
        url: '/api',
        data: {
            module: 'advertising/categories',
            method: 'put',
            params: $('#updateCategory form').serializeArray()
        },
        success: function (data, textStatus, jqXHR) {
            console.log(data);
            var arr = JSON.parse(data);
            if ("violations" in arr) {

                $.each(arr, function (index, value) {
                    if(index === 'violations'){
                        $.each(value, function (idx, val) {
                            $('#editCategory #'+val.propertyPath).parent('div').addClass('has-error');
                            $( '<p class="help-block">'+val.message+'</p>' ).insertAfter( '#addCategory #'+val.propertyPath );
                        });
                    }
                });

                toastr.error('Error memperbarui kategori');

            } else if('id' in arr) {
                $('#editCategory #name').val('');
                toastr.success('Berhasil memperbarui kategori');
                $('#editCategory').modal('hide');
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