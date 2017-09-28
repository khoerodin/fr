(function (Bisnis) {
    Bisnis.Admin.Modules = {};

    // search box
    var params = {
        placeholder: 'CARI NAMA MODULE',
        module: 'modules',
        fields: [
            {
                field: 'name',
                label: 'Nama'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchModules', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddModule');
            if (hasResultCallback) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }, function (selectedCallback) {
            //selectedCallback = {disabled, element, id, label, selected, text, _resultId}
            console.log(selectedCallback)
            var id = selectedCallback.id;
            loadDetail(id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddModule');
            if (openCallback === false) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddModule');
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

    // fetch grid
    Bisnis.Admin.Modules.fetchByService = function (params, callback) {
        Bisnis.request({
            module: 'modules',
            method: 'get',
            params: params
        }, function (dataResponse, textStatus, response) {
            var rawData = JSON.parse(dataResponse);
            var memberData = rawData['hydra:member'];
            var viewData = rawData['hydra:view'];

            if ('undefined' !== typeof viewData['hydra:last']) {
                var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                Bisnis.Util.Grid.createPagination('#modulesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
            }

            if (Bisnis.validCallback(callback)) {
                callback(memberData);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };

    Bisnis.Admin.Modules.loadGrid = function (serviceId, pageNum, params) {
        var params = 'undefined' !== typeof params ? params : [];

        var pageNum =
            (isNaN(pageNum) || 'undefined' === typeof pageNum || 'null' === pageNum ) ? 1 : parseInt(pageNum);
        Bisnis.Util.Storage.store('MODULES_CURRENT_PAGE'+serviceId, pageNum);

        params.push({page: pageNum});

        if (typeof serviceId !== 'undefined') {
            params.push({service: serviceId});
        }

        Bisnis.Admin.Modules.fetchByService(params, function (memberData) {
            if (memberData.length > 0) {
                var records = [];
                Bisnis.each(function (idx, memberData) {
                    records.push([
                        { value: memberData.name },
                        { value: memberData.groupName },
                        { value: memberData.path },
                        { value: memberData.menuDisplay, format: function (menuDisplay) {
                            if (memberData.menuDisplay) {
                                return '<i class="fa fa-check text-success"></i>'
                            } else {
                                return '<i class="fa fa-times text-danger"></i>'
                            }
                        }},
                        { value: memberData.id, format: function (id) {
                            return '<span class="pull-right">' +
                                '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                '</span>';
                        }}
                    ]);
                }, memberData);
                Bisnis.Util.Grid.renderRecords('#modulesList'+serviceId, records);
            } else {
                Bisnis.Util.Document.putHtml('#modulesList'+serviceId, '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
            }
        });
    }

    var activeId = document.getElementById("serviceTab")
        .getElementsByClassName("active")[0]
        .getElementsByTagName('a')[0]
        .getAttribute('aria-controls');

    var pageNum = Bisnis.Util.Storage.fetch('MODULES_CURRENT_PAGE'+activeId);
    Bisnis.Admin.Modules.loadGrid(activeId, pageNum);

    Bisnis.Util.Dialog.shownTab('a[data-toggle="tab"]', function (e) {
        var activeId = e.target.getAttribute('aria-controls');
        var pageNum = Bisnis.Util.Storage.fetch('MODULES_CURRENT_PAGE'+activeId);
        Bisnis.Admin.Modules.loadGrid(activeId, pageNum);
    });
    // end fetch grid

    // add modal
    Bisnis.Util.Event.bind('click', '#btnAddModule', function () {
        Bisnis.Util.Style.modifySelect('#addService');
        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addName').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add', function () {
        var $this = this;
        var serviceOpt = document.getElementById('addService').getElementsByTagName('option');
        var services = [];
        Array.prototype.slice.call(serviceOpt).map(function(value) {
            if (value.selected) {
                services.push(value.value);
            }
        });

        var params = Bisnis.Util.Form.serializeArray('#addForm');
        params.push({
            name: 'service',
            value: services.join(',')
        });

        $this.disabled = true;
        Bisnis.Admin.Modules.add(params, function (callback) {

            if (callback.violations) {
                Bisnis.Util.Grid.validate('addForm', callback.violations);
            } else {
                Bisnis.Util.Dialog.hideModal('#addModal');

                var activeId = document.getElementById("serviceTab")
                    .getElementsByClassName("active")[0]
                    .getElementsByTagName('a')[0]
                    .getAttribute('aria-controls');
                var pageNum = Bisnis.Util.Storage.fetch('MODULES_CURRENT_PAGE'+activeId);
                Bisnis.Admin.Modules.loadGrid(activeId, pageNum);
            }

            $this.disabled = false;
        });
    });

    Bisnis.Admin.Modules.add = function (params, callback) {
        Bisnis.request({
            module: 'modules',
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
        Bisnis.Util.Storage.store('MODULES_ID', id);
        Bisnis.Admin.Modules.fetchById(id, function (callback) {
            var nameElem = document.getElementById('detailName');
            var descriptionElem = document.getElementById('detailDescription');
            var groupNameElem = document.getElementById('detailGroupName');
            var pathElem = document.getElementById('detailPath');
            var iconClsElem = document.getElementById('detailIconCls');
            var menuOrderElem = document.getElementById('detailMenuOrder');
            var menuDisplayElem = document.getElementById('detailMenuDisplay');

            nameElem.value = callback.name; nameElem.focus();
            descriptionElem.value = callback.description;
            groupNameElem.value = callback.groupName;
            pathElem.value = callback.path;
            iconClsElem.value = callback.iconCls;
            menuOrderElem.value = callback.menuOrder;
            menuDisplayElem.checked = callback.menuDisplay;

            var service = callback.service.split(',');
            Bisnis.Util.Document.putValue('#detailService', service);
            Bisnis.Util.Event.bind('change', '#detailService');
            Bisnis.Util.Style.modifySelect('#detailService');
        });

        Bisnis.Util.Dialog.showModal('#detailModal');
    };

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
    });

    Bisnis.Admin.Modules.fetchById = function (id, callback) {
        Bisnis.request({
            module: 'modules/' + id,
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

    Bisnis.Admin.Modules.updateById = function (id, params, callback) {
        Bisnis.request({
            module: 'modules/' + id,
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
        var id = Bisnis.Util.Storage.fetch('MODULES_ID');
        var serviceOpt = document.getElementById('detailService').getElementsByTagName('option');
        var services = [];
        Array.prototype.slice.call(serviceOpt).map(function(value) {
            if (value.selected) {
                services.push(value.value);
            }
        });

        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        params.push({
            name: 'service',
            value: services.join(',')
        });

        var $this = this;
        $this.disabled = true;

        Bisnis.Admin.Modules.updateById(id, params, function (callback) {
            if (callback.violations) {
                Bisnis.Util.Grid.validate('detailForm', callback.violations);
            } else {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailModal');

                var activeId = document.getElementById("serviceTab")
                    .getElementsByClassName("active")[0]
                    .getElementsByTagName('a')[0]
                    .getAttribute('aria-controls');
                var pageNum = Bisnis.Util.Storage.fetch('MODULES_CURRENT_PAGE'+activeId);
                Bisnis.Admin.Modules.loadGrid(activeId, pageNum);
            }
            $this.disabled = false;
        });
    });
    // end detail modal

    // delete module
    Bisnis.Util.Event.bind('click', '.btn-delete', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Admin.Modules.delete(id, function (textStatus) {
                    if (textStatus === 'success') {
                        Bisnis.successMessage('Berhasil menghapus data');

                        var activeId = document.getElementById("serviceTab")
                            .getElementsByClassName("active")[0]
                            .getElementsByTagName('a')[0]
                            .getAttribute('aria-controls');
                        var pageNum = Bisnis.Util.Storage.fetch('MODULES_CURRENT_PAGE'+activeId);
                        Bisnis.Admin.Modules.loadGrid(activeId, pageNum);
                    } else {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                })
            }
        });
    });

    Bisnis.Admin.Modules.delete = function (id, callback) {
        Bisnis.request({
            module: 'modules/' + id,
            method: 'delete'
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(callback)) {
                callback(textStatus);
            }
        }, function () {
            Bisnis.Util.Dialog.alert('ERROR', 'Maaf, terjadi kesalahan sistem');
        });
    };
    // end delete module

    // prevent submit form on enter
    document.getElementById("addForm").onkeypress = function(e) {
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            Bisnis.Util.Dialog.alert("PERHATIAN", "SILAKAN TEKAN TOMBOL SIMPAN");
            e.preventDefault();
        }
    };

    document.getElementById("detailForm").onkeypress = function(e) {
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            Bisnis.Util.Dialog.alert("PERHATIAN", "SILAKAN TEKAN TOMBOL SIMPAN");
            e.preventDefault();
        }
    };
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