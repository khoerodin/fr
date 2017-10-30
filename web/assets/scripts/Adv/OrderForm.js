(function (Bisnis) {
    Bisnis.Adv.OrderForm = {};

    // Perwakilan
    var repParams = {
        placeholder: 'CARI PERWAKILAN',
        module: 'representatives',
        prependValue: '/api/representatives/',
        allowClear: true,
        fields: [
            {
                field: 'code',
                label: 'Kode Perwakilan'
            },
            {
                field: 'name',
                label: 'Perwakilan'
            }
        ]
    };
    Bisnis.Util.Style.ajaxSelect('[name="orderFrom"]', repParams);
    // End Perwakilan

    // Pemasang Iklan
    Bisnis.Util.Event.bind('click','#customerButton', function () {
        loadCustomer();
        Bisnis.Util.Dialog.showModal('#customerModal');
        document.querySelector('#searchCustomer').focus();
        searchCustomers();
    });

    var loadCustomer = function (pageNum, name) {
        pageNum = pageNum ? pageNum : 1;
        Bisnis.Util.Storage.store('ORDER_FORM_CUSTOMER_PAGE', pageNum);
        Bisnis.Adv.Customers.fetchAll([{page: pageNum},{name: name}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#customersPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.code },
                            { value: memberData.id, format: function (id) {
                                return memberData.name + '<span class="pull-right">' +
                                    '<label class="label label-success choose-customer" ' +
                                    'style="cursor: pointer;" data-name="'+ memberData.name +'" data-address="'+ memberData.address +'" data-id="'+ id +'">PILIH</label><span>';
                            } },
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#customerList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#customerList', '<tr><td colspan="10">TIDAK ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA PEMASANG IKLAN');
            }
        );

        Bisnis.Util.Event.bind('click', '.choose-customer', function () {
            document.querySelector('[name="customer"]').value = '/api/advertising/customers/' + this.getAttribute('data-id');
            document.querySelector('#customerName').value = this.getAttribute('data-name');
            document.querySelector('#customerAddress').value = this.getAttribute('data-address');
            Bisnis.Util.Dialog.hideModal('#customerModal');
        });
    };

    var searchCustomers = function () {
        Bisnis.Util.Event.bind('keyup', '#searchCustomer', function () {
            loadCustomer(null, this.value);
        });
    };
    // End Pemasang Iklan

    // Klien Iklan
    Bisnis.Util.Event.bind('click','#clientButton', function () {
        loadClient();
        Bisnis.Util.Dialog.showModal('#clientModal');
        document.querySelector('#searchClient').focus();
        searchClient();
    });

    var loadClient = function (pageNum, name) {
        pageNum = pageNum ? pageNum : 1;
        Bisnis.Util.Storage.store('ORDER_FORM_CLIENT_PAGE', pageNum);
        Bisnis.Adv.Customers.fetchAll([{page: pageNum},{name: name}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#clientsPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.code },
                            { value: memberData.id, format: function (id) {
                                return memberData.name + '<span class="pull-right">' +
                                    '<label class="label label-success choose-client" ' +
                                    'style="cursor: pointer;" data-name="'+ memberData.name +'" data-id="'+ id +'">PILIH</label><span>';
                            } },
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#clientList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#clientList', '<tr><td colspan="10">TIDAK ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA KLIEN IKLAN');
            }
        );

        Bisnis.Util.Event.bind('click', '.choose-client', function () {
            document.querySelector('[name="client"]').value = '/api/advertising/customers/' + this.getAttribute('data-id');
            document.querySelector('#clientName').value = this.getAttribute('data-name');
            Bisnis.Util.Dialog.hideModal('#clientModal');
        });
    };

    var searchClient = function () {
        Bisnis.Util.Event.bind('keyup', '#searchClient', function () {
            loadClient(null, this.value);
        });
    };
    // End Klien Iklan

    // Cekat Di Faktur
    Bisnis.Util.Style.modifySelect('[name="printAs"]');
    // End Cekat Di Faktur

    // Jenis Iklan
    Bisnis.Util.Event.bind('click','#specificationButton', function () {
        loadSpecification();
        Bisnis.Util.Dialog.showModal('#specificationModal');
        document.querySelector('#searchSpecification').focus();
        searchSpecification();
    });

    var loadSpecification = function (pageNum, name) {
        pageNum = pageNum ? pageNum : 1;
        Bisnis.Util.Storage.store('ORDER_FORM_SPECIFICATION_PAGE', pageNum);
        Bisnis.Adv.Specifications.fetchAll([{page: pageNum},{name: name}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#specificationsPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.id, format: function (id) {
                                return memberData.name + '<span class="pull-right">' +
                                    '<label class="label label-success choose-specification" ' +
                                    'style="cursor: pointer;" data-name="'+ memberData.name +'" data-id="'+ id +'">PILIH</label><span>';
                            } },
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#specificationList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#specificationList', '<tr><td colspan="10">TIDAK ADA DATA</td></tr>');
                }
            },
            function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA JENIS IKLAN');
            }
        );

        Bisnis.Util.Event.bind('click', '.choose-specification', function () {
            document.querySelector('[name="specification"]').value = '/api/advertising/specifications/' + this.getAttribute('data-id');
            document.querySelector('#specificationName').value = this.getAttribute('data-name');

            document.querySelector('#typeName').value = '';
            document.querySelector('[name="type"]').value = '';
            document.querySelector('[name="basePrice"]').value = '';
            document.querySelector('#typeButton').disabled = false;

            document.querySelector('[name="basePrice"]').value = '0';
            getNetto();

            var specName = this.getAttribute('data-name');
            specName = specName.toLowerCase().toLowerCase().trim().replace(/\s+/g, '');
            console.log(specName)
            var arrayKhusus = [
                'kuping',
                'banner',
                'stapel',
                'eksposisi',
                'tarifkhusus'
            ];
            if ( Bisnis.Util.Document.inArray(specName, arrayKhusus) ) {
                document.querySelector('[name="totalAmount"]').readOnly = false;
            } else {
                document.querySelector('[name="totalAmount"]').readOnly = true;
            }

            Bisnis.Util.Dialog.hideModal('#specificationModal');
        });
    };

    var searchSpecification = function () {
        Bisnis.Util.Event.bind('keyup', '#searchSpecification', function () {
            loadSpecification(null, this.value);
        });
    };
    // End Jenis Iklan

    // Tipe Iklan
    Bisnis.Util.Event.bind('click','#typeButton', function () {
        loadType();
        Bisnis.Util.Dialog.showModal('#typeModal');
        document.querySelector('#searchType').focus();
        searchType();
    });

    var loadType = function (pageNum, name) {
        pageNum = pageNum ? pageNum : 1;
        Bisnis.Util.Storage.store('ORDER_FORM_TYPE_PAGE', pageNum);
        var specId = document.querySelector('[name="specification"]').value.split('/')[4];
        Bisnis.Adv.SpecificationDetails.fetchAll([{page: pageNum},{'type.name': name},{'specification.id': specId}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#typesPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.type.id, format: function (id) {
                                return memberData.type.name + '<span class="pull-right">' +
                                    '<label class="label label-success choose-type" ' +
                                    'style="cursor: pointer;" data-name="'+ memberData.type.name +'" data-id="'+ id +'">PILIH</label><span>';
                            } },
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#typeList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#typeList', '<tr><td colspan="10">TIDAK ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA TIPE IKLAN');
            }
        );

        Bisnis.Util.Event.bind('click', '.choose-type', function () {
            document.querySelector('[name="type"]').value = '/api/advertising/types/' + this.getAttribute('data-id');
            document.querySelector('#typeName').value = this.getAttribute('data-name');

            var params = [
                {
                    'specificationDetail.type.id': this.getAttribute('data-id'),
                    'active': true
                }
            ];
            Bisnis.Adv.Prices.fetchAll(params,
                function (dataResponse) {
                    var total = dataResponse['hydra:totalItems'];
                    var data = dataResponse['hydra:member'];

                    if (total > 0) {
                        document.querySelector('[name="basePrice"]').value = Bisnis.Util.Money.format(data[0]['price']);
                    } else {
                        document.querySelector('[name="basePrice"]').value = '0';
                    }
                    getNetto();
                },
                function () {
                    document.querySelector('[name="basePrice"]').value = '0';
                    Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENGAMBIL TARIF IKLAN');
                }
            );

            Bisnis.Util.Dialog.hideModal('#typeModal');
        });
    };

    var searchType = function () {
        Bisnis.Util.Event.bind('keyup', '#searchType', function () {
            loadType(null, this.value);
        });
    };
    // End Tipe Iklan

    // PIC
    Bisnis.Util.Event.bind('click','#accountExecutiveButton', function () {
        loadAccountExecutive();
        Bisnis.Util.Dialog.showModal('#accountExecutiveModal');
        document.querySelector('#searchAccountExecutive').focus();
        searchAccountExecutive();
    });

    var loadAccountExecutive = function (pageNum, name) {
        pageNum = pageNum ? pageNum : 1;
        Bisnis.Util.Storage.store('ORDER_FORM_ACCOUNT_EXECUTIVE_PAGE', pageNum);
        Bisnis.Adv.AccountExecutives.fetchAll([{page: pageNum},{name: name}],
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
                            { value: memberData.id, format: function (id) {
                                return memberData.name + '<span class="pull-right">' +
                                    '<label class="label label-success choose-account-executive" ' +
                                    'style="cursor: pointer;" data-name="'+ memberData.name +'" data-id="'+ id +'">PILIH</label><span>';
                            } },
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#accountExecutiveList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#accountExecutiveList', '<tr><td colspan="10">TIDAK ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA PIC');
            }
        );

        Bisnis.Util.Event.bind('click', '.choose-account-executive', function () {
            document.querySelector('[name="accountExecutive"]').value = '/api/advertising/account-executives/' + this.getAttribute('data-id');
            document.querySelector('#accountExecutiveName').value = this.getAttribute('data-name');
            Bisnis.Util.Dialog.hideModal('#accountExecutiveModal');
        });
    };

    var searchAccountExecutive = function () {
        Bisnis.Util.Event.bind('keyup', '#searchAccountExecutive', function () {
            loadAccountExecutive(null, this.value);
        });
    };
    // End PIC

    // Pasang Di
    Bisnis.Util.Event.bind('click','#mediaButton', function () {
        loadMedia();
        Bisnis.Util.Dialog.showModal('#mediaModal');
        document.querySelector('#searchMediaOrder').focus();
        searchMedia();
    });

    var loadMedia = function (pageNum, name) {
        pageNum = pageNum ? pageNum : 1;
        Bisnis.Util.Storage.store('ORDER_FORM_MEDIA_PAGE', pageNum);
        Bisnis.Adv.Media.fetchAll([{page: pageNum},{name: name}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#mediaPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.id, format: function (id) {
                                return memberData.name + '<span class="pull-right">' +
                                    '<label class="label label-success choose-media" ' +
                                    'style="cursor: pointer;" data-name="'+ memberData.name +'" data-id="'+ id +'">PILIH</label><span>';
                            } },
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#mediaList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#mediaList', '<tr><td colspan="10">TIDAK ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA MEDIA');
            }
        );

        Bisnis.Util.Event.bind('click', '.choose-media', function () {
            document.querySelector('[name="media"]').value = '/api/advertising/media/' + this.getAttribute('data-id');
            document.querySelector('#mediaName').value = this.getAttribute('data-name');
            Bisnis.Util.Dialog.hideModal('#mediaModal');
        });
    };

    var searchMedia = function () {
        Bisnis.Util.Event.bind('keyup', '#searchMediaOrder', function () {
            loadMedia(null, this.value);
        });
    };
    // End Pasang Di

    // Kategori Iklan
    Bisnis.Util.Event.bind('click','#categoryButton', function () {
        loadCategories();
        Bisnis.Util.Dialog.showModal('#categoryModal');
    });

    var loadCategories = function () {
        document.querySelector('#treeCategories').innerHTML = '<span class="text-primary">Memuat data...</span>';
        var params = {
            title: 'KATEGORI IKLAN',
            url: '/advertising/categories/tree'
        };
        Bisnis.Util.Treed.create(
            params,
            '#treeCategories',
            function (res) {
                if (res.id) {
                    document.querySelector('#categoryList').value = res.list;
                    document.querySelector('[name="category"]').value = '/api/advertising/categories/' + res.id;
                    Bisnis.Util.Dialog.hideModal('#categoryModal');
                } else {
                    Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENGAMBIL KATEGORI IKLAN');
                }
            }
        );
    };
    // End Kategori Iklan

    // Format Uang ke Input
    Bisnis.Util.Money.formatInput('[name="basePrice"]');
    Bisnis.Util.Money.formatInput('[name="taxValue"]');
    Bisnis.Util.Money.formatInput('[name="minDiscountValue"]');
    Bisnis.Util.Money.formatInput('[name="surchargeValue"]');
    Bisnis.Util.Money.formatInput('[name="discountValue"]');
    Bisnis.Util.Money.formatInput('[name="cashBackValue"]');
    Bisnis.Util.Money.formatInput('[name="totalAmount"]');
    // End Format Uang ke Input

    // PERHITUNGAN

    // Biaya
    var getBiaya = function () {
        var jenisIklan = document.querySelector('#specificationName').value;
        jenisIklan = jenisIklan.toLowerCase().trim().replace(/\s+/g, '');
        var arrayKhusus = [
            'kuping',
            'banner',
            'stapel',
            'eksposisi',
            'tarifkhusus'
        ];
        var biaya = '';
        var basePrice = document.querySelector('[name="basePrice"]').value;

        if ( Bisnis.Util.Document.inArray(jenisIklan, arrayKhusus) ) {
            biaya = parseFloat( Bisnis.Util.Money.unFormat(basePrice) );
        } else {
            var columnSize = document.querySelector('[name="columnSize"]').value;
            var milimeterSize = document.querySelector('[name="milimeterSize"]').value;

            if (basePrice && columnSize && milimeterSize) {
                biaya = parseFloat( Bisnis.Util.Money.unFormat(basePrice) ) * parseFloat(columnSize) * parseFloat(milimeterSize);
            } else {
                console.warn('Pastikan kolom ukuran kolom, mm/baris dan tarif iklan telah terisi');
            }
        }

        return biaya;
    };
    // End Biaya

    // Min Diskon
    var getMinDiscountByPercent = function () {
        var minDiscountPercentage = document.querySelector('[name="minDiscountPercentage"]').value;
        var minDiscount = ( getBiaya() * minDiscountPercentage ) / 100;
        minDiscount = Bisnis.Util.Money.format(minDiscount);
        document.querySelector('[name="minDiscountValue"]').value = minDiscount;
    };

    var getMinDiscountByValue = function () {
        var minDiscountValue = document.querySelector('[name="minDiscountValue"]').value;
        minDiscountValue = Bisnis.Util.Money.unFormat(minDiscountValue);

        var minDiscount = ( minDiscountValue / getBiaya() ) * 100;
        document.querySelector('[name="minDiscountPercentage"]').value = minDiscount.toFixed();
    };

    var getMinDiscount = function () {
        var minDiscount = document.querySelector('[name="minDiscountValue"]').value;
        return Bisnis.Util.Money.unFormat(minDiscount);
    };
    // End Min Diskon

    // Plus Diskon
    var getPlusDiscountByPercent = function () {
        var surchargePercentage = document.querySelector('[name="surchargePercentage"]').value;
        var biaya = getBiaya() - getMinDiscount();
        var plusDiscount = ( biaya * surchargePercentage) / 100;
        document.querySelector('[name="surchargeValue"]').value = Bisnis.Util.Money.format(plusDiscount);
    };

    var getPlusDiscountByValue = function () {
        var plusDiscountValue = document.querySelector('[name="minDiscountValue"]').value;
        plusDiscountValue = Bisnis.Util.Money.unFormat(plusDiscountValue);
        var biaya = getBiaya() - getMinDiscount();

        var plusDiscount = ( plusDiscountValue / biaya ) * 100;
        document.querySelector('[name="surchargePercentage"]').value = plusDiscount.toFixed();
    };

    var getPlusDiscount = function () {
        var plusDiscount = document.querySelector('[name="surchargeValue"]').value;
        return Bisnis.Util.Money.unFormat(plusDiscount);
    };
    // End Plus Diskon

    // Harga
    var getHarga = function () {
        return getBiaya() - getMinDiscount() + getPlusDiscount();
    };
    // End Harga

    // Diskon
    var getDiscountByPercent = function () {
        var discountPercentage = document.querySelector('[name="discountPercentage"]').value;
        var discount = ( getHarga() * discountPercentage) / 100;
        document.querySelector('[name="discountValue"]').value = Bisnis.Util.Money.format(discount);
    };

    var getDiscountByValue = function () {
        var discountValue = document.querySelector('[name="discountValue"]').value;
        var discount = ( discountValue / getHarga() ) * 100;
        document.querySelector('[name="discountPercentage"]').value = discount.toFixed();
    };

    var getDiscount = function () {
        var discount = document.querySelector('[name="discountValue"]').value;
        return Bisnis.Util.Money.unFormat(discount);
    };
    // End Diskon

    // Cash Back
    var getCashBackByPercent = function () {
        var cashBackPercentage = document.querySelector('[name="cashBackPercentage"]').value;
        var biaya = getHarga() - getDiscount();
        var cashBack = ( biaya * cashBackPercentage) / 100;
        document.querySelector('[name="cashBackValue"]').value = Bisnis.Util.Money.format(cashBack);
    };

    var getCashBackByValue = function () {
        var cashBackValue = document.querySelector('[name="cashBackValue"]').value;
        var biaya = getHarga() - getDiscount();
        var cashBack = ( cashBackValue / biaya ) * 100;
        document.querySelector('[name="cashBackPercentage"]').value = cashBack.toFixed();
    };

    var getCashBack = function () {
        var cashBack = document.querySelector('[name="cashBackValue"]').value;
        return Bisnis.Util.Money.unFormat(cashBack);
    };
    // End Cash Back

    // Total
    var getTotal = function () {
        return getHarga() - getDiscount() - getCashBack();
    };
    // End Total

    // PPN
    var getPPNByPercent = function () {
        var PPNPercentage = document.querySelector('[name="taxPercentage"]').value;
        var ppn = ( getTotal() * PPNPercentage ) / 100;
        document.querySelector('[name="taxValue"]').value = Bisnis.Util.Money.format(ppn);
    };

    var getPPNByValue = function () {
        var PPNValue = document.querySelector('[name="taxValue"]').value;
        var ppn = ( PPNValue / getTotal() ) * 100;
        document.querySelector('[name="taxPercentage"]').value = Bisnis.Util.Money.format(ppn);
    };

    var getPPN = function () {
        var ppn = document.querySelector('[name="taxValue"]').value;
        return Bisnis.Util.Money.unFormat(ppn);
    };
    // End PPN

    // Jumlah Bayar
    var getJumlahBayar = function () {
        var jumlahBayar = getTotal() + getPPN();
        document.querySelector('[name="totalAmount"]').value = Bisnis.Util.Money.format(jumlahBayar);
        return jumlahBayar;
    };
    // End Jumlah Bayar

    // Netto
    var getNetto = function () {
        var qty = document.querySelector('[name="quantity"]').value;
        qty = qty ? qty : 1;
        var netto = getJumlahBayar() * qty;
        var terbilang = Bisnis.Util.Terbilang.render(netto);
        document.querySelector('#terbilangNetto').innerText = terbilang;
        document.querySelector('#netto').innerText = Bisnis.Util.Money.format(netto, true);

        return netto;
    };
    // End Netto

    // NPB Diskon
    /*var getNpbDiscount = function () {
        var npbDiscountPercentage = document.querySelector('[name="npbDiscountPercentage"]').value;
        var biaya = getBiaya() + getPPN() + getPlusDiscount() - getMinDiscount() - getDiscount();
        var npbDiscount = ( biaya * npbDiscountPercentage) / 100;
        document.querySelector('[name="npbDiscountValue"]').value = npbDiscount;
        return npbDiscount;
    };*/
    // End NPB Diskon

    // Hitung Mundur
    var hitungMundur = function () {
        var totalAmount = parseFloat(Bisnis.Util.Money.unFormat(document.querySelector('[name="totalAmount"]').value));
        var ppnPercent = document.querySelector('[name="taxPercentage"]').value;
        var ppnRp = totalAmount / 1.1 * parseFloat(ppnPercent) /100;
        var basePrice = totalAmount - ppnRp.toFixed();

        document.querySelector('[name="taxValue"]').value = Bisnis.Util.Money.format(ppnRp.toFixed());
        document.querySelector('[name="basePrice"]').value = Bisnis.Util.Money.format(basePrice.toFixed());
    };

    Bisnis.Util.Event.bind('input', '[name="totalAmount"]', function () {
        hitungMundur();
        getNetto()
    });
    // End Hitung Mundur

    getNetto();
    Bisnis.Util.Event.bind('input', '[name="columnSize"]', function () {
        getNetto()
    });

    Bisnis.Util.Event.bind('input', '[name="milimeterSize"]', function () {
        getNetto()
    });

    Bisnis.Util.Event.bind('input', '[name="basePrice"]', function () {
        getNetto()
    });

    Bisnis.Util.Event.bind('input', '[name="minDiscountPercentage"]', function () {
        getMinDiscountByPercent();
        getNetto()
    });

    Bisnis.Util.Event.bind('input', '[name="surchargePercentage"]', function () {
        getPlusDiscountByPercent();
        getNetto()
    });

    Bisnis.Util.Event.bind('input', '[name="discountPercentage"]', function () {
        getDiscountByPercent();
        getNetto()
    });

    Bisnis.Util.Event.bind('input', '[name="cashBackPercentage"]', function () {
        getCashBackByPercent();
        getNetto()
    });

    Bisnis.Util.Event.bind('input', '[name="jumlahBayar"]', function () {
        getNetto()
    });

    Bisnis.Util.Event.bind('input', '[name="quantity"]', function () {
        getNetto()
    });

    // Jenis Bayar
    Bisnis.Util.Style.modifySelect('[name="paymentMethod"]');
    // End Jenis Bayar

    // Sisipan
    Bisnis.Util.Event.bind('click','#sirculationAreaButton', function () {
        loadSirculationArea();
        Bisnis.Util.Dialog.showModal('#sirculationAreaModal');
        document.querySelector('#searchSirculationArea').focus();
        searchSirculationArea();
    });

    var loadSirculationArea = function (pageNum, name) {
        pageNum = pageNum ? pageNum : 1;
        Bisnis.Util.Storage.store('ORDER_FORM_MEDIA_PAGE', pageNum);
        Bisnis.Admin.Cities.fetchAll([{page: pageNum},{name: name}],
            function (dataResponse) {
                var memberData = dataResponse['hydra:member'];
                var viewData = dataResponse['hydra:view'];

                if ('undefined' !== typeof viewData['hydra:last']) {
                    var currentPage = Bisnis.Util.Url.getQueryParam('page', viewData['@id']);
                    Bisnis.Util.Grid.createPagination('#sirculationAreaPagination', Bisnis.Util.Url.getQueryParam('page', viewData['hydra:last']), currentPage);
                }

                if (memberData.length > 0) {
                    var records = [];
                    Bisnis.each(function (idx, memberData) {
                        records.push([
                            { value: memberData.code },
                            { value: memberData.id, format: function (id) {
                                return memberData.name + '<span class="pull-right">' +
                                    '<label class="label label-success choose-sirculation-area" ' +
                                    'style="cursor: pointer;" data-name="'+ memberData.name +'" data-id="'+ id +'">PILIH</label><span>';
                            } },
                        ]);
                    }, memberData);
                    Bisnis.Util.Grid.renderRecords('#sirculationAreaList', records, pageNum);
                } else {
                    Bisnis.Util.Document.putHtml('#sirculationAreaList', '<tr><td colspan="10">TIDAK ADA DATA</td></tr>');
                }
            }, function () {
                Bisnis.Util.Dialog.alert('GAGAL MEMUAT DATA KOTA SISIPAN');
            }
        );

        Bisnis.Util.Event.bind('click', '.choose-sirculation-area', function () {
            document.querySelector('[name="sirculationArea"]').value = '/api/cities/' + this.getAttribute('data-id');
            document.querySelector('#sirculationAreaName').value = this.getAttribute('data-name');
            Bisnis.Util.Dialog.hideModal('#sirculationAreaModal');
        });
    };

    var searchSirculationArea = function () {
        Bisnis.Util.Event.bind('keyup', '#searchSirculationArea', function () {
            loadSirculationArea(null, this.value);
        });
    };
    // End Sisipan

    // Status Detail
    Bisnis.Util.Style.modifySelect('[name="printInvoiceAs"]');
    // End Status Detail

    // Tag Order
    Bisnis.Util.Style.multipleSelect('[name="orderTag"]', 'advertising/tags');
    // End Tag Order
})(window.Bisnis || {});