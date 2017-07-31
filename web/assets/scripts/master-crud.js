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

function createForm(formType, attributes) {
    var attr = '';
    var inputValue = '';
    var otherAttr = '';
    var value = '';
    var choices = [];
    if (attributes instanceof Object) {
        $.each(attributes, function (index, value) {
            if (value instanceof Object) {
                choices['value'] = value;
            } else {
                if (index === 'value') {
                    inputValue = value;
                } else {
                    otherAttr += index + '="' + value + '" ';
                }
            }
        });
        attr = otherAttr;
        value = inputValue;
    }

    var form = '';
    switch (formType) {
        case 'inputText':
            form = '<input type="text" '+attr+' value="'+value+'">';
            break;

        case 'textArea':
            form = '<textarea '+attr+'>'+value+'</textarea>';
            break;

        case 'select':
            form += '<select '+attr+'>';
            console.log(choices);
            $.each(choices, function (cIndex, cValue) {
                form += '<option value="'+cValue+'">'+cIndex+'</option>';
            });
            form += '</select>';
            break;

        default:
            form = '';
    }
    return form;
}

console.log(createForm('select', {class: 'bismillah a', options: {aaa: 'aaa', bbb: 'bbb'}, value: 'halooo'}));

function getDescendantProp (obj, desc) {
    var arr = desc.split('.');
    while (arr.length && (obj = obj[arr.shift()]));
    return obj;
}

function getGrid(element, settings) {
    var $this = element;
    var gridName = settings.gridName;
    var module = settings.module;
    var gridTable = settings.gridTable;

    var data = {
        module : module,
        method: 'get',
        params: getQueryVariable()
    };

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        success: function (successData) {
            var successData = JSON.parse(successData);
            var memberData = successData['hydra:member'];
            var totalData = successData['hydra:totalItems'];
            var pagingData = successData['hydra:view'];

            var table = '<table class="table table-striped table-bordered table-hover">';
            table += '<thead>';
            table += '<tr>';
            table += '<th width="3%">#</th>';

            $.each(gridTable, function (index, value) {
                var header = value.header;
                var field = value.field;
                if (value.width !== undefined) {
                    var columnWidth = 'width="'+value.width+'"';
                } else {
                    var columnWidth = '';
                }
                table += '<th '+columnWidth+'>' + header + '</th>';
            });

            page = getQueryVariable('page');
            table += '<th width="5%"><span class="pull-right">ACTION</span></th>';
            table += '</tr>';
            table += '</thead>';
            table += '<tbody sc-id="'+module+'">';
            page = getQueryVariable('page');
            $.each(memberData, function (mIndex, mValue) {
                if (page > 1) {
                    c = page - 1;
                    p = 17 * c;
                    no = mIndex + 1 + p;
                } else {
                    no = mIndex + 1;
                }

                no = no;
                table += '<tr id="'+mValue['id']+'">';
                table += '<td>'+no+'</td>';

                $.each(gridTable, function (fIndex, fValue) {

                    table += '<td>'+getDescendantProp(mValue, fValue.field)+'</td>';

                });

                table += '<td><span class="pull-right">';
                table += '<button class="detail-btn btn btn-default btn-xs btn-flat" title="DETAIL"><i class="fa fa-eye"></i></button>';
                table += '<button class="delete-nn btn btn-default btn-xs btn-flat" title="DELETE"><i class="fa fa-times"></i></button>';
                table += '</span></td>';

                table += '</tr>';
            });

            table += '</tbody>';
            table += '</table>';

            var modal  = '<div data-modal="'+module+'DetailModal" class="modal" role="dialog">';
            modal += '  <div class="modal-dialog modal-lg">';
            modal += '      <div class="modal-content">';
            modal += '          <div class="modal-header">';
            modal += '              <button type="button" class="close" data-dismiss="modal">&times;</button>';
            modal += '              <h4 class="modal-title">Detail '+gridName+'</h4>';
            modal += '          </div>';
            modal += '          <div class="modal-body">';
            modal += '          <input type="hidden" name="id">';
            modal += '          <div>';
            modal += '          <div class="modal-footer">';
            modal += '              <button type="button" class="btn btn-flat btn-default" data-dismiss="modal">Close</button>';
            modal += '              <button type="button" class="btn btn-flat btn-danger">Close</button>';
            modal += '          <div>';
            modal += '       </div>';
            modal += '   </div>';
            modal += '</div>';

            $this.html(table+modal);
            getDetail(module);
        }
    });
}

function getDetail(module) {
    $(document).on('click', 'tbody[sc-id="'+module+'"] .detail-btn', function () {
        var id = $(this).closest('tr').attr('id');
        $('div[data-modal="'+module+'DetailModal"] input').val('').addClass('loading').prop('readonly', true).attr('placeholder','Loading...');
        $('div[data-modal="'+module+'DetailModal"] input[type="checkbox"]').prop('checkbox', false).prop('disabled', true);
        $('div[data-modal="'+module+'DetailModal"] input[name="id"]').val(id);



        $('div[data-modal="'+module+'DetailModal"]').modal({show: true, backdrop: 'static'});
    });
}

(function($) {

    $.fn.simpleCrud = function(options) {

        var settings = $.extend({
            gridName     : null,
            module       : null,
            gridTable    : null,
            detailForm   : null
        }, options);
        getGrid($(this), settings);

    }

}(jQuery));