(function (Bisnis) {
    Bisnis.Adv.Orders = {};

    Bisnis.Adv.Orders.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/orders',
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

    Bisnis.Adv.Orders.fetchById = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/orders/' + id,
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

    Bisnis.Adv.Orders.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/orders',
            method: 'post',
            params: params,
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

    var orderStatus = function (status) {
        var st;
        switch (status) {
            case 'a':
                st = "<span class='label label-success'>ACTIVE</span>";
                break;
            case 'i':
                st = "<span class='label label-warning'>INVOICE</span>";
                break;
            case 'v':
                st = "<span class='label label-danger'>VOID</span>";
                break;
            case 'c':
                st = "<span class='label label-default'>CLOSED</span>";
                break;
            default:
                st = "<span class='label label-success'>ACTIVE</span>";
        }
        return st;
    };

    var gerOrderNumber = function (orderId, idx) {
        Bisnis.Adv.Orders.fetchById(orderId,
            function (dataResponse) {
                if (dataResponse.orderNumber) {
                    document.querySelector('#ref' + idx).innerText = dataResponse.orderNumber;
                } else {
                    document.querySelector('#ref' + idx).innerHTML = '-';
                }
            },
            function () {
                document.querySelector('#ref' + idx).innerHTML = '<span class="text-danger">Error</span>';
            }
        );
    };

    var loadGrid = function (pageNum) {
        pageNum = (!pageNum || 'null' === pageNum ) ? 1 : pageNum;
        Bisnis.Util.Storage.store('ORDERS_CURRENT_PAGE', pageNum);
        Bisnis.Adv.Orders.fetchAll([{page: pageNum}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#ordersPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.orderNumber },
                            { value: memberData.orderLetter },
                            { value: memberData.title },
                            { value: memberData.customer.name },
                            { value: memberData.client.name },
                            { value: memberData.status, format: function (status) {
                                return orderStatus(status);
                            } },
                            { value: memberData.orderRefference, format: function (orderRefference) {
                                gerOrderNumber(orderRefference, (parseInt(idx) + 1));
                                return '<span id="ref'+ (parseInt(idx) + 1) +'"></span>';
                            } },
                            { value: memberData.id, format: function (id) {
                                return '<span class="pull-right">' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-clone" title="DUPLIKASI ORDER INI"><i class="fa fa-clone"></i></button>' +
                                    '</span>';
                            }}
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#ordersList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#ordersList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA ORDER IKLAN');
            }
        );
    };

    loadGrid(1);

    Bisnis.Util.Event.bind('click', '#ordersPagination .pagePrevious', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#ordersPagination .pageNext', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#ordersPagination .pageFirst', function () {
        loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#ordersPagination .pageLast', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end fetch grid and pagination

    // search box
    var params = {
        placeholder: 'CARI NO. ORDER / NO. SURAT ORDER',
        module: 'advertising/orders',
        fields: [
            {
                field: 'orderNumber',
                label: 'No. Order'
            },
            {
                field: 'orderLetter',
                label: 'No. Surat Order'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchOrders', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddOrder');
            hasResultCallback ? btn.disabled = true : btn.disabled = false;
        }, function (selectedCallback) {
            window.location.href = '/advertising/orders/' + selectedCallback.id;
        }, function (openCallback) {
            var btn = document.getElementById('btnAddOrder');
            openCallback ? btn.disabled = true : btn.disabled = false;
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddOrder');
            setTimeout(() => {
                closeCallback ? btn.disabled = true : btn.disabled = false;
            }, 300);
        }
    );
    // end search box

    // button action
    Bisnis.Util.Event.bind('click', '#btnAddOrder', function () {
        window.location.href = '/advertising/orders/new';
    });
    Bisnis.Util.Event.bind('click', '.btn-detail', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        window.location.href = '/advertising/orders/' + id;
    });

    var createParams = function (dataResponse, orderId) {
        var params = [];
        for (var key in dataResponse) {
            if ( key !== 'id') {
                var value = '';
                if ( typeof dataResponse[key] === 'object') {
                    if (dataResponse[key]) {
                        value = dataResponse[key]['@id'];
                    } else {
                        value = null;
                    }
                } else {
                    value = dataResponse[key];
                }

                if (key === 'orderRefference') {
                    value = orderId;
                }
                params.push({name: key, value: value});
            }
        }
        return params;
    };

    var savePublishAds = function (response) {
        Bisnis.Adv.PublishAds.fetchAll([{'order.id': response.id}],
            function (PAResponse) {
                var memberData = PAResponse['hydra:member'];
                var panjang = memberData.length;
                if (panjang > 0) {
                    forEach.memberData(function (value, index) {
                        var PAParams = [
                            {name: 'order', value: '/api/advertising/orders/' + value.order.id},
                            {name: 'publishDate', value: value.publishDate}
                        ];
                        if (panjang === (index +1)) {
                            Bisnis.Adv.PublishAds.add(PAParams,
                                function () {
                                    loadGrid(Bisnis.Util.Storage.fetch('ORDERS_CURRENT_PAGE'));
                                    Bisnis.successMessage('Berhasil menduplikasi order');
                                },
                                function () {
                                    Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENYIMPAN TANGGAL ORDER');
                                }
                            );
                        } else {
                            Bisnis.Adv.PublishAds.add(PAParams);
                        }
                    });
                } else {
                    loadGrid(loadGrid(Bisnis.Util.Storage.fetch('ORDERS_CURRENT_PAGE')));
                    Bisnis.successMessage('Berhasil menduplikasi order');
                }
            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENDUPLIKASI ORDER');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-clone', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('PERHATIAN', 'BENAR ANDA AKAN MENDUPLIKASI IKLAN INI?', function (response) {
            if (response) {
                Bisnis.Adv.Orders.fetchById(id,
                    function (dataResponse) {
                        var params = createParams(dataResponse, dataResponse.id);
                        Bisnis.Adv.Orders.add(params,
                            function (response) {
                                savePublishAds(response);
                            },
                            function () {
                                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENDUPLIKASI ORDER');
                            }
                        );
                    },
                    function () {
                        Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENDAPATKAN DATA DATA ORDER INI');
                    }
                );
            }
        });
    });
    // end button action
})(window.Bisnis || {});