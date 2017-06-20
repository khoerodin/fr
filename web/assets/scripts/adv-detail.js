$(document).on('click', 'tbody[data-list="advertising/specifications"] .detail-adv', function () {
    var advSpecId = $(this).data('id');
    getAdvDetail(advSpecId);
    $('#detail-jenis tbody').html('')
    $('div#detail-jenis').modal({show: true, backdrop: 'static'});
});

$(document).on('ajaxComplete', function () {
    $('#detail-jenis tbody .detail-btn').click(function () {
        $('div#form-detail').modal({show: true, backdrop: 'static'});

        var advDetailId = $(this).closest('tr').data('id');
        var name = $(this).closest('tr').find("td:eq(0)").text();
        $.ajax({
            url: '/api',
            data: {
                module: 'advertising/specification-details/'+advDetailId,
                method: 'get'
            },
            type: 'POST',
            success: function (successData) {
                var successData = JSON.parse(successData);
                $('#form-detail .modal-title').text('Edit Iklan '+name)
                $('#form-detail input#name').val(successData.name)
                $('#form-detail input#remark').val(successData.name)
            }
        });
    });
});

$('#form-detail').on('show', function() {
    $('#detail-jenis').css('opacity', .5);
    $('#detail-jenis').unbind();
});
$('#form-detail').on('hidden', function() {
    $('#detail-jenis').css('opacity', 1);
    $('#detail-jenis').removeData("modal").modal({});
});

function getAdvDetail(advSpecId) {
    $.ajax({
        data: {
            advSpecId: advSpecId,
        },
        url: '/api/adv-spec-detail',
        type: 'POST',
        success: function (successData, textStatus, jqXHR) {
            var memberData = successData['hydra:member'];
            var tr = '';
            $.each(memberData, function (index, value) {
                tr += '<tr data-id="' + value.id + '">';
                tr += '<td>'+value.name+'</td>';
                tr += '<td>'+value.type.name+'</td>';
                tr += '<td>'+value.remark+'</td>';
                tr += '<td>';
                tr += '<span class="pull-right">';
                tr += '<button class="detail-btn btn btn-default btn-xs btn-flat" title="DETAIL"><i class="fa fa-eye"></i></button>';
                tr += '<button class="delete-btn btn btn-default btn-xs btn-flat" title="DELETE"><i class="fa fa-times"></i></button>';
                tr += '</span></td>';
                tr += '</td>';
                tr += '</tr>';
            });
            $('#detail-jenis tbody').html(tr);
        },
        error: function () {

        }
    });
}