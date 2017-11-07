(function (Bisnis) {
    Bisnis.Adv.Prices = {};

    Bisnis.Adv.Prices.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/prices',
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
    var loadPricesGrid = function (specDetailId, pageNum) {
        pageNum = (!pageNum || 'null' === pageNum ) ? 1 : pageNum;
        Bisnis.Util.Storage.store('ADV_PRICES_CURRENT_PAGE', pageNum);
        Bisnis.Adv.Prices.fetchAll([{page: pageNum},{'specificationDetail.id': specDetailId}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#pricesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.year },
                            { value: Bisnis.Util.Money.format(memberData.price) },
                            { value: memberData.active, format: function (active) {
                                return active ? '<span class="text-success">AKTIF</span>' : '<span class="text-danger">TIDAK</span>';
                            } },
                            { value: memberData.id, format: function (id) {
                                return '<span class="pull-right">' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail-price" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete-price" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                    '</span>';
                            }}
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#pricesList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#pricesList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMUAT DATA HARGA IKLAN');
            }
        );
    };
    // end load grid

    // search
    var searchPrices = function (specDetailId) {
        var params = {
            placeholder: 'CARI TAHUN',
            module: 'advertising/prices',
            filters: [
                {
                    key: 'specificationDetail.id',
                    value: specDetailId
                }
            ],
            fields: [
                {
                    field: 'year',
                    label: 'TAHUN'
                }
            ]
        };

        Bisnis.Util.Style.ajaxSelect('#searchPrices', params,
            function (hasResultCallback) {
                var btn = document.getElementById('btnAddPrices');
                hasResultCallback ? btn.disabled = true : btn.disabled = false;
            }, function (selectedCallback) {
                //loadPricesGrid(selectedCallback.id);
            }, function (openCallback) {
                var btn = document.getElementById('btnAddPrices');
                openCallback ? btn.disabled = true : btn.disabled = false;
            }, function (closeCallback) {
                var btn = document.getElementById('btnAddPrices');
                setTimeout(function () {
                    closeCallback ? btn.disabled = true : btn.disabled = false;
                }, 300);
            }
        );
    };
    // end search

    // load modal for grid
    Bisnis.Util.Event.bind('click', '.btn-price', function () {
        Bisnis.Util.Dialog.showModal('#pricesModal');
        var specDetailId = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Storage.store('specDetailId', specDetailId);
        loadPricesGrid(specDetailId, 1);
        searchPrices(specDetailId);

        Bisnis.Util.Event.bind('click', '#pricesPagination .pagePrevious', function () {
            var specDetailId = Bisnis.Util.Storage.fetch('specDetailId');
            var page = Bisnis.Util.Document.getDataValue(this, 'page');
            loadPricesGrid(specDetailId, page);
        });

        Bisnis.Util.Event.bind('click', '#pricesPagination .pageNext', function () {
            var specDetailId = Bisnis.Util.Storage.fetch('specDetailId');
            var page = Bisnis.Util.Document.getDataValue(this, 'page');
            loadPricesGrid(specDetailId, page);
        });

        Bisnis.Util.Event.bind('click', '#pricesPagination .pageFirst', function () {
            var specDetailId = Bisnis.Util.Storage.fetch('specDetailId');
            var page = Bisnis.Util.Document.getDataValue(this, 'page');
            loadPricesGrid(specDetailId, page);
        });

        Bisnis.Util.Event.bind('click', '#pricesPagination .pageLast', function () {
            var specDetailId = Bisnis.Util.Storage.fetch('specDetailId');
            var page = Bisnis.Util.Document.getDataValue(this, 'page');
            loadPricesGrid(specDetailId, page);
        });
    });
    // end load modal for grid

    // add modal
    Bisnis.Util.Event.bind('click', '#btnAddPrices', function () {
        Bisnis.Util.Dialog.showModal('#addPriceModal');
        document.querySelector('#addPriceModal #addYear').focus();
        Bisnis.Util.Money.formatInput('#addPriceModal #addPrice');
    });

    Bisnis.Util.Event.bind('click', '#btn-add-price', function () {
        var params = Bisnis.Util.Form.serializeArray('#addPriceForm');
        var specDetailId = Bisnis.Util.Storage.fetch('specDetailId');
        var thisBtn = this;
        thisBtn.disabled = true;

        params.push(
            {
                name: 'specificationDetail',
                value: '/api/advertising/specification-details/' + specDetailId
            },
            {
                name: 'active',
                value: true
            }
        );

        var normalized = [];
        params.forEach(function (val) {
            normalized.push({
                name: val.name,
                value: ( val.name === 'price' ) ? Bisnis.Util.Money.unFormat(val.value) : val.value
            })
        });

        Bisnis.Adv.Prices.add(normalized,
            function () {
                Bisnis.Util.Dialog.hideModal('#addPriceModal');
                var specDetailId = Bisnis.Util.Storage.fetch('specDetailId');
                loadPricesGrid(specDetailId, 1);
                thisBtn.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('addSpecDetailForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            }
        );
    });

    Bisnis.Adv.Prices.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/prices',
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
    var loadDetailPrice = function (id) {
        Bisnis.Util.Storage.store('PRICE_ID', id);
        Bisnis.Adv.Prices.fetchById(id,
            function (dataResponse) {
                document.getElementById('detailYear').value = dataResponse.year;
                document.getElementById('detailYear').focus();
                document.getElementById('detailPrice').value = dataResponse.price;
                document.getElementById('detailActive').checked = dataResponse.active;
                Bisnis.Util.Money.formatInput('#detailPrice');

                Bisnis.Util.Dialog.showModal('#detailPriceModal');
            }, function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMUAT DATA HARGA IKLAN');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-detail-price', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetailPrice(id);
    });

    Bisnis.Adv.Prices.fetchById = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/prices/' + id,
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

    Bisnis.Adv.Prices.updateById = function (id, params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/prices/' + id,
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

    Bisnis.Util.Event.bind('click', '#btn-update-price', function () {
        var id = Bisnis.Util.Storage.fetch('PRICE_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailPriceForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        var normalized = [];
        params.forEach(function (val) {
            normalized.push({
                name: val.name,
                value: ( val.name === 'price' ) ? Bisnis.Util.Money.unFormat(val.value) : val.value
            })
        });

        Bisnis.Adv.Prices.updateById(id, normalized,
            function () {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailPriceModal');
                var specDetailId = Bisnis.Util.Storage.fetch('specDetailId');
                var page = Bisnis.Util.Storage.fetch('ADV_PRICES_CURRENT_PAGE');
                loadPricesGrid(specDetailId, page);
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

    // delete
    Bisnis.Util.Event.bind('click', '.btn-delete-price', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Adv.Prices.delete(id,
                    function () {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var specDetailId = Bisnis.Util.Storage.fetch('specDetailId');
                        var page = Bisnis.Util.Storage.fetch('ADV_PRICES_CURRENT_PAGE');
                        loadPricesGrid(specDetailId, page);
                    }, function () {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                )
            }
        });
    });

    Bisnis.Adv.Prices.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/prices/' + id,
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

    // reset modal form on modal hidden
    Bisnis.Util.Dialog.hiddenModal('#addPriceModal', function () {
        Bisnis.Util.Grid.removeErrorForm('addPriceForm');
        document.getElementById("addPriceForm").reset();
    });
    Bisnis.Util.Dialog.hiddenModal('#detailPriceModal', function () {
        Bisnis.Util.Grid.removeErrorForm('detailPriceForm');
        document.getElementById("detailPriceForm").reset();
    });
    // end reset modal form on modal hidden
})(window.Bisnis || {});