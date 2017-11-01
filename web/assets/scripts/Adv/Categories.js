(function (Bisnis) {
    Bisnis.Adv.Categories = {};

    Bisnis.Adv.Categories.fetchAll = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/categories',
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

    // tree categories
    Bisnis.Adv.Categories.tree = function (categoriesSelector, dblClickCallback) {
        var params = {
            title: 'KATEGORI IKLAN',
            url: '/advertising/categories/tree'
        };

        Bisnis.Util.Treed.create(params, categoriesSelector, function (dblClickCallbackData) {
            if (Bisnis.validCallback(dblClickCallback)) {
                dblClickCallback(dblClickCallbackData);
            }
        });
    };

    Bisnis.Adv.Categories.tree('#categoriesTree');

    Bisnis.Util.Event.bind('contextmenu', '#categoriesTree li span', function () {
        this.classList.remove("active");
        this.classList.add("active");
    });

    Bisnis.Util.ContextMenu.create('#categoriesTree li span', {
        fetchElementData: function(catElem) {
            var catId = Bisnis.Util.Document.getDataValue(catElem, 'id');
            var catName = Bisnis.Util.Document.getDataValue(catElem, 'name');
            return {id: catId, name: catName};
        },
        actions: [{
            name: 'TAMBAH',
            onClick: function(data) {
                if (data.id) {
                    Bisnis.Util.Storage.store('ADV_CATEGORY_ID', data.id);
                } else {
                    Bisnis.Util.Storage.store('ADV_CATEGORY_ID', '');
                }

                Bisnis.Util.Dialog.showModal('#addModal');
                document.querySelector('#addModal #name').focus();
            }
        }, {
            name: 'EDIT',
            onClick: function(data) {
                var name = document.querySelector('#detailModal #name');
                Bisnis.Util.Storage.store('ADV_CATEGORY_ID', data.id);

                Bisnis.Util.Dialog.showModal('#detailModal');
                name.value = data.name;
                name.focus();
            }
        }, {
            name: 'HAPUS',
            onClick: function(data) {
                bootbox.confirm({
                    message: "YAKIN AKAN MENGHAPUS KATEGORI INI?<br/>ANAK KATEGORI (JIKA ADA) JUGA AKAN IKUT TERHAPUS, HATI-HATI!",
                    animate: false,
                    buttons: {
                        confirm: {
                            className: 'btn-danger btn-flat'
                        },
                        cancel: {
                            className: 'btn-default btn-flat'
                        }
                    },
                    callback: function (result) {
                        if (result) {
                            Bisnis.Adv.Categories.delete(data.id,
                                function () {
                                    document.querySelector('[data-id="'+data.id+'"]').closest('li').remove();
                                    Bisnis.successMessage('Berhasil menghapus data');
                                }, function () {
                                    Bisnis.Util.Dialog.alert('PERHATIAN', 'Gagal menghapus kategori');
                                }
                            );
                        }
                    }
                });
            }
        }]
    });
    // end tree categories

    //add modal
    Bisnis.Util.Event.bind('click', '#btn-add', function () {
        var params = Bisnis.Util.Form.serializeArray('#addForm');
        var id = Bisnis.Util.Storage.fetch('ADV_CATEGORY_ID');
        var thisBtn = this;
        thisBtn.disabled = true;

        if (id) {
            params.push({
                name: 'parent',
                value: '/api/advertising/categories/'+id
            });
        }

        Bisnis.Adv.Categories.add(params,
            function (dataResponse) {
                // jika id tidak kosong
                // maka maka id jadikan parent
                if (id) {
                    var list = document.querySelector('[data-id="'+id+'"]').closest('li');
                    // jika id telah memiliki child
                    if (Bisnis.Util.Document.hasClass(list, 'branch')) {
                        var html = '<li style="display: list-item;"><span data-id="'+dataResponse.id+'" data-name="'+dataResponse.name+'">'+dataResponse.name+'</span></li>';
                        document.querySelector('[data-id="'+id+'"]').closest('li').querySelector('ul').insertAdjacentHTML('beforeend', html);

                        // jika id belum memiliki child
                    } else {
                        var htmlBefore = '<i class="indicator glyphicon glyphicon-folder-open"></i>';
                        document.querySelector('[data-id="'+id+'"]').insertAdjacentHTML('beforebegin', htmlBefore);

                        var htmlAppend = '<ul><li style="display: list-item;"><span data-id="'+dataResponse.id+'" data-name="'+dataResponse.name+'">'+dataResponse.name+'</span></li></ul>';
                        var closestLi = document.querySelector('[data-id="'+id+'"]').closest('li');
                        closestLi.classList.add('branch');
                        closestLi.insertAdjacentHTML('beforeend', htmlAppend);
                    }
                    // jika id kosong
                    // maka tanpa parent
                } else {
                    var htmlAppend = '<li style="display: list-item;"><span data-id="'+dataResponse.id+'" data-name="'+dataResponse.name+'">'+dataResponse.name+'</span></li>';
                    var ul = document.querySelector('ul#treed-categoriesTree li > ul')
                        .insertAdjacentHTML('beforeend', htmlAppend);
                }
                Bisnis.Util.Dialog.hideModal('#addModal');
                thisBtn.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('addForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            }
        );
    });

    Bisnis.Adv.Categories.add = function (params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/categories',
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
    //end add modal

    // edit modal
    Bisnis.Adv.Categories.updateById = function (id, params, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/categories/' + id,
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

    Bisnis.Util.Event.bind('click', '#btn-update', function () {
        var id = Bisnis.Util.Storage.fetch('ADV_CATEGORY_ID');

        var params = Bisnis.Util.Form.serializeArray('#detailForm');
        params.push({
            name: 'id',
            value: id
        });

        var $this = this;
        $this.disabled = true;

        Bisnis.Adv.Categories.updateById(id, params,
            function (dataResponse) {
                Bisnis.successMessage('Berhasil memperbarui data');

                var elem = document.querySelector('[data-id="'+id+'"]');
                elem.textContent = dataResponse.name;
                elem.setAttribute('data-name', dataResponse.name);

                Bisnis.Util.Dialog.hideModal('#detailModal');
                Bisnis.Util.Event.bind('contextmenu', '#categoriesTree li span', function () {
                    document.querySelector('#categoriesTree li span').classList.remove('active');
                    document.querySelector('#categoriesTree li span').classList.add('active');
                });
                $this.disabled = false;
            }, function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('detailForm', response.responseJSON.violations);
                }
                $this.disabled = false;
            }
        );
    });
    // end edit modal

    // delete category
    Bisnis.Adv.Categories.delete = function (id, successCallback, errorCallback) {
        Bisnis.request({
            module: 'advertising/categories/' + id,
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
    // end delete category

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
    // end reset modal form on modal hidden

})(window.Bisnis || {});