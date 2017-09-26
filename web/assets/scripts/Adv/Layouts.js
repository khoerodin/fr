(function (Bisnis) {
    Bisnis.Adv.Layouts = {};

    // fetch grid and pagination
    Bisnis.Adv.Layouts.fetchAll = function (params, callback) {
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
        var pageNum = 'undefined' === typeof pageNum ? 1 : pageNum;
        Bisnis.Util.Storage.store('LAYOUTS_CURRENT_PAGE', pageNum);
        Bisnis.Adv.Layouts.fetchAll([{page: pageNum}], function (memberData) {
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
        }, function (openCallback) {

        }, function (closeCallback) {

        }
    );

    // detail modal
    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Storage.store('LAYOUTS_ID', id);
        Bisnis.Adv.Layouts.fetchById(id, function (callback) {
            var nameElem = document.getElementById('name');
            nameElem.value = callback.name;
            nameElem.focus();
        });
        Bisnis.Util.Dialog.showModal('#detailModal');
    });

    Bisnis.Adv.Layouts.fetchById = function (id, callback) {
        Bisnis.request({
            module: 'advertising/layouts/' + id,
            method: 'get'
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);

            if (Bisnis.validCallback(callback)) {
                callback(rawData);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };

    Bisnis.Adv.Layouts.updateById = function (id, params, callback) {
        Bisnis.request({
            module: 'advertising/layouts/' + id,
            method: 'put',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);

            if (Bisnis.validCallback(callback)) {
                callback(rawData);
            }

            Bisnis.successMessage('Berhasil meperbarui data');
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };

    Bisnis.Util.Event.bind('click', '#btn-update', function () {
        var id = Bisnis.Util.Storage.fetch('LAYOUTS_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.Layouts.updateById(id, params, function () {
            Bisnis.Util.Dialog.hideModal('#detailModal');
            var page = Bisnis.Util.Storage.fetch('LAYOUTS_CURRENT_PAGE');
            loadPage(page);
            thisBtn.disabled = false;
        });
    });

})(window.Bisnis || {});