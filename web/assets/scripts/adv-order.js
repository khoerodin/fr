function getOrders(param, selected) {
    var selected = selected;
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/orders',
            method: 'get',
            params: [
                {
                    orderTag: param
                }
            ]
        },
        success: function (data, textStatus, jqXHR) {

            if (jqXHR.status == 200) {

                var memberData = JSON.parse(data)['hydra:member'];
                var no = 1;
                var searchArea;

                tableData  = '<table class="table table-bordered table-responsive table-hover">';
                tableData += '<thead><tr><th width="3%">#</th><th width="10%">NOMOR ORDER</th>';
                tableData += '<th width="25%">NOMOR SURAT ORDER</th>';
                tableData += '<th width="25%">Judul</th>';
                tableData += '<th width="15%">Order Dari</th><th width="15%">Pemasang</th>';
                tableData += '<th width="3%"><span class="pull-right">Aksi</span></th></tr></thead>';
                tableData += '<tbody>';

                $.each(memberData, function (index, value) {
                    tableData += '<tr>';
                    tableData += '<td>'+no+'</td>';
                    tableData += '<td>'+value.orderNumber+'</td>';
                    tableData += '<td>'+value.orderLetter+'</td>';
                    tableData += '<td>'+value.title+'</td>';

                    if (value.orderFrom) {
                        tableData += '<td>'+value.orderFrom.name+'</td>';
                    } else {
                        tableData += '<td>-</td>';
                    }

                    if (value.customer) {
                        tableData += '<td>'+value.customer.name+'</td>';
                    } else {
                        tableData += '<td>-</td>';
                    }

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

            if(selected) {
                $("#searchOrder").html('<option '+selected[0].id+'>'+selected[0].text+'</option>');
            }

            $("#searchOrder").select2({
                theme: "bootstrap",
                allowClear: true,
                placeholder: "CARI NOMOR ORDER / NOMOR SURAT ORDER / TAG ORDER",
                ajax: {
                    url: "/advertising/orders/search",
                    dataType: 'json',
                    type: 'POST',
                    delay: 250,
                    data: function (params) {
                        return {
                            q: params.term,
                            page: params.page
                        };
                    },
                    processResults: function (data) {
                        if(data.length > 0) {
                            return {
                                results: $.map(data, function(obj) {
                                    return { id: obj.id, text: obj['field'.split('#')[0]] };
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
                minimumInputLength: 2
            }).on("select2:select", function (e) {
                var id = $("#searchOrder").val();
                var text = $("#searchOrder option:selected").text();

                if("searchHistory" in localStorage){
                    var searchStorage = localStorage.getItem('searchHistory');
                    var searchHistory = JSON.parse(searchStorage);
                    searchHistory.push({id: id, text: text});

                    searchHistory = removeDuplicates(searchHistory);

                    if (searchHistory.length > 5) searchHistory.splice(0, searchHistory.length - 5);
                    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                } else {
                    var searchHistory = ( typeof searchHistory != 'undefined' && searchHistory instanceof Array ) ? searchHistory : [];
                    searchHistory.push({id: id, text: text});
                    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                }

                if (text.startsWith('TAG')) {
                    var selected = [{id:id, text:text}];
                    getOrders(id, selected);
                } else {
                    window.location.href = '/advertising/orders/'+id;
                }

            }).on("select2:open", function (e) {

                if("searchHistory" in localStorage){
                    var searchStorsge = localStorage.getItem('searchHistory');
                    var searchHistory = JSON.parse(searchStorsge).reverse();
                    var opt = '';
                    $.each(searchHistory, function (index, value) {
                        if (index === 0) {
                            var selected = 'selected';
                        }
                        opt += '<li class="optionHistory '+selected+' select2-results__option" data-id="'+value.id+'">'+value.text+'</li>';
                    });

                    setTimeout(function(){
                        $('.select2-results__options').html(opt);

                        $('.optionHistory').hover(
                            function () {
                                $(this).addClass('selected');
                            },

                            function () {
                                $(this).removeClass('selected');
                            },
                        );

                        $('.optionHistory').click(function (e) {
                            var id = $(this).data('id');
                            var text = $(this).text();

                            if("searchHistory" in localStorage){
                                var searchStorage = localStorage.getItem('searchHistory');
                                var searchHistory = JSON.parse(searchStorage);
                                searchHistory.push({id: id, text: text});

                                searchHistory = removeDuplicates(searchHistory);

                                if (searchHistory.length > 5) searchHistory.splice(0, searchHistory.length - 5);
                                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                            } else {
                                var searchHistory = ( typeof searchHistory != 'undefined' && searchHistory instanceof Array ) ? searchHistory : [];
                                searchHistory.push({id: id, text: text});
                                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                            }

                            if (text.startsWith('TAG')) {
                                var selected = [{id:id, text:text}];
                                getOrders(id, selected);
                                $("#searchOrder").select2("close");
                            } else {
                                window.location.href = '/advertising/orders/'+id;
                            }

                        });


                    }, 1);
                }

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

//localStorage.removeItem('searchHistory');

function removeDuplicates(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
        var key = JSON.stringify(el);
        var match = Boolean(hashTable[key]);

        return (match ? false : hashTable[key] = true);
    });
}

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