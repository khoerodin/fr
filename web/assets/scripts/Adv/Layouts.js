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

    var loadGrid = function (pageNum) {
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

    loadGrid(1);

    Bisnis.Util.Event.bind('click', '#layoutsPagination .pagePrevious', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#layoutsPagination .pageNext', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#layoutsPagination .pageFirst', function () {
        loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#layoutsPagination .pageLast', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end fetch grid and pagination

    // search box
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
            var btn = document.getElementById('btnAddLayout');
            if (hasResultCallback) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }, function (selectedCallback) {
            //selectedCallback = {disabled, element, id, label, selected, text, _resultId}
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddLayout');
            if (openCallback === false) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddLayout');
            setTimeout(function () {
                if (closeCallback === false) {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }
            }, 300);
        }
    );
    // end search box

    // add modal
    Bisnis.Util.Event.bind('click', '#btnAddLayout', function () {
        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addName').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.Layouts.add(params, function () {
            Bisnis.Util.Dialog.hideModal('#addModal');
            loadGrid(1);
            thisBtn.disabled = false;
        });
    });

    Bisnis.Adv.Layouts.add = function (params, callback) {
        Bisnis.request({
            module: 'advertising/layouts',
            method: 'post',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);

            if (Bisnis.validCallback(callback)) {
                callback(rawData);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };
    // end add modal

    // detail modal
    var loadDetail = function (id) {
        Bisnis.Util.Storage.store('LAYOUTS_ID', id);
        Bisnis.Adv.Layouts.fetchById(id, function (callback) {
            var nameElem = document.getElementById('detailName');
            nameElem.value = callback.name;
            nameElem.focus();
        });
        Bisnis.Util.Dialog.showModal('#detailModal');
    };

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
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
            Bisnis.successMessage('Berhasil memperbarui data');
            Bisnis.Util.Dialog.hideModal('#detailModal');
            var page = Bisnis.Util.Storage.fetch('LAYOUTS_CURRENT_PAGE');
            loadGrid(page);
            thisBtn.disabled = false;
        });
    });
    // end detail modal

    // delete layout
    Bisnis.Util.Event.bind('click', '.btn-delete', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Adv.Layouts.delete(id, function (textStatus) {
                    if (textStatus === 'success') {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('LAYOUTS_CURRENT_PAGE');
                        loadGrid(page);
                    } else {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                })
            }
        });
    });

    Bisnis.Adv.Layouts.delete = function (id, callback) {
        Bisnis.request({
            module: 'advertising/layouts/' + id,
            method: 'delete'
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(callback)) {
                callback(textStatus);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };
    // end delete layout

    // prevent submit form on enter
    document.getElementById("addForm").onkeypress = function(e) {
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            Bisnis.Util.Dialog.alert("PERHATIAN", "SILAKAN TEKAN TOMBOL SIMPAN");
            e.preventDefault();
        }
    }

    document.getElementById("detailForm").onkeypress = function(e) {
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            Bisnis.Util.Dialog.alert("PERHATIAN", "SILAKAN TEKAN TOMBOL SIMPAN");
            e.preventDefault();
        }
    }
    // end prevent submit form on enter

})(window.Bisnis || {});