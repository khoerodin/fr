function getOrders(param, selected) {
    var selected = selected;
    var tableData = '';
    $.ajax({
        url: '/api',
        type: 'POST',
        data: {
            module: 'advertising/orders',
            method: 'get',
            params: [
                {
                    orderTag: param,
                    order: {
                        orderNumber: 'ASC'
                    }
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
                tableData += '<th>Judul</th>';
                tableData += '<th>Faktur</th>';
                tableData += '<th width="3%"><span class="pull-right">Aksi</span></th></tr></thead>';
                tableData += '<tbody>';

                $.each(memberData, function (index, value) {

                    tableData += '<tr>';
                    tableData += '<td>'+no+'</td>';
                    tableData += '<td>'+value.orderNumber+'</td>';
                    tableData += '<td>'+value.title+'</td>';
                    tableData += '<td><label class="label label-success">faktur</label></td>';

                    tableData += '<td>';
                    tableData += '<span class="pull-right" data-id="'+value.id+'">';
                    tableData += '<button class="detail-btn btn btn-default btn-xs btn-flat" title="GENERATE INVOICES"><i class="fa fa-file-text-o"></i></button>';
                    tableData += '</span>';
                    tableData += '</td>';
                    tableData += '</tr>';
                    no++;
                });

                tableData += '</tbody>';
                tableData += '<table>';
                tableData += '';

                searchArea  = '<div class="col-md-12 search-area">';
                searchArea += '<select class="form-control" id="searchInvoices"></select>';
                searchArea += '</div>';

                if (memberData.length < 1) {
                    tableData  = 'NO DATA';
                }

            } else {
                tableData  = 'ERROR';
            }

            $('#dataList').html(tableData);

            if(selected) {
                $("#searchOrder").html('<option '+selected[0].id+'>'+selected[0].text+'</option>');
            }

            $("#searchOrder").select2({
                theme: "bootstrap",
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

                if (text.endsWith('Tag')) {
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

                            if (text.endsWith('Tag')) {
                                var selected = [{id:id, text:text}];
                                getOrders(id, selected);
                                $("#searchOrder").select2('close');
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