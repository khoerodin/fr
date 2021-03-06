(function (Bisnis) {
    Bisnis.Util.Grid = {};

    var gridRecords = function (configs) {
        var normalize = [];

        Bisnis.each(function (index, value) {
            if (value.hasOwnProperty('value')) {
                if (value.hasOwnProperty('format')) {
                    normalize.push({
                        'value': value.value,
                        'format': value.format
                    });
                } else {
                    normalize.push({
                        'value': value.value,
                        'format': function (value) {
                            return value;
                        }
                    });
                }
            }
        }, configs);

        return normalize;
    };

    var columnRenderer = function (columns) {
        var columnHtml = '';
        Bisnis.each(function (idx, row) {
            columnHtml = columnHtml + '<td>' + row.format(row.value) + '</td>';
        }, columns);

        return columnHtml;
    };

    /**
     * [[{value: 4, format: function (value) {return value * 2;}}, {value: 7}, {value: 9}], [{value: 4, format: function (value) {return value * 2;}}, {value: 17}, {value: 99}]]
     */
    Bisnis.Util.Grid.renderRecords = function (selector, records, pageNum, rowFormatting) {
        Bisnis.each(function (idx, row) {
            records[idx] = gridRecords(row);
        }, records);

        var rowTable = '';
        Bisnis.each(function (idx, row) {
            var currentSeq = '';
            if (pageNum && pageNum !== 'noPaging') {
                currentSeq = ( pageNum - 1 ) * 17 + idx +1;
            } else if (pageNum === 'noPaging') {
                currentSeq = idx +1;
            } else {
                currentSeq = ( 1 - 1 ) * 17 + idx +1;
            }

            if (Bisnis.validCallback(rowFormatting)) {
                rowTable = rowFormatting(rowTable, row);
            } else {
                rowTable = rowTable + '<tr data-idx="' + idx + '">';
            }

            rowTable = rowTable + '<td>' + currentSeq + '</td>';
            rowTable = rowTable + columnRenderer(row);
            rowTable = rowTable + '</tr>';
        }, records);

        Bisnis.Util.Document.putHtml(selector, rowTable);
    };

    Bisnis.Util.Grid.createPagination = function (selector, last, current) {
        var paging = '';
        var hasPrevious = false;
        var hasNext = false;
        var hasLast = true;

        current = parseInt(current);
        last = parseInt(last);
        if (current > 1) {
            hasPrevious = true;
        }

        if (current < last) {
            hasNext = true;
        }

        if (1 === last || current === last) {
            hasLast = false;
        }

        paging = paging + '<li><span class="pageFirst" data-page="1" title="Halaman Pertama">PERTAMA</span></li>';
        if (hasPrevious) {
            paging = paging + '<li><span class="pagePrevious" data-page="' + (current - 1) + '" title="Halaman Sebelumnya">SEBELUMNYA</span></li>';
        }

        if (hasNext) {
            paging = paging + '<li><span class="pageNext" data-page="' + (current + 1) + '" title="Halaman Selanjutnya">SELANJUTNYA</span></li>';
        }

        if (hasLast) {
            paging = paging + '<li><span class="pageLast" data-page="' + last + '" title="Halaman Terakhir">TERAKHIR</span></li>';
        }

        Bisnis.Util.Document.putHtml(selector, paging);
    };

    Bisnis.Util.Grid.removeErrorForm = function (formId) {
        document.getElementById(formId).classList.remove('has-error');

        let helpElm = document.getElementById(formId).getElementsByClassName('help-block');
        while (helpElm.length > 0) helpElm[0].remove();

        let errorElm = document.getElementById(formId).getElementsByClassName('has-error');
        while (errorElm.length > 0) errorElm[0].classList.remove('has-error');
    };

    Bisnis.Util.Grid.validate = function (formId, violations) {
        Bisnis.Util.Grid.removeErrorForm(formId);

        violations.map(function (value) {
            var property = document.getElementById(formId).querySelectorAll('[name='+value.propertyPath+']');
            var parent = property[0].parentNode;
            parent.classList.add('has-error');

            var p = document.createElement('p');
            var t = document.createTextNode(value.message);
            p.appendChild(t);
            p.className = 'help-block';

            parent.appendChild(p);
        });
        Bisnis.errorMessage('Ups, mohon lengkapi data Anda');
    };
})(window.Bisnis || {});