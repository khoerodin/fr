(function (Bisnis) {
    Bisnis.Helpdesk.Staff = {};

    // fetch grid and pagination
    Bisnis.Helpdesk.Staff.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'helpdesk/staffs',
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

    Bisnis.Helpdesk.Staff.loadGrid = function (pageNum) {
        var pageNum =
            (isNaN(pageNum) || 'undefined' === typeof pageNum || 'null' === pageNum ) ? 1 : parseInt(pageNum);
        Bisnis.Util.Storage.store('STAFF_CURRENT_PAGE', pageNum);
        Bisnis.Helpdesk.Staff.fetchAll([{page: pageNum}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#staffsPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.user.fullname },
                            { value: memberData.category.name },
                            { value: memberData.isAdmin, format: function () {
                                if (memberData.isAdmin) {
                                    return '<i class="fa fa-check text-success"></i>'
                                } else {
                                    return '<i class="fa fa-times text-danger"></i>'
                                }
                            } },
                            { value: memberData.id, format: function (id) {
                                return '<span class="pull-right">' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                    '</span>';
                            } }
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#staffsList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#staffsList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA METODE PEMBAYARAN');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '#staffsPagination .pagePrevious', function () {
        Bisnis.Helpdesk.Staff.loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#staffsPagination .pageNext', function () {
        Bisnis.Helpdesk.Staff.loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#staffsPagination .pageFirst', function () {
        Bisnis.Helpdesk.Staff.loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#staffsPagination .pageLast', function () {
        Bisnis.Helpdesk.Staff.loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end fetch grid and pagination

    // search box
    var params = {
        placeholder: 'CARI NAMA STAFF',
        module: 'helpdesk/staffs',
        fields: [
            {
                field: 'fullname',
                label: 'Nama Staff'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchStaffs', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddStaff');
            btn.disabled = !!hasResultCallback;
        }, function (selectedCallback) {
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddStaff');
            btn.disabled = openCallback !== false;
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddStaff');
            setTimeout(function () {
                btn.disabled = closeCallback !== false;
            }, 300);
        }
    );
    // end search box

    // add modal
    Bisnis.Util.Event.bind('click', '#btnAddStaff', function () {
        Bisnis.Util.Style.modifySelect('#addUser');
        Bisnis.Util.Style.modifySelect('#addCategory');
        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addUser').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Helpdesk.Staff.add(params,
            function () {
                Bisnis.Util.Dialog.hideModal('#addModal');
                Bisnis.Helpdesk.Staff.loadGrid(1);
                thisBtn.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('addForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            }
        );
    });

    Bisnis.Helpdesk.Staff.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'helpdesk/staffs',
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
        Bisnis.Util.Storage.store('STAFF_ID', id);
        Bisnis.Util.Dialog.showModal('#detailModal');
        Bisnis.Helpdesk.Staff.fetchById(id,
            function (dataResponse) {
                var user = dataResponse.user;
                var detailUserOpt = Array.prototype.slice.call(document.getElementById('detailUser').options);
                detailUserOpt.map(function (value) {
                    Array.prototype.slice.call(value.attributes).forEach(function(item) {
                        if(item.value.split('/')[3] === user.id) {
                            value.selected = true;
                        }
                    });
                });
                Bisnis.Util.Style.modifySelect('#detailUser');
                document.getElementById('detailUser').focus();

                var category = dataResponse.category;
                var detailCategoryOpt = Array.prototype.slice.call(document.getElementById('detailCategory').options);
                detailCategoryOpt.map(function (value) {
                    Array.prototype.slice.call(value.attributes).forEach(function(item) {
                        if(item.value.split('/')[4] === category.id) {
                            value.selected = true;
                        }
                    });
                });
                Bisnis.Util.Style.modifySelect('#detailCategory');

                document.getElementById('detailIsAdmin').checked = dataResponse.isAdmin;

                Bisnis.Util.Dialog.showModal('#detailModal');
            }, function () {

            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
    });

    Bisnis.Helpdesk.Staff.fetchById = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'helpdesk/staffs/' + id,
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

    Bisnis.Helpdesk.Staff.updateById = function (id, params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'helpdesk/staffs/' + id,
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
        var id = Bisnis.Util.Storage.fetch('STAFF_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Helpdesk.Staff.updateById(id, params,
            function () {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailModal');
                var page = Bisnis.Util.Storage.fetch('STAFF_CURRENT_PAGE');
                Bisnis.Helpdesk.Staff.loadGrid(page);
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

    Bisnis.Helpdesk.Staff.fetchByCategory = function (categoryId, successCallback, errorCallback) {
        Bisnis.request({
            module: 'helpdesk/staffs',
            method: 'get',
            params: [{'category.id' : categoryId}]
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

    Bisnis.Helpdesk.Staff.fetchByUser = function (userId, successCallback, errorCallback) {
        Bisnis.request({
            module: 'helpdesk/staffs',
            method: 'get',
            params: [{'user.id' : userId}]
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

    // delete staff
    Bisnis.Util.Event.bind('click', '.btn-delete', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Helpdesk.Staff.delete(id,
                    function () {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('STAFF_CURRENT_PAGE');
                        Bisnis.Helpdesk.Staff.loadGrid(page);
                    }, function () {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                )
            }
        });
    });

    Bisnis.Helpdesk.Staff.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'helpdesk/staffs/' + id,
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
    // end delete staff

    // prevent submit form on enter
    Bisnis.Util.Event.bind('keypress', '#addForm, #detailForm', function (e) {
        var key = e.charCode || e.keyCode || 0;
        if (13 === key) {
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