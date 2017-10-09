(function (Bisnis) {
    Bisnis.Adv.AccountExecutives = {};

    // fetch grid and pagination
    Bisnis.Adv.AccountExecutives.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executives',
            method: 'get',
            params: params
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(successCallback)) {
                successCallback(dataResponse, textStatus, response);
            }
        }, function (response, textStatus, errorThrown) {
            if (Bisnis.validCallback(errorCallback)) {
                errorCallback(response, textStatus, errorThrown);
            }
        });
    };

    var loadGrid = function (pageNum) {
        var pageNum =
            (isNaN(pageNum) || 'undefined' === typeof pageNum || 'null' === pageNum ) ? 1 : parseInt(pageNum);
        Bisnis.Util.Storage.store('ACCOUNT_EXECUTIVE_CURRENT_PAGE', pageNum);
        Bisnis.Adv.AccountExecutives.fetchAll([{page: pageNum}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#accountExecutivesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.code },
                            { value: memberData.name },
                            { value: memberData.accountExecutiveManager.name },
                            { value: memberData.id, format: function (id) {
                                return '<span class="pull-right">' +
                                    '<button data-id="' + id + '" data-code="' + memberData.code + '" data-name="' + memberData.name + '" class="btn btn-xs btn-default btn-flat btn-categories" title="KATEGORI"><i class="fa fa-list-ol"></i></button>' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-detail-ae" title="DETAIL"><i class="fa fa-eye"></i></button>' +
                                    '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete-ae" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                    '</span>';
                            }}
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#accountExecutivesList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#accountExecutivesList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA AKUN EKSEKUTIF');
            }
        );
    };

    loadGrid(1);

    Bisnis.Util.Event.bind('click', '#accountExecutivesPagination .pagePrevious', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#accountExecutivesPagination .pageNext', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });

    Bisnis.Util.Event.bind('click', '#accountExecutivesPagination .pageFirst', function () {
        loadGrid(1);
    });

    Bisnis.Util.Event.bind('click', '#accountExecutivesPagination .pageLast', function () {
        loadGrid(Bisnis.Util.Document.getDataValue(this, 'page'));
    });
    // end fetch grid and pagination

    // search box
    var params = {
        placeholder: 'CARI KODE / NAMA AKUN EKSEKUTIF',
        module: 'advertising/account-executives',
        fields: [
            {
                field: 'code',
                label: 'Kode'
            },
            {
                field: 'name',
                label: 'Nama'
            }
        ]
    };

    Bisnis.Util.Style.ajaxSelect('#searchAccountExecutives', params,
        function (hasResultCallback) {
            var btn = document.getElementById('btnAddAccountExecutive');
            if (hasResultCallback) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        },
        function (selectedCallback) {
            loadDetail(selectedCallback.id);
        },
        function (openCallback) {
            var btn = document.getElementById('btnAddAccountExecutive');
            if (openCallback === false) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        },
        function (closeCallback) {
            var btn = document.getElementById('btnAddAccountExecutive');
            setTimeout(function () {
                if (closeCallback === false) {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }
            }, 300);
        }
    );
    // end search box

    // categories modal
    // fetch categories
    Bisnis.Util.Event.bind('click', '.btn-categories', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        var accountExecutiveId = id;
        var code = Bisnis.Util.Document.getDataValue(this, 'code');
        var name = Bisnis.Util.Document.getDataValue(this, 'name');
        Bisnis.Util.Storage.store('ACCOUNT_EXECUTIVE_ID_FOR_CATEGORIES', accountExecutiveId);

        document.getElementById('categoriesCode').textContent = code;
        document.getElementById('categoriesName').textContent = name;

        Bisnis.Adv.Categories.tree('#accountExecutiveCategoriesTree', function (dblClickCallback) {
            var category = dblClickCallback;
            Bisnis.Util.Dialog.yesNo('PERHATIAN', '<p class="text-primary">'+dblClickCallback.list+'</p>KATEGORI DI ATAS AKAN ANDA TAMBAHKAN?', function (result) {
                if (result) {
                    var params = [
                        {
                            name: 'accountExecutive',
                            value: '/api/advertising/account-executives/'+accountExecutiveId
                        },
                        {
                            name: 'category',
                            value: '/api/advertising/categories/'+category.id
                        }
                    ];
                    Bisnis.Adv.AccountExecutiveCategories.add(params,
                        function () {
                            var pageNum = Bisnis.Util.Storage.store('ACCOUNT_EXECUTIVE_CATEGORIES_CURRENT_PAGE');
                            loadCategoriesGrid(accountExecutiveId, pageNum);
                        }, function (response) {
                            if (response.responseJSON) {
                                Bisnis.Util.Dialog.alert(JSON.stringify(dataResponse.violations));
                                Bisnis.errorMessage('Gagal menambahkan kategori');
                            }
                        }
                    );
                }
            });
        });

        loadCategoriesGrid(accountExecutiveId, 1);

        Bisnis.Util.Event.bind('click', '#accountExecutiveCategoriesPagination .pagePrevious', function () {
            loadCategoriesGrid(accountExecutiveId, Bisnis.Util.Document.getDataValue(this, 'page'));
        });

        Bisnis.Util.Event.bind('click', '#accountExecutiveCategoriesPagination .pageNext', function () {
            loadCategoriesGrid(accountExecutiveId, Bisnis.Util.Document.getDataValue(this, 'page'));
        });

        Bisnis.Util.Event.bind('click', '#accountExecutiveCategoriesPagination .pageFirst', function () {
            loadCategoriesGrid(accountExecutiveId, 1);
        });

        Bisnis.Util.Event.bind('click', '#accountExecutiveCategoriesPagination .pageLast', function () {
            loadCategoriesGrid(accountExecutiveId, Bisnis.Util.Document.getDataValue(this, 'page'));
        });

        Bisnis.Util.Dialog.showModal('#categoriesModal');
    });

    var loadCategoriesGrid = function (accountExecutiveId, pageNum) {
        var pageNum =
            (isNaN(pageNum) || 'undefined' === typeof pageNum || 'null' === pageNum ) ? 1 : parseInt(pageNum);
        Bisnis.Util.Storage.store('ACCOUNT_EXECUTIVE_CATEGORIES_CURRENT_PAGE', pageNum);
        Bisnis.Adv.AccountExecutiveCategories.fetchAll([{page: pageNum},{'accountExecutive.id': accountExecutiveId}],
            function (dataResponse) {

                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#accountExecutiveCategoriesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    // ambil semua data (array) kategori iklan untuk function: renderCategoryParents
                    Bisnis.Adv.Categories.fetchAll([],
                        function (dataResponse) {
                            var categoriesData = dataResponse['hydra:member'];

                            Bisnis.each(function (idx, memberData) {
                                records.push([
                                    { value: renderCategoryParents(memberData.category.id, categoriesData) },
                                    { value: memberData.id, format: function (id) {
                                        return '<span class="pull-right">' +
                                            '<button data-id="' + id + '" class="btn btn-xs btn-default btn-flat btn-delete-category" title="HAPUS"><i class="fa fa-times"></i></button>' +
                                            '</span>';
                                    }}
                                ]);
                            }, memberData);
                            Bisnis.Util.Grid.renderRecords('#accountExecutiveCategoriesList', records, pageNum);
                        }, function () {
                            Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA KATEGORI IKLAN');
                        });
                } else {
                    Bisnis.Util.Document.putHtml('#accountExecutiveCategoriesList', '<tr><td colspan="10">BELUM ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA KATEGORI AKUN EKSEKUTIF');
            }
        );
    };

    var renderCategoryParents = function (categoryId, memberData) {
        var str = '';
        memberData.forEach(function(value) {
            if (categoryId === value.id) {
                if ( value.parent ) {
                    str += renderCategoryParents( value.parent.id, memberData );
                    if ( typeof value.parent.id !== 'undefined' ) {
                        str += ' ➤ ';
                    }
                }
                str += value.name;
            }
        });
        return str;
    };
    // end fetch categories

    // delete category
    Bisnis.Util.Event.bind('click', '.btn-delete-category', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Adv.AccountExecutiveCategories.delete(id,
                    function () {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var pageNum = Bisnis.Util.Storage.fetch('ACCOUNT_EXECUTIVE_CATEGORIES_CURRENT_PAGE');
                        var accountExecutiveId = Bisnis.Util.Storage.fetch('ACCOUNT_EXECUTIVE_ID_FOR_CATEGORIES');
                        loadCategoriesGrid(accountExecutiveId, pageNum);
                    }, function () {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                )
            }
        });
    });
    // end delete category
    // end categories modal

    // add modal
    Bisnis.Util.Event.bind('click', '#btnAddAccountExecutive', function () {
        var AEManager = {
            placeholder: 'CARI NAMA',
            module: 'advertising/account-executive-managers',
            prependValue: '/api/advertising/account-executive-managers/',
            allowClear: true,
            fields: [
                {
                    field: 'name',
                    label: 'Nama'
                }
            ]
        };
        Bisnis.Util.Style.ajaxSelect('#addAccountExecutiveManager', AEManager);

        Bisnis.Util.Dialog.showModal('#addModal');
        document.getElementById('addAccountExecutiveManager').focus();
    });

    Bisnis.Util.Event.bind('click', '#btn-add-ae', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.AccountExecutives.add(params,
            function () {
                Bisnis.Util.Dialog.hideModal('#addModal');
                loadGrid(1);
                thisBtn.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('addForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            });
    });

    Bisnis.Adv.AccountExecutives.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executives',
            method: 'post',
            params: params
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(successCallback)) {
                successCallback(dataResponse, textStatus, response);
            }
        }, function (response, textStatus, errorThrown) {
            if (Bisnis.validCallback(errorCallback)) {
                errorCallback(response, textStatus, errorThrown);
            }
        });
    };
    // end add modal

    // detail modal
    var loadDetail = function (id) {
        Bisnis.Util.Storage.store('ACCOUNT_EXECUTIVE_ID', id);
        Bisnis.Adv.AccountExecutives.fetchById(id,
            function (dataResponse) {
                if (dataResponse.accountExecutiveManager) {
                    var AEMngrElm = document.getElementById('detailAccountExecutiveManager');
                    AEMngrElm.innerHTML = '<option value="/api/advertising/account-executive-managers/'+dataResponse.accountExecutiveManager.id+'">'+dataResponse.accountExecutiveManager.name+'</option>';
                    Bisnis.Util.Event.bind('change', '#detailAccountExecutiveManager');
                }

                var AEManager = {
                    placeholder: 'CARI NAMA',
                    module: 'advertising/account-executive-managers',
                    prependValue: '/api/advertising/account-executive-managers/',
                    allowClear: true,
                    fields: [
                        {
                            field: 'name',
                            label: 'Nama'
                        }
                    ]
                };
                Bisnis.Util.Style.ajaxSelect('#detailAccountExecutiveManager', AEManager);

                var codeElem = document.getElementById('detailCode');
                codeElem.value = dataResponse.code;
                codeElem.focus();

                var nameElem = document.getElementById('detailName');
                nameElem.value = dataResponse.name;

                Bisnis.Util.Dialog.showModal('#detailModal');
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA AKUN EKSEKUTIF');
            }
        );
    };

    Bisnis.Util.Event.bind('click', '.btn-detail-ae', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        loadDetail(id);
    });

    Bisnis.Adv.AccountExecutives.fetchById = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executives/' + id,
            method: 'get'
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(successCallback)) {
                successCallback(dataResponse, textStatus, response);
            }
        }, function (response, textStatus, errorThrown) {
            if (Bisnis.validCallback(errorCallback)) {
                errorCallback(response, textStatus, errorThrown);
            }
        });
    };

    Bisnis.Adv.AccountExecutives.updateById = function (id, params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executives/' + id,
            method: 'put',
            params: params
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(successCallback)) {
                successCallback(dataResponse, textStatus, response);
            }
        }, function (response, textStatus, errorThrown) {
            if (Bisnis.validCallback(errorCallback)) {
                errorCallback(response, textStatus, errorThrown);
            }
        });
    };

    Bisnis.Util.Event.bind('click', '#btn-update-ae', function () {
        var id = Bisnis.Util.Storage.fetch('ACCOUNT_EXECUTIVE_ID');
        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        var thisBtn = this;
        thisBtn.disabled = true;

        Bisnis.Adv.AccountExecutives.updateById(id, params,
            function () {
                Bisnis.successMessage('Berhasil memperbarui data');
                Bisnis.Util.Dialog.hideModal('#detailModal');
                var page = Bisnis.Util.Storage.fetch('ACCOUNT_EXECUTIVE_CURRENT_PAGE');
                loadGrid(page);
                thisBtn.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('detailForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            }
        );
    });
    // end detail modal

    // delete account executive
    Bisnis.Util.Event.bind('click', '.btn-delete-ae', function () {
        var id = Bisnis.Util.Document.getDataValue(this, 'id');
        Bisnis.Util.Dialog.yesNo('HATI-HATI', 'YAKIN AKAN MENGHAPUS DATA INI?', function (result) {
            if (result) {
                Bisnis.Adv.AccountExecutives.delete(id,
                    function () {
                        Bisnis.successMessage('Berhasil menghapus data');
                        var page = Bisnis.Util.Storage.fetch('ACCOUNT_EXECUTIVE_CURRENT_PAGE');
                        loadGrid(page);
                    }, function () {
                        Bisnis.errorMessage('Gagal menghapus data');
                    }
                )
            }
        });
    });

    Bisnis.Adv.AccountExecutives.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/account-executives/' + id,
            method: 'delete'
        }, function (dataResponse, textStatus, response) {
            if (Bisnis.validCallback(successCallback)) {
                successCallback(dataResponse, textStatus, response);
            }
        }, function (response, textStatus, errorThrown) {
            if (Bisnis.validCallback(errorCallback)) {
                errorCallback(response, textStatus, errorThrown);
            }
        });
    };
    // end delete account executive

    // prevent submit form on enter
    Bisnis.Util.Event.bind('keypress', '#addForm, #detailForm', function (e) {
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            Bisnis.Util.Dialog.alert("PERHATIAN", "SILAKAN TEKAN TOMBOL SIMPAN");
            e.preventDefault();
        }
    });
    // end prevent submit form on enter

    // reset modal form on modal hidden
    Bisnis.Util.Dialog.hiddenModal('#addModal', function () {
        Bisnis.Util.Grid.removeErrorForm('addForm');
        document.getElementById("addForm").reset();
    });
    Bisnis.Util.Dialog.hiddenModal('#detailModal', function () {
        Bisnis.Util.Grid.removeErrorForm('detailForm');
        document.getElementById("detailForm").reset();
    });
    Bisnis.Util.Dialog.hiddenModal('#categoriesModal', function () {
        Bisnis.Util.Document.putHtml('#accountExecutiveCategoriesList', '<tr><td colspan="10">MEMUAT...</td></tr>');
        Bisnis.Util.Document.putHtml('#accountExecutiveCategoriesTree', '<i class="fa fa-refresh fa-spin fa-2x fa-fw text-primary"></i>');
    });
    // end reset modal form on modal hidden

})(window.Bisnis || {});