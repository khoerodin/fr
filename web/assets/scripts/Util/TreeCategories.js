(function (Bisnis) {
    Bisnis.Util.TreeCategories = {};

    Bisnis.Util.TreeCategories.fetch = function (categoriesSelector, dblClickCallback) {
        var selector = categoriesSelector.replace('#','').replace('.','');
        jQuery.ajax({
            url: '/advertising/categories/tree',
            type: 'GET',
            success: function (data, textStatus, jqXHR) {
                var html = '<ul id="categoriesTree'+selector+'">' +
                    '<li><span>KATEGORI IKLAN</span></a>' +
                    '<ul>' + data + '</ul>' +
                    '</li>' +
                    '</ul>';

                Bisnis.Util.Document.putHtml(categoriesSelector, html);
                jQuery('#categoriesTree'+selector).treed({openedClass:'glyphicon-folder-open', closedClass:'glyphicon-folder-close'});
                jQuery("#categoriesTree"+selector+" > .branch").trigger('click');

                jQuery('#categoriesTree'+selector+' li span').bind('contextmenu', function() {
                    $('#categoriesTree'+selector+' li span').removeClass('active');
                    $(this).addClass('active');
                });

                jQuery('#categoriesTree'+selector+' li span').click(function () {
                    $('#categoriesTree'+selector+' li span').removeClass('active');
                    $(this).addClass('active');
                });

                jQuery('ul#categoriesTree'+selector+' li span').dblclick(function () {

                    var id = jQuery(this).closest('li span').data('id');
                    var name = jQuery(this).closest('li span').data('name');
                    var breadCrumb = [];
                    jQuery(this).parents('li').each(function (index, value) {
                        var treeText = value.innerText;
                        var treeArr = treeText.match(/[^\r\n]+/g);
                        breadCrumb.push(treeArr[0]);
                    });
                    var bcArr = breadCrumb.reverse();
                    var list = '';
                    var total = bcArr.length;
                    jQuery.each(bcArr, function (index, value) {
                        if (index !== 0) {
                            if (index === total - 1) {
                                list += value + '  ';
                            } else {
                                list += value + ' ➤ ';
                            }

                        }
                    });

                    if (Bisnis.validCallback(dblClickCallback)) {
                        var data = {
                            id: id,
                            name: name,
                            list: list
                        };
                        dblClickCallback(data);
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
    };

})(window.Bisnis || {});