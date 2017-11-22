(function (Bisnis) {
    Bisnis.Adv.SpecificationDetails = {};

    Bisnis.Adv.SpecificationDetails.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/specification-details',
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


    // load grid
    var loadSpecDetailGrid = function (specId, pageNum) {
        pageNum = (!pageNum || 'null' === pageNum ) ? 1 : pageNum;
        Bisnis.Util.Storage.store('ADV_SPEC_DETAIL_CURRENT_PAGE', pageNum);
        Bisnis.Adv.SpecificationDetails.fetchAll([{page: pageNum},{'specification.id': specId}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#specificationDetailsPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.name },
                            { value: memberData.type ? memberData.type.name : '-' },
                            { value: memberData.remark },
                            { value: memberData.id, format: function (id) {
                                return '<span class="pull-right">' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail-spec" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete-detail-spec" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-price" title="HARGA IKLAN"><i class="fa fa-money"></i></button>' +
                                    '</span>';
                            }}
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#specificationDetailsList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#specificationDetailsList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMUAT DATA DETAIL JENIS IKLAN');
            }
        );
    };
    // end load grid

    // search
    var searchSpecDetail = function (specId) {
        var params = {
            placeholder: 'CARI DETAIL JENIS IKLAN',
            module: 'advertising/specification-details',
            filters: [
                {
                    key: 'specification.id',
                    value: specId
                }
            ],
            fields: [
                {
                    field: 'name',
                    label: 'DETAIL JENIS IKLAN'
                }
            ]
        };

        Bisnis.Util.Style.ajaxSelect('#searchSpecificationDetails', params,
            function (hasResultCallback) {
                var btn = document.getElementById('btnAddSpecificationDetail');
                hasResultCallback ? btn.disabled = true : btn.disabled = false;
            }, function (selectedCallback) {
                //loadSpecDetailGrid(selectedCallback.id);
            }, function (openCallback) {
                var btn = document.getElementById('btnAddSpecificationDetail');
                openCallback ? btn.disabled = true : btn.disabled = false;
            }, function (closeCallback) {
                var btn = document.getElementById('btnAddSpecificationDetail');
                setTimeout(function () {
                    closeCallback ? btn.disabled = true : btn.disabled = false;
                }, 300);
            }
        );
    };
    // end search

    // load modal for grid
    Bisnis.Util.Event.bind('click', '.btn-spc-detail', function () {
        Bisnis.Util.Dialog.showModal('#specDetailModal');
        var specId = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Storage.store('specId', specId);
        loadSpecDetailGrid(specId, 1);
        searchSpecDetail(specId);

        Bisnis.Util.Event.bind('click', '#specificationDetailsPagination .pagePrevious', function () {
            var specId = Bisnis.Util.Storage.fetch('specId');
            var page = Bisnis.Util.Document.getDataValue(this, 'page');
            loadSpecDetailGrid(specId, page);
        });

        Bisnis.Util.Event.bind('click', '#specificationDetailsPagination .pageNext', function () {
            var specId = Bisnis.Util.Storage.fetch('specId');
            var page = Bisnis.Util.Document.getDataValue(this, 'page');
            loadSpecDetailGrid(specId, page);
        });

        Bisnis.Util.Event.bind('click', '#specificationDetailsPagination .pageFirst', function () {
            var specId = Bisnis.Util.Storage.fetch('specId');
            var page = Bisnis.Util.Document.getDataValue(this, 'page');
            loadSpecDetailGrid(specId, page);
        });

        Bisnis.Util.Event.bind('click', '#specificationDetailsPagination .pageLast', function () {
            var specId = Bisnis.Util.Storage.fetch('specId');
            var page = Bisnis.Util.Document.getDataValue(this, 'page');
            loadSpecDetailGrid(specId, page);
        });
    });
    // end load modal for grid

    // add modal
    Bisnis.Util.Event.bind('click', '#btnAddSpecificationDetail', function () {
        var types = {
            placeholder: 'CARI TIPE IKLAN',
            module: 'advertising/types',
            prependValue: '/api/advertising/types/',
            allowClear: true,
            fields: [
                {
                    field: 'name',
                    label: 'Tipe Iklan'
                }
            ]
        };
        Bisnis.Util.Style.ajaxSelect('#addSpecDetailModal #addType', types);
        Bisnis.Util.Dialog.showModal('#addSpecDetailModal');
        document.querySelector('#addSpecDetailModal #addName').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add-spec-detail', function () {
        var params = Bisnis.Util.Form.serializeArray('#addSpecDetailForm');
        var specId = Bisnis.Util.Storage.fetch('specId');
        var thisBtn = this;
        thisBtn.disabled = true;

        params.push({
            name: 'specification',
            value: '/api/advertising/specifications/' + specId
        });

        Bisnis.Adv.SpecificationDetails.add(params,
            function () {
                Bisnis.Util.Dialog.hideModal('#addSpecDetailModal');
                var specId = Bisnis.Util.Storage.fetch('specId');
                loadSpecDetailGrid(specId, 1);
                thisBtn.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('addSpecDetailForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            }
        );
    });

    Bisnis.Adv.SpecificationDetails.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/specification-details',
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
    var loadSpecDetail = function (id) {
        Bisnis.Util.Storage.store('ADV_SPEC_DETAIL_ID', id);
        Bisnis.Adv.SpecificationDetails.fetchById(id,
            function (dataResponse) {
                var nameElem = document.querySelector('#detailSpecDetailModal #detailName');
                nameElem.value = dataResponse.name;
                nameElem.focus();

                if (dataResponse.type) {
                    var typeElm = document.querySelector('#detailSpecDetailModal #detailType');
                    typeElm.innerHTML = '<option value="/api/advertising/types/'+dataResponse.type.id+'">'+dataResponse.type.name+'</option>';
                    Bisnis.Util.Event.bind('change', '#detailSpecDetailModal #detailType');
                }

                Bisnis.Util.Style.modifySelect('#detailSpecDetailModal #detailType');
                var types = {
                    placeholder: 'CARI TIPE IKLAN',
                    module: 'advertising/types',
                    prependValue: '/api/advertising/types/',
                    allowClear: true,
                    fields: [
                        {
                            field: 'name',
                            label: 'Tipe Iklan'
                        }
                    ]
                };
                Bisnis.Util.Style.ajaxSelect('#detailSpecDetailModal #detailType', types);
                var remarkElem = document.querySelector('#detailSpecDetailModal #detailRemark');
                remarkElem.value = dataResponse.remark;

                Bisnis.Util.Dialog.showModal('#detailSpecDetailModal');
            }, function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMUAT DATA JENIS IKLAN');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-detail-spec', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadSpecDetail(id);
    });

    Bisnis.Adv.SpecificationDetails.fetchById = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/specification-details/' + id,
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

    Bisnis.Adv.SpecificationDetails.updateById = function (id, params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/specification-details/' + id,
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

    Bisnis.Util.Event.bind('click', '#btn-update-spec-detail', function () {
        var id = Bisnis.Util.Storage.fetch('ADV_SPEC_DETAIL_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailSpecDetailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.SpecificationDetails.updateById(id, params,
            function () {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailSpecDetailModal');
                var specId = Bisnis.Util.Storage.fetch('specId');
                var page = Bisnis.Util.Storage.fetch('ADV_SPEC_DETAIL_CURRENT_PAGE');
                loadSpecDetailGrid(specId, page);
                thisBtn.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('detailSpecDetailForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            });
    });
    // end detail modal

    // delete
    Bisnis.Util.Event.bind('click', '.btn-delete-detail-spec', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Adv.SpecificationDetails.delete(id,
                    function () {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var specId = Bisnis.Util.Storage.fetch('specId');
                        var page = Bisnis.Util.Storage.fetch('ADV_SPEC_DETAIL_CURRENT_PAGE');
                        loadSpecDetailGrid(specId, page);
                    }, function () {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                )
            }
        });
    });

    Bisnis.Adv.SpecificationDetails.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/specification-details/' + id,
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
    // end delete

    // prevent submit form on enter
    Bisnis.Util.Event.bind('keypress', '#addSpecDetailForm, #detailSpecDetailForm', function (e) {
        var key = e.charCode || e.keyCode || 0;
        if (key === 13) {
            Bisnis.Util.Dialog.alert("PERHATIAN", "SILAKAN TEKAN TOMBOL SIMPAN");
            e.preventDefault();
        }
    });
    // end prevent submit form on enter

    // reset modal form on modal hidden
    Bisnis.Util.Dialog.hiddenModal('#addSpecDetailModal', function () {
        Bisnis.Util.Grid.removeErrorForm('addSpecDetailForm');
        document.getElementById("addSpecDetailForm").reset();
        Bisnis.Util.Style.resetSelect('#addSpecDetailForm select');
    });
    Bisnis.Util.Dialog.hiddenModal('#detailSpecDetailModal', function () {
        Bisnis.Util.Grid.removeErrorForm('detailSpecDetailForm');
        document.getElementById("detailSpecDetailForm").reset();
        Bisnis.Util.Style.resetSelect('#detailSpecDetailForm select');
    });
    // end reset modal form on modal hidden
})(window.Bisnis || {});