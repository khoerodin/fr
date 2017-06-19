simpleCrud();

//Store the reference to the original method:
var _serializeArray = $.fn.serializeArray;

//Now extend it with newer "unchecked checkbox" functionality:
$.fn.extend({
    serializeArray: function() {
        //Important: Get the results as you normally would...
        var results = _serializeArray.call(this);

        //Now, find all the checkboxes and append their "checked" state to the results.
        this.find('input[type=checkbox]').each(function(id, item) {
            var $item = $(item);
            results.push({name: $item.attr('name'), value: !!$item.is(":checked")});
        });
        return results;
    }
});

function getQueryVariable(variable, query = decodeURIComponent(window.location.search.substring(1)))
{
    var vars = query.split("&");
    if(typeof variable !== 'undefined') {
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
    } else {
        var keys = [];
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            keys.push({[pair[0]] : pair[1]});
        }
        return keys;
    }
    return(false);
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

function changeUrlParam (param, value) {
    var currentURL = window.location.href+'&';
    currentURL = currentURL.replace('#','');
    var change = new RegExp('('+param+')=(.*)&', 'g');
    var newURL = currentURL.replace(change, '$1='+value+'&');

    if (getURLParameter(param) !== null){
        try {
            window.history.replaceState('', '', newURL.slice(0, - 1) );
        } catch (e) {

        }
    } else {
        var currURL = window.location.href;
        if (currURL.indexOf("?") !== -1){
            window.history.replaceState('', '', currentURL.slice(0, - 1) + '&' + param + '=' + value);
        } else {
            window.history.replaceState('', '', currentURL.slice(0, - 1) + '?' + param + '=' + value);
        }
    }
}

function getAllElementsWithAttribute(attribute)
{
    var matchingElements = [];
    var allElements = document.getElementsByTagName('*');
    for (var i = 0, n = allElements.length; i < n; i++)
    {
        if (allElements[i].getAttribute(attribute) !== null)
        {
            // Element exists with attribute. Add to array.
            matchingElements.push(allElements[i]);
        }
    }
    return matchingElements;
}

function getGrid() {
    var elm = $(getAllElementsWithAttribute('sc-module'));
    $.each(elm, function (iE, vE) {

        var $this = $(vE);
        var module = $this.attr('sc-module').trim();
        var grid = $this.attr('sc-grid');
        var searchField = $this.attr('sc-search').trim();

        var gridColumns = grid.split(',');
        var data = {
            module : module,
            method: 'get',
            params: getQueryVariable()
        };

        $.ajax({
            url: "/api",
            type: "POST",
            data: data,
            beforeSend: function () {

            },
            success: function (successData) {
                var successData = JSON.parse(successData);
                var memberData = successData['hydra:member'];
                var totalData = successData['hydra:totalItems'];
                var pagingData = successData['hydra:view'];

                var gridTable = '<table class="table table-striped table-bordered table-hover">';
                gridTable += '<thead>';
                gridTable += '<tr>';
                gridTable += '<th width="3%">#</th>';

                $.each(gridColumns, function (indexColumn, valueColumn) {
                    var headColumn = valueColumn.split('#')[1];
                    if (headColumn.indexOf(".") != -1) {
                        columnName = headColumn.split('.')[0];
                        length = 'width="'+headColumn.split('.')[1]+'%"';
                    } else {
                        columnName = headColumn;
                        length = '';
                    }

                    gridTable += '<th '+length+'>' + columnName + '</th>';
                });

                page = getQueryVariable('page');
                gridTable += '<th width="7%"><span class="pull-right">ACTION</span></th>';
                gridTable += '</tr>';
                gridTable += '</thead>';
                gridTable += '<tbody sc-id="'+module+'">';
                $.each(memberData, function (index, value) {

                    if (page > 1) {
                        c = page - 1;
                        p = 17 * c;
                        no = index + 1 + p;
                    } else {
                        no = index + 1;
                    }

                    no = no;
                    gridTable += '<tr id="'+value['id']+'">';
                    gridTable += '<td>'+no+'</td>';
                    $.each(gridColumns, function (i, v) {
                        var columns = v.split('#')[0];
                        var column1 = columns.split(".")[0];
                        var column2 = columns.split(".")[1];

                        if(value[column1] instanceof Object) {
                            gridTable += '<td>'+value[column1][column2]+'</td>';
                        } else {
                            gridTable += '<td>'+value[column1]+'</td>';
                        }
                    });
                    gridTable += '<td><span class="pull-right">';
                    gridTable += '<button class="detail-btn btn btn-default btn-xs btn-flat" title="DETAIL"><i class="fa fa-eye"></i></button>';
                    gridTable += '<button class="delete-btn btn btn-default btn-xs btn-flat" title="DELETE"><i class="fa fa-times"></i></button>';
                    gridTable += '</span></td>';
                    gridTable += '</tr>';
                });
                gridTable += '</tbody>';

                var modal  = '<div id="'+module+'DetailModal" class="modal" role="dialog">';
                    modal += '  <div class="modal-dialog modal-lg">';
                    modal += '      <div class="modal-content">';
                    modal += '          <div class="modal-header">';
                    modal += '              <button type="button" class="close" data-dismiss="modal">&times;</button>';
                    modal += '              <h4 class="modal-title">Detail '+module+'</h4>';
                    modal += '          </div>';
                    modal += '          <div class="modal-body"><div>';
                    modal += '          <div class="modal-footer">';
                    modal += '              <button type="button" class="btn btn-flat btn-default" data-dismiss="modal">Close</button>';
                    modal += '              <button type="button" class="btn btn-flat btn-danger">Close</button>';
                    modal += '          <div>';
                    modal += '       </div>';
                    modal += '   </div>';
                    modal += '</div>';

                $this.html(gridTable+modal);
                getDetail(module);

            }
        });

    });
}

function getDetail(module) {
    $(document).on('click', 'tbody[sc-id="'+module+'"] .detail-btn', function () {
        var id = $(this).closest('tr').attr('data-id');
        jQuery('div#'+module+'DetailModal input').val('').addClass('loading').prop('readonly', true).attr('placeholder','Loading...');
        jQuery('div#'+module+'DetailModal input[type="checkbox"]').prop('checkbox', false).prop('disabled', true);
        jQuery('div#'+module+'DetailModal').modal({show: true, backdrop: 'static'});
    });
}

function simpleCrud(){
    getGrid();
}