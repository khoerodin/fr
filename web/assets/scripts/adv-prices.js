jQuery("#search-specificationDetailName").select2({
    theme: "bootstrap",
    allowClear: true,
    ajax: {
        url: "/api/search",
        dataType: 'json',
        type: 'POST',
        delay: 250,
        data: function (params) {
            return {
                q: params.term,
                page: params.page,
                module: 'advertising/specification-details',
                method: 'get',
                field: 'name'.split('#')
            };
        },
        processResults: function (data) {
            if(data.length > 0) {
                return {
                    results: $.map(data, function(obj) {
                        return { id: obj.id, text: obj['name'.split('#')[0]] };
                    })
                }
            } else {
                var elms = jQuery('.search-area').removeClass('col-md-12').addClass('col-md-10');
                elms += jQuery('.button-area').addClass('col-md-2');
                elms += jQuery('a[data-btn-add="'+module+'"]').css('visibility', 'visible');

                return {
                    results: elms
                }
            }

        },
        cache: true,
    },
    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
    minimumInputLength: 2,
}).on("select2:select", function () {
    var id = $("#search-specificationDetailName").val();
    var text = $('#search-specificationDetailName option[value="'+id+'"]').text();

    $.ajax({
        url: '/api',
        type: 'post',
        data: {
            module: 'advertising/prices',
            method: 'get',
            params: [
                {
                    'specificationDetail.id': id
                }
            ]
        },
        success: function (data) {
            var total = JSON.parse(data)['hydra:totalItems'];
            if(total === 1) {
                //detail
                detailPrice(data);
            } else {
                //add new
                addPrice(id, text);
            }
        }

    });

});

function addPrice(id, text) {
    $('div[data-modal-add="advertising/prices"] select[name="specificationDetail"]').html('<option value="advertising/specification-details/'+id+'">'+text+'</option>');
    getSelect('.select-add-modal');
    $('div[data-modal-add="advertising/prices"]').modal('show');
}

function detailPrice(data) {
    var data = JSON.parse(data)['hydra:member'];
    $.each(data, function (index, value) {
        $('div[data-modal-detail="advertising/prices"] #id').val(value.id);
        $('div[data-modal-detail="advertising/prices"] #year').val(value.year);
        $('div[data-modal-detail="advertising/prices"] #price').val(value.price);

        $.ajax({
            url: '/api',
            type: 'post',
            data: {
                module: 'advertising/specification-details',
                method: 'get'
            },
            success: function (data) {
                var data = JSON.parse(data)['hydra:member'];
                var option = '';
                $.each(data, function (idx, vlu) {
                    if (vlu.id === value.specificationDetail.id) {
                        option += '<option selected value="/api/advertising/specification-details/'+vlu.id+'">'+vlu.name+'</option>';
                    } else {
                        option += '<option value="/api/advertising/specification-details/'+vlu.id+'">'+vlu.name+'</option>';
                    }
                });
                $('div[data-modal-detail="advertising/prices"] [name="specificationDetail"]').html(option)
                    .select2({
                        theme: 'bootstrap'
                    });
            }

        });

    });

    $('div[data-modal-detail="advertising/prices"]').modal('show');
}