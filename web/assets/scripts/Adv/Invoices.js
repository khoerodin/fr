(function (Bisnis) {
    Bisnis.Adv.Invoices = {};

    Bisnis.Adv.Invoices.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/invoices',
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

    var invoiceStatus = function (status) {
        var str;
        switch (status) {
            case 'a':
                str = '<span class="label label-success">ACTIVE</span>';
                break;
            case 'c':
                str = '<label class="label label-danger">CLOSE</label>';
                break;
            case 'v':
                str = '<label class="label label-warning">VOID</label>';
                break;
            default:
                str = '<span class="label label-danger">ERROR</span>';
        }

        return str;
    };

    var loadPage = function (pageNum, orderId) {
        var pageNum =
            (isNaN(pageNum) || 'undefined' === typeof pageNum || 'null' === pageNum ) ? 1 : parseInt(pageNum);
        Bisnis.Util.Storage.store(orderId + 'INVOICES_CURRENT_PAGE', pageNum);
        Bisnis.Adv.Invoices.fetchAll([{page: pageNum},{'order.id': orderId}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#invoicesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.invoiceNumber },
                            { value: '<span class="pull-right">' + Bisnis.Util.Money.format(memberData.amount) + '</span>' },
                            { value: invoiceStatus(memberData.status) }
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#invoicesList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#invoicesList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT LIST FAKTUR');
            }
        );
    };

    loadPage(1);

    Bisnis.Util.Event.bind('click', '#invoicesPagination .pagePrevious', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#invoicesPagination .pageNext', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#invoicesPagination .pageFirst', function () {
        loadPage(1);
    });

    Bisnis.Util.Event.bind('click', '#invoicesPagination .pageLast', function () {
        loadPage(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    var params = {
        placeholder: 'CARI NO FAKTUR',
        module: 'advertising/invoices',
        fields: [
            {
                field: 'invoiceNumber',
                label: 'No. Faktur'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchInvoices', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddInvoice');
            if (hasResultCallback) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        }, function (selectedCallback) {
            loadDetail(selectedCallback.id);
        }, function (openCallback) {
            var btn = document.getElementById('btnAddInvoice');
            if (openCallback === false) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }, function (closeCallback) {
            var btn = document.getElementById('btnAddInvoice');
            setTimeout(function () {
                if (closeCallback === false) {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }
            }, 300);
        }
    );

    Bisnis.Util.Event.bind('click', '#btnAddInvoice', function () {
        Bisnis.Util.Style.modifySelect('#selectNormalInvoice');
        Bisnis.Util.Dialog.showModal('#addModal');
    });
})(window.Bisnis || {});