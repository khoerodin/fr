(function (Bisnis) {
    Bisnis.SimpleGrid = {};

    Bisnis.SimpleGrid.fetch = function (pageParams, pageNum, hasResultCallback, selectedSearchCallback, openSearchCallback, closeSearchCallback) {
        var module = pageParams.module;
        var elm = pageParams.elm;
        var columns = pageParams.columns;
        var search = pageParams.search;

        var pageNum = (typeof pageNum === 'undefined' || typeof pageNum === null || typeof pageNum === '') ? 1 : pageNum;
        var params = [];
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
                'columns': columns,
                'search': search
            };

            renderGrid(gridParams, pageNum);

            if ('undefined' !== typeof viewData['hydra:last']) {

                var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                Bisnis.Util.Grid.createPagination(elm + 'Pagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);

            }

            Bisnis.Util.Event.bind('click', elm+'Pagination li span', function () {
                var $this = this;
                var pageNum = parseInt(Bisnis.Util.Document.getDataValue($this, 'page'));
                Bisnis.SimpleGrid.fetch(pageParams, pageNum);
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

                var id = elm.replace('#', '').replace('.', '') + 'AddBtn';

                if (data === false) {
                    document.getElementById(id).removeAttribute("disabled");
                } else {
                    document.getElementById(id).setAttribute("disabled", "disabled");
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
                    var id = elm.replace('#', '').replace('.', '') + 'AddBtn';
                    document.getElementById(id).setAttribute("disabled", "disabled");
                }

            }, function (data) {
                // close search input callback
                if (Bisnis.validCallback(closeSearchCallback)) {
                    closeSearchCallback(data);
                }

                if (data) {
                    var id = elm.replace('#', '').replace('.', '') + 'AddBtn';
                    document.getElementById(id).setAttribute("disabled", "disabled");
                }
            });

        }, function () {

        });
    };

    var renderGrid = function (gridParams, pageNum) {

        var memberData = gridParams.memberData;
        var elm = gridParams.elm;
        var columns = gridParams.columns;
        var search = gridParams.search;

        var row = '';
        Bisnis.each(function (idx, value) {
            var rowParams = {
                'idx': idx,
                'value': value,
                'row': row,
                'columns': columns
            }

            row = renderRows(rowParams, pageNum);
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

            var width = 'undefined' !== typeof value.width ? 'width="' + value.width + '"' : '';

            headers = headers + '<th '+width+'>'+value.header+'</th>';
        }, columns);

        return headers;
    };

    var renderColumns = function (value, columns) {

        var cols = '';
        var columnValue;
        Bisnis.each(function (idx, val) {

            var type = val.type;
            var custom = val.custom;
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



            if ( custom ) {

                // https://stackoverflow.com/questions/5334380/replacing-text-inside-of-curley-braces-javascript

                var customVal = val.custom;
                var replaceArray = [];
                var replaceWith = [];
                var hasBraces = val.custom.match(/{{\s*[\w\.]+\s*}}/g);

                if (hasBraces) {
                    hasBraces.map(function(x) {
                            var bracketStr = x.match(/[\w\.]+/)[0];
                            replaceArray.push(bracketStr);
                            replaceWith.push(value[bracketStr]);
                        });

                    for(var i = 0; i < replaceArray.length; i++) {
                        var customValStr = customVal.replace(new RegExp('{{ ' + replaceArray[i] + ' }}', 'gi'), replaceWith[i]);
                    }

                    cols = cols + '<td>' + customValStr + '</td>';
                } else {
                    cols = cols + '<td>' + customVal + '</td>';
                }

            } else {
                cols = cols + columnValue;
            }
        }, columns);

        return cols;
    };

    var renderRows = function (rowParams, pageNum) {

        var idx = rowParams.idx;
        var value = rowParams.value;
        var row = rowParams.row;
        var columns = rowParams.columns;

        var currentSeq;
        if (pageNum) {
            currentSeq = ( pageNum - 1 ) * 17 + idx +1;
        } else {
            currentSeq = ( 1 - 1 ) * 17 + idx +1;
        }

        row = row + '<tr id="' + value.id + '">';
        row = row + '<td>' + currentSeq + '</td>';
        row = row + renderColumns(value, columns);
        row = row + '</tr>';

        return row;
    };

})(window.Bisnis || {});