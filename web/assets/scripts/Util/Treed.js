(function (Bisnis) {
    Bisnis.Util.Treed = {};

    var getTreeRequest = function (url, callback) {
        jQuery.ajax({
            url: url,
            type: 'GET',
            success: function (data, textStatus, jqXHR) {
                if (Bisnis.validCallback(callback)) {
                    callback(data);
                }
            },
            error: function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENGAMBIL SUMBER DATA TREE');
            }
        });
    };

    var dblClickTreeNode = function (selector, dblClickCallback) {
        jQuery('ul#treed-'+selector+' li span').dblclick(function () {

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
    };

    Bisnis.Util.Treed.create = function (params, categoriesSelector, dblClickCallback) {
        var selector = categoriesSelector.replace('#','').replace('.','');
        var url = params.url;
        var title = params.title;

        getTreeRequest(url, function (data) {
            var html = '<ul id="treed-'+selector+'">' +
                '<li><span>'+title+'</span></a>' +
                '<ul>' + data + '</ul>' +
                '</li>' +
                '</ul>';

            Bisnis.Util.Document.putHtml(categoriesSelector, html);
            jQuery('#treed-'+selector).treed({openedClass:'glyphicon-folder-open', closedClass:'glyphicon-folder-close'});
            jQuery("#treed-"+selector+" > .branch").trigger('click');

            jQuery('#treed-'+selector+' li span').bind('contextmenu', function() {
                $('#treed-'+selector+' li span').removeClass('active');
                $(this).addClass('active');
            });

            jQuery('#treed-'+selector+' li span').click(function () {
                $('#treed-'+selector+' li span').removeClass('active');
                $(this).addClass('active');
            });

            dblClickTreeNode(selector, function (data) {
                if (Bisnis.validCallback(dblClickCallback)) {
                    dblClickCallback(data);
                }
            });
        });
    };

})(window.Bisnis || {});