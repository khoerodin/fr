(function (Bisnis) {
    Bisnis.Admin.Representatives= {};

    // fetch grid and pagination
    Bisnis.Admin.Representatives.fetchAll = function (params, callback) {
        Bisnis.request({
            module: 'representatives',
            method: 'get',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);
            var memberData = rawData['hydra:member'];
            var viewData = rawData['hydra:view'];

            if ('undefined' !== typeof viewData['hydra:last']) {
                var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                Bisnis.Util.Grid.createPagination('#representativesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
            }

            if (Bisnis.validCallback(callback)) {
                callback(memberData);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };

    var loadGrid = function (pageNum) {
        var pageNum = ('undefined' === typeof pageNum || 'null' === pageNum) ? 1 : parseInt(pageNum);
        Bisnis.Util.Storage.store('REPRESENTATIVES_CURRENT_PAGE', pageNum);
        Bisnis.Admin.Representatives.fetchAll([{page: pageNum}], function (memberData) {
            if (memberData.length > 0) {
                var records = [];
                Bisnis.each(function (idx, memberData) {
                    records.push([
                        { value: memberData.code },
                        { value: memberData.name },
                        { value: memberData.address },
                        { value: memberData.id, format: function (id) {
                            return '<span class="pull-right">' +
                                '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                '</span>';
                        }}
                    ]);
                }, memberData);
                Bisnis.Util.Grid.renderRecords('#representativesList', records);
            } else {
                Bisnis.Util.Document.putHtml('#representativesList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
            }
        });
    };

    loadGrid(1);

    Bisnis.Util.Event.bind('click', '#representativesPagination .pagePrevious', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#representativesPagination .pageNext', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#representativesPagination .pageFirst', function () {
        loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#representativesPagination .pageLast', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end fetch grid and pagination

    // search box
    var params = {
        placeholder: 'CARI KODE / NAMA PERWAKILAN',
        module: 'representatives',
        fields: [
            {
                field: 'code',
                label: 'Kode'
            },
            {
                field: 'name',
                label: 'Nama'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchRepresentatives', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddRepresentative');
            if (hasResultCallback) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }, function (selectedCallback) {
            //selectedCallback = {disabled, element, id, label, selected, text, _resultId}
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddRepresentative');
            if (openCallback === false) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddRepresentative');
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
    Bisnis.Util.Event.bind('click', '#btnAddRepresentative', function () {
        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addCode').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Admin.Representatives.add(params, function (callback) {
            if (callback.violations) {
                Bisnis.Util.Grid.validate('addForm', callback.violations);
            } else {
                Bisnis.Util.Dialog.hideModal('#addModal');
                loadGrid(1);
            }
            thisBtn.disabled = false;
        });
    });

    Bisnis.Admin.Representatives.add = function (params, callback) {
        Bisnis.request({
            module: 'representatives',
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
        Bisnis.Util.Storage.store('REPRESENTATIVE_ID', id);
        Bisnis.Admin.Representatives.fetchById(id, function (callback) {
            var codeElem = document.getElementById('detailCode');
            codeElem.value = callback.code;
            codeElem.focus();

            var nameElem = document.getElementById('detailName');
            nameElem.value = callback.name;

            var addressElem = document.getElementById('detailAddress');
            addressElem.value = callback.address;
        });
        Bisnis.Util.Dialog.showModal('#detailModal');
    };

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
    });

    Bisnis.Admin.Representatives.fetchById = function (id, callback) {
        Bisnis.request({
            module: 'representatives/' + id,
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

    Bisnis.Admin.Representatives.updateById = function (id, params, callback) {
        Bisnis.request({
            module: 'representatives/' + id,
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
        var id = Bisnis.Util.Storage.fetch('REPRESENTATIVE_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Admin.Representatives.updateById(id, params, function (callback) {
            if (callback.violations) {
                Bisnis.Util.Grid.validate('detailForm', callback.violations);
            } else {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailModal');
                var page = Bisnis.Util.Storage.fetch('REPRESENTATIVES_CURRENT_PAGE');
                loadGrid(page);
            }
            thisBtn.disabled = false;
        });
    });
    // end detail modal

    // delete representative
    Bisnis.Util.Event.bind('click', '.btn-delete', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Admin.Representatives.delete(id, function (textStatus) {
                    if (textStatus === 'success') {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('REPRESENTATIVES_CURRENT_PAGE');
                        loadGrid(page);
                    } else {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                })
            }
        });
    });

    Bisnis.Admin.Representatives.delete = function (id, callback) {
        Bisnis.request({
            module: 'representatives/' + id,
            method: 'delete'
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(callback)) {
                callback(textStatus);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };
    // end delete representative

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

    // reset modal form on modal hidden
    Bisnis.Util.Dialog.hiddenModal('#addModal', function () {
        document.getElementById("addForm").reset();
    });
    Bisnis.Util.Dialog.hiddenModal('#detailModal', function () {
        document.getElementById("detailForm").reset();
    });
    // end reset modal form on modal hidden

})(window.Bisnis || {});