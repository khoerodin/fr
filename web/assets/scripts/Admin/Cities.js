(function (Bisnis) {
    Bisnis.Admin.Cities = {};

    // fetch grid and pagination
    Bisnis.Admin.Cities.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'cities',
            method: 'get',
            params: params
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(successCallback)) {
                successCallback(dataResponse, textStatus, response);
            }
        }, function (response, textStatus, errorThrown) {
            if (Bisnis.validCallback(errorCallback)) {
                errorCallback(response, textStatus, errorThrown);
            }
        });
    };

    var loadGrid = function (pageNum) {
        var pageNum =
            (isNaN(pageNum) || 'undefined' === typeof pageNum || 'null' === pageNum ) ? 1 : parseInt(pageNum);
        Bisnis.Util.Storage.store('ADMIN_CITIES_CURRENT_PAGE', pageNum);
        Bisnis.Admin.Cities.fetchAll([{page: pageNum}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#citiesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.code },
                            { value: memberData.name },
                            { value: memberData.postalCode },
                            { value: (memberData.parent) ? memberData.parent.name : '-' },
                            { value: memberData.id, format: function (id) {
                                return '<span class="pull-right">' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                    '</span>';
                            }}
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#citiesList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#citiesList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA KOTA');
            }
        );
    };

    loadGrid(1);

    Bisnis.Util.Event.bind('click', '#citiesPagination .pagePrevious', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#citiesPagination .pageNext', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#citiesPagination .pageFirst', function () {
        loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#citiesPagination .pageLast', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end fetch grid and pagination

    // search box
    var params = {
        placeholder: 'CARI KODE / NAMA KOTA',
        module: 'cities',
        fields: [
            {
                field: 'code',
                label: 'Kode'
            },
            {
                field: 'name',
                label: 'Kota'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchCities', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddCity');
            if (hasResultCallback) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }, function (selectedCallback) {
            //selectedCallback = {disabled, element, id, label, selected, text, _resultId}
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddCity');
            if (openCallback === false) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddCity');
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
    Bisnis.Util.Event.bind('click', '#btnAddCity', function () {

        var parent = {
            placeholder: 'CARI NAMA KOTA',
            module: 'cities',
            prependValue: '/api/cities/',
            allowClear: true,
            fields: [
                {
                    field: 'name',
                    label: 'Kota'
                }
            ]
        };
        Bisnis.Util.Style.ajaxSelect('#addParent', parent);

        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addParent').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Admin.Cities.add(params, function (callback) {
            if (callback.violations) {
                Bisnis.Util.Grid.validate('addForm', callback.violations);
            } else {
                Bisnis.Util.Dialog.hideModal('#addModal');
                loadGrid(1);
            }
            thisBtn.disabled = false;
        });
    });

    Bisnis.Admin.Cities.add = function (params, callback) {
        // di filter pake hash, agar tidak terdeteksi sebagai int
        var fields = [
            'postalCode'
        ];
        var params = Bisnis.Util.Form.hashPrepand(fields, params);

        Bisnis.request({
            module: 'cities',
            method: 'post',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = dataResponse;

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
        Bisnis.Util.Storage.store('ADMIN_CLIENTS_ID', id);
        Bisnis.Admin.Cities.fetchById(id, function (callback) {
            if (callback.parent) {
                var userElm = document.getElementById('detailParent');
                userElm.innerHTML = '<option value="/api/cities/'+callback.parent.id+'">'+callback.parent.name+'</option>';
                Bisnis.Util.Event.bind('change', '#detailParent');
            }

            Bisnis.Util.Style.modifySelect('#detailParent');
            var parent = {
                placeholder: 'CARI KOTA',
                module: 'cities',
                prependValue: '/api/cities/',
                allowClear: true,
                fields: [
                    {
                        field: 'name',
                        label: 'Kota'
                    }
                ]
            };
            Bisnis.Util.Style.ajaxSelect('#detailParent', parent);

            document.getElementById('detailCode').value = callback.code;
            document.getElementById('detailName').value = callback.name;
            document.getElementById('detailPostalCode').value = callback.postalCode;
        });

        Bisnis.Util.Dialog.showModal('#detailModal');
        document.getElementById('detailParent').focus();
    };

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
    });

    Bisnis.Admin.Cities.fetchById = function (id, callback) {
        Bisnis.request({
            module: 'cities/' + id,
            method: 'get'
        }, function (dataResponse, textStatus, response) {
            var rawData = dataResponse;

            if (Bisnis.validCallback(callback)) {
                callback(rawData);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };

    Bisnis.Admin.Cities.updateById = function (id, params, callback) {
        // di filter pake hash, agar tidak terdeteksi sebagai int
        var fields = [
            'postalCode'
        ];
        var params = Bisnis.Util.Form.hashPrepand(fields, params);

        Bisnis.request({
            module: 'cities/' + id,
            method: 'put',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = dataResponse;

            if (Bisnis.validCallback(callback)) {
                callback(rawData);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };

    Bisnis.Util.Event.bind('click', '#btn-update', function () {
        var id = Bisnis.Util.Storage.fetch('ADMIN_CLIENTS_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Admin.Cities.updateById(id, params, function (callback) {
            if (callback.violations) {
                Bisnis.Util.Grid.validate('detailForm', callback.violations);
            } else {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailModal');
                var page = Bisnis.Util.Storage.fetch('ADMIN_CITIES_CURRENT_PAGE');
                loadGrid(page);
            }
            thisBtn.disabled = false;
        });
    });
    // end detail modal

    // delete
    Bisnis.Util.Event.bind('click', '.btn-delete', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Admin.Cities.delete(id, function (textStatus) {
                    if (textStatus === 'success') {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('ADMIN_CITIES_CURRENT_PAGE');
                        loadGrid(page);
                    } else {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                })
            }
        });
    });

    Bisnis.Admin.Cities.delete = function (id, callback) {
        Bisnis.request({
            module: 'cities/' + id,
            method: 'delete'
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(callback)) {
                callback(textStatus);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };
    // end delete

    // prevent submit form on enter
    Bisnis.Util.Event.bind('keypress', '#addForm, #detailForm', function (e) {
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            Bisnis.Util.Dialog.alert("PERHATIAN", "SILAKAN TEKAN TOMBOL SIMPAN");
            e.preventDefault();
        }
    });
    // end prevent submit form on enter

    // reset modal form on modal hidden
    Bisnis.Util.Dialog.hiddenModal('#addModal', function () {
        Bisnis.Util.Grid.removeErrorForm('addForm');
        document.getElementById("addForm").reset();
    });
    Bisnis.Util.Dialog.hiddenModal('#detailModal', function () {
        Bisnis.Util.Grid.removeErrorForm('detailForm');
        document.getElementById("detailForm").reset();
    });
    // end reset modal form on modal hidden

})(window.Bisnis || {});