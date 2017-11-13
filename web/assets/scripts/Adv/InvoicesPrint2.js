(function (Bisnis) {
    Bisnis.Adv.InvoicesPrint = {};

    jQuery('#rangeDates').datepicker({
        format: "dd/mm/yyyy",
        todayBtn: "linked",
        clearBtn: true,
        language: "id"
    });

    var loadOrdersToPrint = function (pageNum) {
        pageNum = (!pageNum || 'null' === pageNum ) ? 1 : pageNum;
        Bisnis.Util.Storage.store('ORDERS_TO_PRINT_CURRENT_PAGE', pageNum);
        var startDate = Bisnis.Util.Storage.fetch('INV_START_DATE');
        var endDate = Bisnis.Util.Storage.fetch('INV_END_DATE');

        startDate = window.moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        endDate = window.moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        var params = [
            {
                createdAt: {
                    strictly_after: startDate
                },
            },
            {
                createdAt: {
                    before: endDate
                },
            },
            {
                page: pageNum
            }
        ];
        Bisnis.Adv.Orders.fetchAll(params,
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#ordersToPrintPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.orderNumber.toUpperCase() },
                            { value: memberData.title.toUpperCase() },
                            { value: memberData.customer.name.toUpperCase() },
                            { value: memberData.totalAmount, format: function () {
                                var netto = Bisnis.Util.Money.format(memberData.totalAmount * memberData.quantity);
                                return 'Rp <span class="pull-right">' + netto + '</span>';
                            } }
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#ordersToPrintList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#ordersToPrintList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMUAT DATA ORDER IKLAN');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '#showOrders', function () {
        var startDate = document.querySelector('#startDate');
        var endDate = document.querySelector('#endDate');

        if (startDate.value && endDate.value) {
            Bisnis.Util.Storage.store('INV_START_DATE', startDate.value);
            Bisnis.Util.Storage.store('INV_END_DATE', endDate.value);
            loadOrdersToPrint(1);
        }
    });
})(window.Bisnis || {});