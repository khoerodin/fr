(function (Bisnis) {
    Bisnis.Advertising.Coba = {};

    Bisnis.Advertising.Coba.fetch = function (pageParams) {
        var module = pageParams.module;
        var bodyElm = pageParams.bodyElm;
        var pagingElm = pageParams.pagingElem;
        var buttons = pageParams.rowButtons;

        Bisnis.request({
            module: module,
            method: 'get',
            params: Bisnis.getQueryVariable()
        }, function (response) {
            var rawData = JSON.parse(response);
            var memberData = rawData['hydra:member'];
            var viewData = rawData['hydra:view'];

            if ('undefined' !== typeof viewData['hydra:last']) {
                var currentPage = Bisnis.getQueryParam('page', viewData['@id']);
                Bisnis.Util.Grid.createPagination(pagingElm, Bisnis.getQueryParam('page', viewData['hydra:last']), currentPage);
            }

            renderGrid(memberData, bodyElm);
        }, function () {
            console.log('KO');
        });
    };

    var renderGrid = function (memberData, bodyElm) {

        var row = '';
        Bisnis.each(function (idx, value) {
            row = renderRows(idx, value, row);
        }, memberData);

        if ('' === row) {
            Bisnis.Util.Document.putHtml(bodyElm, '<tr><td colspan="5">Belum ada data</td></tr>');
        } else {
            Bisnis.Util.Document.putHtml(bodyElm, row);
        }
    };

    var renderButtons = function (buttons) {
        var btns = '';
        Bisnis.each(function (idx, value) {
            btns = '<button data-btn="'+value+'" class="btn btn-xs btn-default btn-flat">'+value.toUpperCase()+'</button>';
        }, buttons);

        return btns;
    }

    var renderRows = function (idx, value, row) {

        var currentPage = Bisnis.getQueryVariable('page');
        var currentSeq;
        if (currentPage) {
            currentSeq = ( currentPage - 1 ) * 17 + idx +1;
        } else {
            currentSeq = ( 1 - 1 ) * 17 + idx +1;
        }

        var buttons;

        row = row + '<tr class="' + value.id + '">';
        row = row + '<td>' + currentSeq + '</td>';
        row = row + '<td>' + value.name + '</td>';
        row = row + '<td>';
        row = row + renderButtons();
        row = row + '</td>';
        row = row + '</tr>';

        return row;
    };


})(window.Bisnis || {});

Bisnis.init(function () {

    var pageParams = {
        'module': 'advertising/account-executives',
        'bodyElm': '#cobaGrid',
        'pagingElem': '#cobaPagination',
        'rowButtons': ['detail', 'delete']
    }

    Bisnis.Advertising.Coba.fetch(pageParams);

    Bisnis.Util.Event.bind('click', pageParams.pagingElem + ' li span', function () {
        var $this = this;
        var pageNum = parseInt(Bisnis.Util.Document.getDataValue($this, 'page'));
        Bisnis.changeUrlParam('page', pageNum);
        Bisnis.Advertising.Coba.fetch(pageParams);
    });
});
