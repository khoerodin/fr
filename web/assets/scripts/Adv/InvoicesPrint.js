(function (Bisnis) {
    Bisnis.Adv.InvoicesPrint = {};

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

    Bisnis.Util.Style.ajaxSelect('#searchOrderForPrint',
        params, null, function (selectedCallback) {
            getSelectedOrder(selectedCallback.id);
        }
    );
    // end search box

    // add selected to grid
    Bisnis.Util.Storage.remove('toGridArray');
    Bisnis.Util.Storage.remove('readyToPrint');

    var getSelectedOrder = function (orderId) {
        Bisnis.Adv.Orders.fetchById(orderId,
            function (dataResponse) {
                var dataArr = {
                    id: dataResponse.id,
                    orderNumber: dataResponse.orderNumber,
                    title: dataResponse.title.toUpperCase(),
                    customer: dataResponse.customer ? dataResponse.customer.name.toUpperCase() : '',
                    netto: (dataResponse.totalAmount * dataResponse.quantity),
                };
                Bisnis.Util.Storage.store('toGridArray', JSON.stringify(dataArr));
            },
            function () {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENGAMBIL DATA ORDER');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '#btnAddOrderForPrint', function () {
        var dataArr = JSON.parse(Bisnis.Util.Storage.fetch('toGridArray'));
        var orderId = dataArr.id;

        Bisnis.Adv.OrderInvoices.fetchAll([{'order.id': orderId}],
            function (dataResponse) {
                dataResponse = dataResponse['hydra:member'];
                if ( dataResponse.length > 0 ) {
                    var status = [];
                    dataResponse.forEach(function (value) {
                        if ( value.status !== 'v' ) {
                            status.push(1);
                        } else {
                            status.push(0);
                        }
                    });

                    // jika masih ada faktur yang status bukan void
                    if ( Bisnis.Util.Document.inArray(1, status) ) {
                        addToGrid();
                    } else {
                        Bisnis.Util.Dialog.alert('PERHATIAN', 'ORDER IKLAN INI TIDAK MEMILIKI FAKTUR');
                    }
                } else {
                    Bisnis.Util.Dialog.alert('PERHATIAN', 'ORDER IKLAN INI BELUM MEMILIKI FAKTUR');
                }
            }
        );
    });

    var addToGrid = function () {
        var dataArr = JSON.parse(Bisnis.Util.Storage.fetch('toGridArray'));
        if ( Bisnis.Util.Storage.fetch('readyToPrint') === null ) {
            var readyToPrint = [];
            readyToPrint.push(dataArr);
            Bisnis.Util.Storage.store('readyToPrint', JSON.stringify(readyToPrint));
        } else {
            var readyToPrint = JSON.parse(Bisnis.Util.Storage.fetch('readyToPrint'));
            var orderIds = [];
            readyToPrint.forEach(function (value) {
                orderIds.push(value.id);
            });
            if ( Bisnis.Util.Document.inArray(dataArr.id, orderIds) ) {
                Bisnis.Util.Dialog.alert('PERHATIAN', 'ORDER IKLAN INI SUDAH ANDA MASUKKAN');
            } else {
                readyToPrint.push(dataArr);
                Bisnis.Util.Storage.store('readyToPrint', JSON.stringify(readyToPrint));
            }
        }
        renderGrid();
    };

    var renderGrid = function () {
        var gridData = JSON.parse(Bisnis.Util.Storage.fetch('readyToPrint'));
        if (gridData.length > 0) {
            var records = [];
            Bisnis.each(function (idx, value) {
                records.push([
                    { value: value.orderNumber },
                    { value: value.title },
                    { value: value.customer  },
                    { value: value.netto, format: function (netto) {
                        return 'Rp ' + '<span class="pull-right">'+ Bisnis.Util.Money.format(netto) +'</span>';
                    } },
                ]);
            }, gridData);
            Bisnis.Util.Grid.renderRecords('#orderForPrintList', records, 'noPaging');
            document.querySelector('#printInvoicesBtn').classList.remove('hidden');

            var orderIds = [];
            gridData.forEach(function (value) {
                orderIds.push(value.id);
            });

            document.querySelector('#printInvoicesBtn').setAttribute('href', '/advertising/invoices-print-preview?ids=' + orderIds.toString());
            document.querySelector('#printInvoicesBtn').setAttribute('target', '_blank');
        } else {
            Bisnis.Util.Document.putHtml('#orderForPrintList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
            document.querySelector('#printInvoicesBtn').classList.add('hidden');
        }
    };
    // end add selected to grid

    // print invoices
    Bisnis.Util.Event.bind('click', '#printInvoicesBtn', function () {

    });
    // end print invoices
})(window.Bisnis || {});