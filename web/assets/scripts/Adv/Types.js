(function (Bisnis) {
    Bisnis.Adv.Types = {};

    // fetch grid and pagination
    Bisnis.Adv.Types.fetchAll = function (params, callback) {
        Bisnis.request({
            module: 'advertising/types',
            method: 'get',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);
            var memberData = rawData['hydra:member'];
            var viewData = rawData['hydra:view'];

            if ('undefined' !== typeof viewData['hydra:last']) {
                var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                Bisnis.Util.Grid.createPagination('#typesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
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
        Bisnis.Util.Storage.store('TYPES_CURRENT_PAGE', pageNum);
        Bisnis.Adv.Types.fetchAll([{page: pageNum}], function (memberData) {
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
            Bisnis.Util.Grid.renderRecords('#typesList', records);
        });
    };

    loadGrid(1);

    Bisnis.Util.Event.bind('click', '#typesPagination .pagePrevious', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#typesPagination .pageNext', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#typesPagination .pageFirst', function () {
        loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#typesPagination .pageLast', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end fetch grid and pagination

    // search box
    var params = {
        placeholder: 'CARI NAMA TYPE',
        module: 'advertising/types',
        fields: [
            {
                field: 'name',
                label: 'Tipe'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchTypes', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddType');
            if (hasResultCallback) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }, function (selectedCallback) {
            //selectedCallback = {disabled, element, id, label, selected, text, _resultId}
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddType');
            if (openCallback === false) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddType');
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
    Bisnis.Util.Event.bind('click', '#btnAddType', function () {
        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addName').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.Types.add(params, function () {
            Bisnis.Util.Dialog.hideModal('#addModal');
            loadGrid(1);
            thisBtn.disabled = false;
        });
    });

    Bisnis.Adv.Types.add = function (params, callback) {
        Bisnis.request({
            module: 'advertising/types',
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
        Bisnis.Util.Storage.store('TYPES_ID', id);
        Bisnis.Adv.Types.fetchById(id, function (callback) {
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

    Bisnis.Adv.Types.fetchById = function (id, callback) {
        Bisnis.request({
            module: 'advertising/types/' + id,
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

    Bisnis.Adv.Types.updateById = function (id, params, callback) {
        Bisnis.request({
            module: 'advertising/types/' + id,
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
        var id = Bisnis.Util.Storage.fetch('TYPES_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.Types.updateById(id, params, function () {
            Bisnis.successMessage('Berhasil memperbarui data');
            Bisnis.Util.Dialog.hideModal('#detailModal');
            var page = Bisnis.Util.Storage.fetch('TYPES_CURRENT_PAGE');
            loadGrid(page);
            thisBtn.disabled = false;
        });
    });
    // end detail modal

    // delete type
    Bisnis.Util.Event.bind('click', '.btn-delete', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Adv.Types.delete(id, function (textStatus) {
                    if (textStatus === 'success') {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('TYPES_CURRENT_PAGE');
                        loadGrid(page);
                    } else {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                })
            }
        });
    });

    Bisnis.Adv.Types.delete = function (id, callback) {
        Bisnis.request({
            module: 'advertising/types/' + id,
            method: 'delete'
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(callback)) {
                callback(textStatus);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };
    // end delete type

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