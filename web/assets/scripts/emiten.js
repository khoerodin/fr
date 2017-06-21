function getAll(module, columns = [], tbody = 'data-list') {

    var data = {
        module : module,
        method: 'get',
        params: getQueryVariable()
    };

    columnCount = columns.length+2;

    $.ajax({
        url: "/api",
        type: "POST",
        data: data,
        beforeSend: function () {
            jQuery('tbody['+tbody+'="'+module+'"]').html('<tr><td colspan="'+columnCount+'">LOADING DATA...</td></tr>')
        },
        success: function (data, textStatus, jqXHR) {
            arr = JSON.parse(data);
            if('hydra:member' in arr) {
                $.each(arr, function (index, value) {

                    if (index === 'hydra:member') {

                        page = getQueryVariable('page');
                        var tr = '';
                        $.each(value, function (idx, val) {
                            if (page > 1) {
                                c = page - 1;
                                p = 17 * c;
                                no = idx + 1 + p;
                            } else {
                                no = idx + 1;
                            }

                            no = no;
                            tr += '<tr id="' + val.id + '">';
                            tr += '<td>' + no + '</td>'
                            $.each(columns, function (i, v) {
                                var v1 = v.split(".")[0];
                                var v2 = v.split(".")[1];

                                if (val[v1] instanceof Object) {
                                    $.each(val[v1], function (ind, vl) {
                                        if (ind == v2) {
                                            tr += '<td>' + vl + '</td>';
                                        }
                                    })
                                } else {
                                    tr += '<td>';

                                    if (module === 'users') {

                                        if (val[v1] == true) {
                                            tr += '<input type="checkbox" class="loginState" data-id="' + val.id + '" name="loggedIn" checked>';
                                        } else if (val[v1] == false) {
                                            tr += '<input type="checkbox" class="loginState" data-id="' + val.id + '" name="loggedIn">';
                                        } else {
                                            if (val[v1] == null) {
                                                val[v1] = '-';
                                            }
                                            tr += val[v1];
                                        }

                                    } else {

                                        if (val[v1] == true && val[v1] !== '1' && val[v1] !== '') {
                                            tr += '<span class="glyphicon glyphicon-ok"></span>';
                                        } else if (val[v1] == false && val[v1] !== '0' && val[v1] !== '') {
                                            tr += '<span class="glyphicon glyphicon-remove"></span>';
                                        } else {
                                            if (val[v1] == null) {
                                                val[v1] = '-';
                                            }
                                            tr += val[v1];
                                        }

                                    }

                                    tr += '</td>';
                                }

                            });

                            tr += '<td><span class="pull-right">';
                            tr += '<button data-id="' + val.id + '" class="detail-btn btn btn-default btn-xs btn-flat" title="DETAIL"><i class="fa fa-eye"></i></button>';
                            tr += '<button data-id="' + val.id + '" class="delete-btn btn btn-default btn-xs btn-flat" title="DELETE"><i class="fa fa-times"></i></button>';

                            if (module === 'users') {
                                tr += '<button data-user-fullname="' + val.fullname + '" data-id="' + val.id + '" class="roles-btn btn btn-default btn-xs btn-flat" title="ROLES"><i class="fa fa-lock"></i></button>';
                            }

                            if (module === 'advertising/specifications') {
                                tr += '<button data-id="' + val.id + '" class="detail-adv btn btn-default btn-xs btn-flat" title="DETAIL JENIS IKLAN"><i class="fa fa-file-text-o"></i></button>';
                            }

                            tr += '</span></td>';
                            tr += '</tr>';
                        });
                        jQuery('tbody['+tbody+'="' + module + '"]').html(tr);
                    }

                    if (index === 'hydra:view') {
                        var paging = '';

                        $.each(value, function (idx, val) {
                            page = getQueryVariable('page', val);
                            if (idx.startsWith('hydra')) {
                                if (idx.endsWith('first')) {
                                    paging += '<li><span class="to-page" data-page="' + page + '" title="FIRST PAGE">FIRST</span></li>';
                                }
                            }
                        });

                        $.each(value, function (idx, val) {
                            page = getQueryVariable('page', val);
                            if (idx.startsWith('hydra')) {
                                if (idx.endsWith('previous')) {
                                    paging += '<li><span class="to-page" data-page="' + page + '" title="PREVIOUS PAGE">PREVIOUS</span></li>';
                                }
                            }
                        });

                        $.each(value, function (idx, val) {
                            page = getQueryVariable('page', val);
                            if (idx.startsWith('hydra')) {
                                if (idx.endsWith('next')) {
                                    paging += '<li><span class="to-page" data-page="' + page + '" title="NEXT PAGE">NEXT</span></li>';
                                }
                            }
                        });

                        $.each(value, function (idx, val) {
                            page = getQueryVariable('page', val);
                            if (idx.startsWith('hydra')) {
                                if (idx.endsWith('last')) {
                                    paging += '<li><span class="to-page" data-page="' + page + '" title="LAST PAGE">LAST</span></li>';
                                }
                            }
                        });

                        jQuery('ul[data-paging="' + module + '"].pagination').html(paging);
                    }

                    if (index === 'hydra:totalItems') {
                        if (value < 1) {
                            jQuery('tbody['+tbody+'="' + module + '"]').html('<tr><td colspan="33">TIDAK ADA DATA</td></tr>');
                        }
                    }

                });
            } else {
                toastr.error('Error when getting your data');
                jQuery('tbody['+tbody+'="' + module + '"]').html('<tr><td colspan="33"><span class="text-danger">ERROR KETIKA MENGAMBIL DATA</span></td></tr>');
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Error when getting your data');
            jQuery('tbody[data-list="' + module + '"]').html('<tr><td colspan="33"><span class="text-danger">ERROR KETIKA MENGAMBIL DATA</span></td></tr>');
        }
    });
}