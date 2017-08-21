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
    //
});