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
    Bisnis.Admin.Modules.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'modules',
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

    Bisnis.Admin.Modules.loadGrid = function (serviceId, pageNum, params) {
        var params = 'undefined' !== typeof params ? params : [];

        var pageNum =
            (isNaN(pageNum) || 'undefined' === typeof pageNum || 'null' === pageNum ) ? 1 : parseInt(pageNum);
        Bisnis.Util.Storage.store('MODULES_CURRENT_PAGE'+serviceId, pageNum);

        params.push(
            { page: pageNum },
            { order: { name: 'ASC' } }
        );

        if (typeof serviceId !== 'undefined') {
            params.push({service: serviceId});
        }

        Bisnis.Admin.Modules.fetchAll(params,
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#modulesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

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
                    Bisnis.Util.Grid.renderRecords('#modulesList'+serviceId, records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#modulesList'+serviceId, '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA MODUL');
            }
        );
    };

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
        Bisnis.Admin.Modules.add(params,
            function () {
                Bisnis.Util.Dialog.hideModal('#addModal');

                var activeId = document.getElementById("serviceTab")
                    .getElementsByClassName("active")[0]
                    .getElementsByTagName('a')[0]
                    .getAttribute('aria-controls');
                var pageNum = Bisnis.Util.Storage.fetch('MODULES_CURRENT_PAGE'+activeId);
                Bisnis.Admin.Modules.loadGrid(activeId, pageNum);
                $this.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('addForm', response.responseJSON.violations);
                }
                $this.disabled = false;
            }
        );
    });

    Bisnis.Admin.Modules.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'modules',
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
        Bisnis.Util.Storage.store('MODULES_ID', id);
        Bisnis.Admin.Modules.fetchById(id,
            function (dataResponse) {
                var nameElem = document.getElementById('detailName');
                var descriptionElem = document.getElementById('detailDescription');
                var groupNameElem = document.getElementById('detailGroupName');
                var pathElem = document.getElementById('detailPath');
                var iconClsElem = document.getElementById('detailIconCls');
                var menuOrderElem = document.getElementById('detailMenuOrder');
                var menuDisplayElem = document.getElementById('detailMenuDisplay');

                nameElem.value = dataResponse.name; nameElem.focus();
                descriptionElem.value = dataResponse.description;
                groupNameElem.value = dataResponse.groupName;
                pathElem.value = dataResponse.path;
                iconClsElem.value = dataResponse.iconCls;
                menuOrderElem.value = dataResponse.menuOrder;
                menuDisplayElem.checked = dataResponse.menuDisplay;

                var service = dataResponse.service.split(',');
                Bisnis.Util.Document.putValue('#detailService', service);
                Bisnis.Util.Event.bind('change', '#detailService');
                Bisnis.Util.Style.modifySelect('#detailService');

                Bisnis.Util.Dialog.showModal('#detailModal');
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA MODUL');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
    });

    Bisnis.Admin.Modules.fetchById = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'modules/' + id,
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

    Bisnis.Admin.Modules.updateById = function (id, params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'modules/' + id,
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

        Bisnis.Admin.Modules.updateById(id, params,
            function () {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailModal');

                var activeId = document.getElementById("serviceTab")
                    .getElementsByClassName("active")[0]
                    .getElementsByTagName('a')[0]
                    .getAttribute('aria-controls');
                var pageNum = Bisnis.Util.Storage.fetch('MODULES_CURRENT_PAGE'+activeId);
                Bisnis.Admin.Modules.loadGrid(activeId, pageNum);
                $this.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('detailForm', response.responseJSON.violations);
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
                Bisnis.Admin.Modules.delete(id,
                    function () {
                        Bisnis.successMessage('Berhasil menghapus data');

                        var activeId = document.getElementById("serviceTab")
                            .getElementsByClassName("active")[0]
                            .getElementsByTagName('a')[0]
                            .getAttribute('aria-controls');
                        var pageNum = Bisnis.Util.Storage.fetch('MODULES_CURRENT_PAGE'+activeId);
                        Bisnis.Admin.Modules.loadGrid(activeId, pageNum);
                    }, function () {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                )
            }
        });
    });

    Bisnis.Admin.Modules.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'modules/' + id,
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
    // end delete module

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