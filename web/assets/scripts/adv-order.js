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
                tableData += '<thead><tr><th width="5%">#</th><th width="10%">NOMOR ORDER</th>';
                tableData += '<th width="15%">Judul</th>';
                tableData += '<th width="25%">Order Dari</th><th width="25%">Pemasang</th>';
                tableData += '<th><span class="pull-right">Aksi</span></th></tr></thead>';
                tableData += '<tbody>';

                $.each(memberData, function (index, value) {
                    tableData += '<tr>';
                    tableData += '<td>'+no+'</td>';
                    tableData += '<td>'+value.orderNumber+'</td>';
                    tableData += '<td>'+value.title+'</td>';
                    tableData += '<td>'+value.orderFrom.name+'</td>';
                    tableData += '<td>'+value.customer.name+'</td>';
                    tableData += '<td>';
                    tableData += '<span class="pull-right" data-id="'+value.id+'">';
                    tableData += '<button class="detail-btn btn btn-default btn-xs btn-flat" title="DETAIL"><i class="fa fa-eye"></i></button>';
                    // tableData += '<button class="delete-btn btn btn-default btn-xs btn-flat" title="DELETE"><i class="fa fa-times"></i></button>';
                    tableData += '</span>';
                    tableData += '</td>';
                    tableData += '</tr>';
                    no++;
                });

                tableData += '</tbody>';
                tableData += '<table>';
                tableData += '';

                searchArea  = '<div class="col-md-12 search-area">';
                searchArea += '<select class="form-control" id="searchOrder"></select>';
                searchArea += '</div>';

                searchArea += '<div id="searchOrderBtnArea" class="button-area transition">';
                searchArea += '<a id="addOrder" href="/advertising/orders/new"style="visibility: hidden;" class="add-btn h btn btn-flat btn-block btn-danger">Add</a>';
                searchArea += '</div>';

                if (memberData.length < 1) {
                    tableData  = '<table class="table table-bordered table-responsive table-hover">';
                    tableData += '<thead><tr><th width="5%">#</th><th width="10%">NOMOR ORDER</th>';
                    tableData += '<th width="15%">Judul</th>';
                    tableData += '<th width="25%">Order Dari</th><th width="25%">Pemasang</th>';
                    tableData += '<th><span class="pull-right">Aksi</span></th></tr></thead>';
                    tableData += '<tbody>';

                    tableData += '<tr><td colspan="5" class="text-danger">TIDAK ADA DATA</td></tr>';
                    tableData += '</tbody>';
                    tableData += '<tbody>';

                    searchArea  = '<div class="col-md-12 search-area">';
                    searchArea += '<select class="form-control" id="searchOrder"></select>';
                    searchArea += '</div>';

                    searchArea += '<div id="searchOrderBtnArea" class="button-area transition">';
                    searchArea += '<a id="addOrder" href="/advertising/orders/new" style="visibility: hidden;" class="add-btn h btn btn-flat btn-block btn-danger">Add</a>';
                    searchArea += '</div>';
                }

            } else {
                tableData  = '<table class="table table-bordered table-responsive table-hover">';
                tableData += '<thead><tr><th width="5%">#</th><th width="10%">NOMOR ORDER</th>';
                tableData += '<th width="15%">Judul</th>';
                tableData += '<th width="25%">Order Dari</th><th width="25%">Pemasang</th>';
                tableData += '<th><span class="pull-right">Aksi</span></th></tr></thead>';
                tableData += '<tbody>';

                tableData += '<tr><td colspan="5" class="text-danger">ERROR KETIKA MENGAMBIL DATA</td></tr>';
                tableData += '</tbody>';
                tableData += '<tbody>';

                searchArea  = '<div class="col-md-12 search-area">';
                searchArea += '<select class="form-control" id="searchOrder"></select>';
                searchArea += '</div>';

                searchArea += '<div id="searchOrderBtnArea" class="button-area transition">';
                searchArea += '<a id="addOrder" href="/advertising/orders/new" style="visibility: hidden;" class="add-btn h btn btn-flat btn-block btn-danger">Add</a>';
                searchArea += '</div>';
            }

            $('#dataList').html(tableData);
            $('#searchArea').html(searchArea);

            $("#searchOrder").select2({
                theme: "bootstrap",
                allowClear: true,
                placeholder: "CARI NOMOR ORDER",
                ajax: {
                    url: "/api/search",
                    dataType: 'json',
                    type: 'POST',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term,
                            page: params.page,
                            module: 'advertising/orders',
                            method: 'GET',
                            field: 'orderNumber'.split('#')
                        };
                    },
                    processResults: function (data) {
                        if(data.length > 0) {
                            return {
                                results: $.map(data, function(obj) {
                                    return { id: obj.id, text: obj['orderNumber'.split('#')[0]] };
                                })
                            }
                        } else {

                            var elms = $('.search-area').removeClass('col-md-12').addClass('col-md-10');
                            elms += $('.button-area').addClass('col-md-2');
                            elms += $('#addOrder').css('visibility', 'visible');

                            return {
                                results: elms
                            }
                        }

                    },
                    cache: true,
                },
                escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
                minimumInputLength: 2,
            }).on("select2:select", function () {
                var id = $("#searchOrder").val();
                window.location.href = '/advertising/orders/'+id;
            }).on("select2:unselect", function () {
                //
            }).on("select2:open", function () {
                //
            }).on("select2:closing", function () {
                //
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            tableData  = '<table class="table table-bordered table-responsive table-hover">';
            tableData += '<thead><tr><th width="5%">#</th><th width="25%">Judul</th>';
            tableData += '<th width="25%">Order Dari</th><th width="25%">Pemasang</th>';
            tableData += '<th><span class="pull-right">Aksi</span></th></tr></thead>';
            tableData += '<tbody>';

            tableData += '<tr><td colspan="5" class="text-danger">ERROR KETIKA MENGAMBIL DATA</td></tr>';
            tableData += '</tbody>';
            tableData += '<tbody>';

            searchArea  = '<div class="col-md-10">';
            searchArea += '<input type="text" readonly id="searchList"  placeholder="CARI..." class="form-control">';
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

$(document).on('click', '.detail-btn', function () {
    var href = $(this).closest('span').data('id');
    window.location.href = '/advertising/orders/' + href;
});

$(document).on('keyup', '.select2-search__field', function (e) {
    if (e.which === 13) {
        window.location.href = '/advertising/orders/new';
        return false;
    }
});