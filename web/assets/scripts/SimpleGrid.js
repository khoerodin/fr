(function (Bisnis) {
    Bisnis.Advertising.Coba = {};

    Bisnis.Advertising.Coba.fetch = function (pageParams, pageNum, hasResultCallback, selectedSearchCallback, openSearchCallback, closeSearchCallback) {
        var module = pageParams.module;
        var elm = pageParams.elm;
        var buttons = pageParams.buttons;
        var columns = pageParams.columns;
        var search = pageParams.search;

        var params = [];
        var pageNum = (null !== pageNum && undefined !== typeof pageNum && '' !== pageNum) ? 1 : pageNum;
        params.push({
            page: pageNum
        });

        Bisnis.request({
            module: module,
            method: 'get',
            params: params
        }, function (response) {
            var rawData = JSON.parse(response);
            var memberData = rawData['hydra:member'];
            var viewData = rawData['hydra:view'];

            var gridParams = {
                'memberData': memberData,
                'elm': elm,
                'buttons': buttons,
                'columns': columns,
                'search': search
            };

            renderGrid(gridParams);

            if ('undefined' !== typeof viewData['hydra:last']) {

                var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                Bisnis.Util.Grid.createPagination(elm + 'Pagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);

            }

            Bisnis.Util.Event.bind('click', elm+'Pagination li span', function () {
                var $this = this;
                var pageNum = parseInt(Bisnis.Util.Document.getDataValue($this, 'page'));
                Bisnis.Util.Url.changeUrlParam('page', pageNum);
                Bisnis.Advertising.Coba.fetch(pageParams, pageNum);
            });

            Bisnis.Util.Style.ajaxSelect(elm+'Search', {
                placeholder: search.placeholder,
                allowClear: false,
                url: '/api/searchGrid',
                module: module,
                field: 'value',
                fields: search.fields,
                minimumInputLength: 2,
            }, function (data) {
                // is has result callback
                if (Bisnis.validCallback(hasResultCallback)) {
                    hasResultCallback(data);
                }

                if (data === false) {
                    document.getElementById('aeGridAddBtn').removeAttribute("disabled");
                } else {
                    document.getElementById('aeGridAddBtn').setAttribute("disabled", "disabled");
                }

            }, function (data) {
                // selected data callback
                if (Bisnis.validCallback(selectedSearchCallback)) {
                    selectedSearchCallback(data);
                }
            }, function (data) {
                // open search input callback
                if (Bisnis.validCallback(openSearchCallback)) {
                    openSearchCallback(data);
                }

                if (data) {
                    document.getElementById('aeGridAddBtn').setAttribute("disabled", "disabled");
                }
            }, function (data) {
                // close search input callback
                if (Bisnis.validCallback(closeSearchCallback)) {
                    closeSearchCallback(data);
                }

                if (data) {
                    document.getElementById('aeGridAddBtn').setAttribute("disabled", "disabled");
                }
            });

        }, function () {

        });
    };

    var renderGrid = function (gridParams) {

        var memberData = gridParams.memberData;
        var elm = gridParams.elm;
        var buttons = gridParams.buttons;
        var columns = gridParams.columns;
        var search = gridParams.search;

        var row = '';
        Bisnis.each(function (idx, value) {
            var rowParams = {
                'idx': idx,
                'value': value,
                'row': row,
                'buttons': buttons,
                'columns': columns
            }

            row = renderRows(rowParams);
        }, memberData);

        var grid = '<div class="box">';
        grid = grid + '<div class="box-header row" style="margin-bottom: 5px;">';
        grid = grid + '<div class="col-md-10"><select id="'+elm.replace('#', '').replace('.', '')+'Search" class="form-control" placeholder="'+search.placeholder+'"></select></div>';
        grid = grid + '<div class="col-md-2"><button id="'+elm.replace('#', '').replace('.', '')+'AddBtn" title="Silakan melakukan pencarian terlebih dahulu" disabled class="btn btn-flat btn-danger btn-block">TAMBAH BARU</button></div>';
        grid = grid + '</div>';
        grid = grid + '<div class="box-body">';
        grid = grid + renderTable(row, columns);
        grid = grid + '</div>';
        grid = grid + '<div class="box-footer">';
        grid = grid + '<ul id="'+elm.replace('#', '').replace('.', '')+'Pagination" class="pagination pagination-sm pull-right"></ul>';
        grid = grid + '</div>';
        grid = grid + '</div>';

        if ('' === row) {
            Bisnis.Util.Document.putHtml(elm, 'no data');
        } else {
            Bisnis.Util.Document.putHtml(elm, grid);
        }
    };

    var renderTable = function (row, columns) {
        var grid = '';
        grid = grid + '<table class="table table-striped table-bordered table-hover">';
        grid = grid + '<thead>';
        grid = grid + '<tr>';
        grid = grid + '<th width="3%">NO</th>';
        grid = grid + renderRowHeader(columns);
        grid = grid + '<th width="5%" class="text-right">AKSI</th>';
        grid = grid + '</tr>';
        grid = grid + '</thead>';
        grid = grid + '<tbody>';
        grid = grid + row;
        grid = grid + '</tbody>';
        grid = grid + '</table>';

        return grid;
    };

    var renderRowHeader = function (columns) {
        var headers = '';
        Bisnis.each(function (idx, value) {
            headers = headers + '<th>'+value.header+'</th>';
        }, columns);

        return headers;
    };

    var renderButtons = function (buttons) {
        var btns = '';
        Bisnis.each(function (idx, value) {
            btns = btns + '<button class="'+value.btnClass+'">'+value.btnContent+'</button>';
        }, buttons);

        return btns;
    };

    var renderColumns = function (value, columns) {

        var cols = '';
        var columnValue;
        Bisnis.each(function (idx, val) {

            var type = val.type;
            switch(type) {
                case 'text':
                    columnValue = '<td>' + value[val.field] + '</td>';
                    break;
                case 'checkbox':
                    if (true === value[val.name]) {
                        columnValue = '<td><input type="checkbox" name="'+value[val.field]+'" checked="checked"></td>';
                    } else {
                        columnValue = '<td><input type="checkbox" name="'+value[val.field]+'" checked="checked"></td>';
                    }
                    break;
                default:
                    columnValue = '<td>' + value[val.field] + '</td>';
            }

            cols = cols + columnValue;
        }, columns);

        return cols;
    };

    var renderRows = function (rowParams) {

        var idx = rowParams.idx;
        var value = rowParams.value;
        var row = rowParams.row;
        var buttons = rowParams.buttons;
        var columns = rowParams.columns;

        var currentPage = Bisnis.Util.Url.getQueryVariable('page');
        var currentSeq;
        if (currentPage) {
            currentSeq = ( currentPage - 1 ) * 17 + idx +1;
        } else {
            currentSeq = ( 1 - 1 ) * 17 + idx +1;
        }

        row = row + '<tr id="' + value.id + '">';
        row = row + '<td>' + currentSeq + '</td>';
        row = row + renderColumns(value, columns);
        row = row + '<td><span class="pull-right">';
        row = row + renderButtons(buttons);
        row = row + '</span></td>';
        row = row + '</tr>';

        return row;
    };

})(window.Bisnis || {});