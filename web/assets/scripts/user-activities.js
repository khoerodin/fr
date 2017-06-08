// get detail of data before edit
function detailUserActivities(id) {
    var data = {
        module : 'user-activities/'+id,
        method: 'get',
        params: {}
    };

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {
            jQuery('div .has-error').removeClass('has-error');
            jQuery('p.help-block').remove();
        },
        success: function (data, textStatus, jqXHR) {
            data = JSON.parse(data);

            var tableRequest = '';
            $.each(data.requestData, function (index, value) {
                if(jQuery.isEmptyObject(value) === false) {
                    tableRequest += '<table class="table table-striped table-bordered table-responsive">';
                    tableRequest += '<thead><tr><th colspan="2" class="text-muted">' + index + '</th></tr></thead>';
                    tableRequest += '<tbody>';
                    $.each(value, function (i, v) {
                        tableRequest += '<tr>';
                        tableRequest += '<td width="15%">' + i + '</td>';
                        tableRequest += '<td>' + v + '</td>';
                        tableRequest += '<tr>';
                    });
                    tableRequest += '</tbody></table>';
                }
            });
            $('#request').html(tableRequest);

            var tableSource = '<table class="table table-striped table-bordered table-responsive">';
            tableSource += '<thead><tr><th class="text-muted">Tables</th></tr></thead>';
            tableSource += '<tbody>';
            $.each(data.sourceTable, function (index, value) {
                tableSource += '</tr><td>' + value + '</td><tr>';
            });
            tableSource += '</tbody></table>';
            $('#source').html(tableSource);

            var tableIdentifier = '<table class="table table-striped table-bordered table-responsive">';
            tableIdentifier += '<thead><tr><th class="text-muted">Identifier</th></tr></thead>';
            tableIdentifier += '<tbody>';
            $.each(data.identifier, function (index, value) {
                tableIdentifier += '</tr><td>' + value + '</td><tr>';
            });
            tableIdentifier += '</tbody></table>';
            $('#identifier').html(tableIdentifier);

            $('#changed-table').text('TABLE: '+data.dataChanges.table);

            var tableChanges = '';
            $.each(data.dataChanges.changes, function (index, value) {
                tableChanges += '<table class="table table-striped table-bordered table-responsive">';
                tableChanges += '<tr><td colspan="2" style="font-weight: bold;" class="text-muted">'+index+'</td></tr>';
                tableChanges += '<tr><td width="30%">BEFORE</td><td>AFTER</td></tr>';
                tableChanges += '<tr>';
                $.each(value, function (i, v) {
                    tableChanges += '<td>' + v + '</td>';
                });
                tableChanges += '</tr></table>';
            });
            $('#data-changed').html(tableChanges);

            $('#clientName').val(data.clientName);
            $('#username').val(data.username);
            $('#path').val(data.path);
            $('#requestMethod').val(data.requestMethod);
            $('#remark').val(data.remark);
            $('#responseContent').text(data.responseContent);
            console.log(data.responseContent);

            $('input, select').removeClass('loading').attr('placeholder', '');
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}