function getOrders(param) {
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/orders',
            method: 'get',
            params: [
                {
                    orderNumber: param
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {

            if (jqXHR.status == 200) {

                var memberData = JSON.parse(data)['hydra:member'];
                var no = 1;
                var searchArea;

                tableData  = '<table class="table table-bordered table-responsive table-hover">';
                tableData += '<thead><tr><th width="5%">#</th><th width="30%">Order Dari</th><th width="30%">Pemasang</th><th width="30%">Netto</th><th><span class="pull-right">Aksi</span></th></tr></thead>';
                tableData += '<tbody>';

                $.each(memberData, function (index, value) {
                    tableData += '<tr>';
                    tableData += '<td>'+no+'</td>';
                    tableData += '<td>'+value.orderFrom.name+'</td>';
                    tableData += '<td>'+value.customer.name+'</td>';
                    tableData += '<td>'+value.totalAmount+'</td>';
                    tableData += '<td>';
                    tableData += '<span class="pull-right" data-id="'+value.id+'">';
                    tableData += '<button class="detail-btn btn btn-default btn-xs btn-flat" title="DETAIL"><i class="fa fa-eye"></i></button>';
                    tableData += '<button class="delete-btn btn btn-default btn-xs btn-flat" title="DELETE"><i class="fa fa-times"></i></button>';
                    tableData += '</span>';
                    tableData += '</td>';
                    tableData += '</tr>';
                    no++;
                });

                tableData += '</tbody>';
                tableData += '<table>';
                tableData += '';

                searchArea  = '<div class="col-md-12">';
                searchArea += '<input type="text" id="searchList" class="form-control">';
                searchArea += '</div>';

                if (memberData.length < 1) {
                    tableData  = '<table class="table table-bordered table-responsive table-hover">';
                    tableData += '<thead><tr><th width="5%">#</th><th width="30%">Order Dari</th><th width="30%">Pemasang</th><th width="30%">Netto</th><th><span class="pull-right">Aksi</span></th></tr></thead>';
                    tableData += '<tbody>';
                    tableData += '<tr><td colspan="5" class="text-danger">TIDAK ADA DATA</td></tr>';
                    tableData += '</tbody>';
                    tableData += '<tbody>';

                    searchArea  = '<div class="col-md-10">';
                    searchArea += '<input type="text" readonly id="searchList" class="form-control">';
                    searchArea += '</div>';
                    searchArea += '<div class="col-md-2">';
                    searchArea += '<button class="btn btn-danger btn-flat btn-block" id="newOrder">ADD</button>';
                    searchArea += '</div>';
                }

            } else {
                tableData  = '<table class="table table-bordered table-responsive table-hover">';
                tableData += '<thead><tr><th width="5%">#</th><th width="30%">Order Dari</th><th width="30%">Pemasang</th><th width="30%">Netto</th><th><span class="pull-right">Aksi</span></th></tr></thead>';
                tableData += '<tbody>';
                tableData += '<tr><td colspan="5" class="text-danger">ERROR KETIKA MENGAMBIL DATA</td></tr>';
                tableData += '</tbody>';
                tableData += '<tbody>';

                searchArea  = '<div class="col-md-10">';
                searchArea += '<input type="text" readonly id="searchList" class="form-control">';
                searchArea += '</div>';
                searchArea += '<div class="col-md-2">';
                searchArea += '<button class="btn btn-danger btn-flat btn-block" id="newOrder">ADD</button>';
                searchArea += '</div>';
            }

            $('#dataList').html(tableData);
            $('#searchArea').html(searchArea);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            tableData  = '<table class="table table-bordered table-responsive table-hover">';
            tableData += '<thead><tr><th width="5%">#</th><th width="30%">Order Dari</th><th width="30%">Pemasang</th><th width="30%">Netto</th><th><span class="pull-right">Aksi</span></th></tr></thead>';
            tableData += '<tbody>';
            tableData += '<tr><td colspan="5" class="text-danger">ERROR KETIKA MENGAMBIL DATA</td></tr>';
            tableData += '</tbody>';
            tableData += '<tbody>';

            searchArea  = '<div class="col-md-10">';
            searchArea += '<input type="text" readonly id="searchList" class="form-control">';
            searchArea += '</div>';
            searchArea += '<div class="col-md-2">';
            searchArea += '<button class="btn btn-danger btn-flat btn-block" id="newOrder">ADD</button>';
            searchArea += '</div>';

            $('#dataList').html(tableData);
            $('#searchArea').html(searchArea);
        }
    });
}

getOrders();

$(document).on('click', '#newOrder', function () {
    window.location.href = '/advertising/orders/new';
});