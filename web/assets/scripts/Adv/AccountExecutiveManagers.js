(function (Bisnis) {
    Bisnis.Adv.AccountExecutiveManagers= {};

    // fetch grid and pagination
    Bisnis.Adv.AccountExecutiveManagers.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executive-managers',
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
        pageNum = (!pageNum || 'null' === pageNum ) ? 1 : pageNum;
        Bisnis.Util.Storage.store('ACCOUNT_EXECUTIVE_MANAGERS_CURRENT_PAGE', pageNum);
        Bisnis.Adv.AccountExecutiveManagers.fetchAll([{page: pageNum}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#accountExecutiveManagersPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.teamWork.name },
                            { value: memberData.code },
                            { value: memberData.name },
                            { value: memberData.id, format: function (id) {
                                return '<span class="pull-right">' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                    '</span>';
                            }}
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#accountExecutiveManagersList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#accountExecutiveManagersList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMUAT DATA MANAJER AKUN EKSEKUTIF');
            }
        );
    };

    loadGrid(1);

    Bisnis.Util.Event.bind('click', '#accountExecutiveManagersPagination .pagePrevious', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#accountExecutiveManagersPagination .pageNext', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#accountExecutiveManagersPagination .pageFirst', function () {
        loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#accountExecutiveManagersPagination .pageLast', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end fetch grid and pagination

    // search box
    var params = {
        placeholder: 'CARI KODE / NAMA MANAJER AKUN EKSEKUTIF',
        module: 'advertising/account-executive-managers',
        fields: [
            {
                field: 'code',
                label: 'Kode'
            },
            {
                field: 'name',
                label: 'Manajer'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchAccountExecutiveManagers', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddAccountExecutiveManager');
            hasResultCallback ? btn.disabled = true : btn.disabled = false;
        }, function (selectedCallback) {
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddAccountExecutiveManager');
            openCallback ? btn.disabled = true : btn.disabled = false;
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddAccountExecutiveManager');
            setTimeout(function () {
                closeCallback ? btn.disabled = true : btn.disabled = false;
            }, 300);
        }
    );
    // end search box

    // add modal
    Bisnis.Util.Event.bind('click', '#btnAddAccountExecutiveManager', function () {
        var params = {
            placeholder: 'CARI KODE / NAMA TIM KERJA',
            module: 'advertising/team-works',
            prependValue: '/api/advertising/team-works/',
            fields: [
                {
                    field: 'code',
                    label: 'Kode'
                },
                {
                    field: 'name',
                    label: 'Tim Kerja'
                },
            ]
        };
        Bisnis.Util.Style.ajaxSelect('#addTeamWork', params);

        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addTeamWork').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.AccountExecutiveManagers.add(params,
            function () {
                Bisnis.Util.Dialog.hideModal('#addModal');
                loadGrid(1);
                thisBtn.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('addForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            }
        );
    });

    Bisnis.Adv.AccountExecutiveManagers.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executive-managers',
            method: 'post',
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
    // end add modal

    // detail modal
    var loadDetail = function (id) {
        Bisnis.Util.Storage.store('ACCOUNT_EXECUTIVE_MANAGER_ID', id);
        Bisnis.Adv.AccountExecutiveManagers.fetchById(id,
            function (dataResponse) {
                var teamWorkElem = document.getElementById('detailTeamWork');
                teamWorkElem.innerHTML = '<option value="/api/advertising/team-works/'+dataResponse.teamWork.id+'">'+dataResponse.teamWork.name+'</option>';

                Bisnis.Util.Event.bind('change', '#detailTeamWork');
                Bisnis.Util.Style.modifySelect('#detailTeamWork');
                var params = {
                    placeholder: 'CARI KODE / NAMA TIM KERJA',
                    module: 'advertising/team-works',
                    prependValue: '/api/advertising/team-works/',
                    fields: [
                        {
                            field: 'code',
                            label: 'Kode'
                        },
                        {
                            field: 'name',
                            label: 'Tim Kerja'
                        },
                    ]
                };
                Bisnis.Util.Style.ajaxSelect('#detailTeamWork', params);

                document.getElementById('detailTeamWork').focus();

                var codeElem = document.getElementById('detailCode');
                codeElem.value = dataResponse.code;

                var nameElem = document.getElementById('detailName');
                nameElem.value = dataResponse.name;
                Bisnis.Util.Dialog.showModal('#detailModal');
            }, function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMUAT DATA MANAJER AKUN EKSEKUTIF');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
    });

    Bisnis.Adv.AccountExecutiveManagers.fetchById = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executive-managers/' + id,
            method: 'get'
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

    Bisnis.Adv.AccountExecutiveManagers.updateById = function (id, params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executive-managers/' + id,
            method: 'put',
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

    Bisnis.Util.Event.bind('click', '#btn-update', function () {
        var id = Bisnis.Util.Storage.fetch('ACCOUNT_EXECUTIVE_MANAGER_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.AccountExecutiveManagers.updateById(id, params,
            function () {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailModal');
                var page = Bisnis.Util.Storage.fetch('ACCOUNT_EXECUTIVE_MANAGERS_CURRENT_PAGE');
                loadGrid(page);
                thisBtn.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('detailForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            }
        );
    });
    // end detail modal

    // delete account executive manager
    Bisnis.Util.Event.bind('click', '.btn-delete', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Adv.AccountExecutiveManagers.delete(id,
                    function () {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('ACCOUNT_EXECUTIVE_MANAGERS_CURRENT_PAGE');
                        loadGrid(page);
                    }, function () {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                )
            }
        });
    });

    Bisnis.Adv.AccountExecutiveManagers.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executive-managers/' + id,
            method: 'delete'
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
    // end delete account executive manager

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
        Bisnis.Util.Style.resetSelect('#addForm select');
    });
    Bisnis.Util.Dialog.hiddenModal('#detailModal', function () {
        Bisnis.Util.Grid.removeErrorForm('detailForm');
        document.getElementById("detailForm").reset();
        Bisnis.Util.Style.resetSelect('#detailForm select');
    });
    // end reset modal form on modal hidden

})(window.Bisnis || {});