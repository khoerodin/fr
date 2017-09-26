(function (Bisnis) {
    Bisnis.Advertising.Layouts = {};

    Bisnis.Advertising.Layouts.fetchAll = function (params, callback) {
        Bisnis.request({
            module: 'advertising/layouts',
            method: 'get',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);
            var memberData = rawData['hydra:member'];
            var viewData = rawData['hydra:view'];

            if ('undefined' !== typeof viewData['hydra:last']) {
                var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);

                Bisnis.Util.Storage.store('LAYOUTS_CURRENT_PAGE', currentPage);
                Bisnis.Util.Grid.createPagination('#layoutsPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
            }

            if (Bisnis.validCallback(callback)) {
                callback(memberData);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi keslahan sistem');
        });
    };

    var loadPage = function (pageNum) {
        Bisnis.Advertising.Layouts.fetchAll([{page: pageNum}], function (memberData) {
            var records = [];
            Bisnis.each(function (idx, memberData) {
                records.push([
                    { value: memberData.name },
                    { value: memberData.id, format: function (id) {
                        return '<span class="pull-right">' +
                            '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                            '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete" title="HAPUS"><i class="fa fa-times"></i></button>' +
                            '</span>';
                    }}
                ]);
            }, memberData);
            Bisnis.Util.Grid.renderRecords('#layoutsList', records);
        });
    };

    loadPage(1);

    Bisnis.Util.Event.bind('click', '#layoutsPagination .pagePrevious', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#layoutsPagination .pageNext', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#layoutsPagination .pageFirst', function () {
        loadPage(1);
    });

    Bisnis.Util.Event.bind('click', '#layoutsPagination .pageLast', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        Bisnis.Util.Dialog.showModal('#detailModal');
    });

    var params = {
        placeholder: 'CARI NAMA LAYOUT',
        module: 'advertising/layouts',
        fields: [
            {
                field: 'name',
                label: 'Layout'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchLayouts', params,
        function (hasResultCallback) {

        }, function (selectedCallback) {
            //selectedCallback = {disabled, element, id, label, selected, text, _resultId}
            console.log(selectedCallback)
        }, function (openCallback) {

        }, function (closeCallback) {

        }
    );

})(window.Bisnis || {});