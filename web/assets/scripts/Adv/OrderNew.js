(function (Bisnis) {
    Bisnis.Adv.OrderNew = {};

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
    Bisnis.Util.Style.ajaxSelect('#orderFrom', repParams);
    // End Perwakilan

    // Tanggal Booking, Tanggal Faktur
    Bisnis.Util.DatePicker.render('#dtBookedAt, #dtInvoicedAt');
    // End Tanggal Booking, Tanggal Faktur

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
                        document.querySelector('[name="basePrice"]').value = data[0]['price'];
                    } else {
                        document.querySelector('[name="basePrice"]').value = '0';
                    }
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

    // Edisi Terbit
    Bisnis.Util.Event.bind('click','#edisiTerbitButton', function () {
        Bisnis.Util.Dialog.showModal('#edisiTerbitModal');
        chooseDates();
        Bisnis.Util.Event.bind('click', '.btn-remove-date', function () {
            if(this.closest('td').getElementsByTagName('input')[0].value) {
                this.closest('tr').remove();
            }
        });
        jQuery('#rangeDates').datepicker({
            format: "dd/mm/yyyy",
            todayBtn: "linked",
            clearBtn: true,
            language: "id"
        });
        checkDays();
    });

    var chooseDates = function () {
        jQuery('.choose-date').datetimepicker({
            locale: 'id',
            format: 'DD/MM/YYYY',
            ignoreReadonly: true
        }).on('dp.hide', function(e){
            var tgl = e.date.format('YYYY-MM-DD HH:mm:ss');
            jQuery(this).next().val(tgl);
        }).on('dp.hide', function(e){
            if(jQuery(this).closest('tr').is(':last-child') && !jQuery(this).closest('tr').children('input.pilih-tanggal').val()) {
                jQuery('<tr><td style="position: relative;"><input readonly type="text" class="choose-date form-control"><input type="hidden" name="tanggal[]"><button type="button" class="btn-remove-date btn btn-danger btn-flat btn-xs pull-right" style="position: absolute;right: 14px;top: 14px;">Hapus</button></td></tr>')
                    .insertAfter(jQuery('#edisiTanggal tr').last());
                chooseDates();
            }
        });
    };

    var checkDays = function () {
        // https://www.sanwebe.com/2014/01/how-to-select-all-deselect-checkboxes-jquery
        Bisnis.Util.Event.bind('change', '#checkAllDay', function () {
            var checkBox = document.querySelectorAll('#edisiHari #hari input[type="checkbox"]');
            var $this = this;
            checkBox.forEach(function (value) {
                value.checked = $this.checked;
            });
        });

        Bisnis.Util.Event.bind('change', '#edisiHari #hari input[type="checkbox"]', function () {
            if(false === this.checked){
                document.querySelector("#checkAllDay").checked = false; //change "select all" checked status to false
            }
            if (document.querySelectorAll('#edisiHari #hari input[type="checkbox"]:checked').length === document.querySelectorAll('#edisiHari #hari input[type="checkbox"]').length ){
                document.querySelector("#checkAllDay").checked = true;
            }
        });
    };

    Bisnis.Util.Event.bind('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        var edisi = e.target.getAttribute('data-edisi');
        document.querySelector('#save-edisi-terbit').innerText = 'SIMPAN BERDASARKAN ' + edisi;
    });

    var edisiTanggal = function () {
        var data = Bisnis.Util.Form.serializeArray('#edisiTanggal form');
        var dates = [];
        data.forEach(function (value) {
            if (value.value) {
                dates.push(window.moment(value.value).format("YYYY-MM-DD"));
            }
        });

        return Bisnis.Util.Form.rmArrayDuplicates(dates);
    };

    var toISODate = function (milliseconds) {
        var date = new Date(milliseconds);
        var y = date.getFullYear()
        var m = date.getMonth() + 1;
        var d = date.getDate();
        m = (m < 10) ? '0' + m : m;
        d = (d < 10) ? '0' + d : d;
        return [y, m, d].join('-');
    };

    var parseDate = function (date) {
        var parts = date.split('-');
        return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
    };

    var getDayDatesFromRange = function (startDate, endDate, dayToSearch) {
        startDate = parseDate(startDate);
        endDate = parseDate(endDate);

        var week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        var dayIndex = week.indexOf( dayToSearch );

        var dates = [];
        while ( startDate.getTime() <= endDate.getTime() )
        {
            if (startDate.getDay() === dayIndex )
            {
                var time = startDate.getTime();
                time = toISODate(time);
                dates.push(window.moment(time).format("YYYY-MM-DD"));
            }

            startDate.setDate(startDate.getDate() + 1);
        }
        return dates;
    };

    var edisiHari = function () {
        var startDate = document.querySelector('#startDate');
        var endDate = document.querySelector('#endDate');
        if (startDate.value && endDate.value) {
            startDate = window.moment(startDate.value, 'DD/MM/YYYY').format('YYYY-MM-DD');
            endDate = window.moment(endDate.value, 'DD/MM/YYYY').format('YYYY-MM-DD');

            var ahad = [];
            var senin = [];
            var selasa = [];
            var rabu = [];
            var kamis = [];
            var jumat = [];
            var sabtu = [];

            if (document.querySelector('#hari #ahad').checked === true) {
                ahad = getDayDatesFromRange(startDate, endDate, 'Sun');
            }

            if (document.querySelector('#hari #senin').checked === true) {
                senin = getDayDatesFromRange(startDate, endDate, 'Mon');
            }

            if (document.querySelector('#hari #selasa').checked === true) {
                selasa = getDayDatesFromRange(startDate, endDate, 'Tue');
            }

            if (document.querySelector('#hari #rabu').checked === true) {
                rabu = getDayDatesFromRange(startDate, endDate, 'Wed');
            }

            if (document.querySelector('#hari #kamis').checked === true) {
                kamis = getDayDatesFromRange(startDate, endDate, 'Thu');
            }

            if (document.querySelector('#hari #jumat').checked === true) {
                jumat = getDayDatesFromRange(startDate, endDate, 'Fri');
            }

            if (document.querySelector('#hari #sabtu').checked === true) {
                sabtu = getDayDatesFromRange(startDate, endDate, 'Sat');
            }

            return Bisnis.Util.Form.rmArrayDuplicates(ahad.concat(senin, selasa, rabu, kamis, jumat, sabtu));
        }
    };

    Bisnis.Util.Event.bind('click', '#save-edisi-terbit', function () {
        var edisi = document.querySelector('#edisiTerbitModal .nav-tabs li.active a').getAttribute('data-edisi');
        var totalTgl = '';
        if ( edisi === 'TANGGAL' ) {
            totalTgl = edisiTanggal().length;
        } else if ( edisi === 'HARI' ) {
            totalTgl = edisiHari().length;
        }

        document.querySelector('input[name="totalPost"]').value = totalTgl;
        console.log(getBiaya());
    });
    // End Edisi Terbit

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
    var getMinDiscount = function () {
        var minDiscountPercentage = document.querySelector('[name="minDiscountPercentage"]').value;
        var minDiscount = ( getBiaya() * minDiscountPercentage) / 100;
        document.querySelector('[name="minDiscountValue"]').value = Bisnis.Util.Money.format(minDiscount);
        return minDiscount;
    };
    // End Min Diskon

    // Plus Diskon
    var getPlusDiscount = function () {
        var surchargePercentage = document.querySelector('[name="surchargePercentage"]').value;
        var biaya = getBiaya() - getMinDiscount();
        var plusDiscount = ( biaya * surchargePercentage) / 100;
        document.querySelector('[name="surchargeValue"]').value = Bisnis.Util.Money.format(plusDiscount);
        return plusDiscount;
    };
    // End Plus Diskon

    // Harga
    var getHarga = function () {
        return getBiaya() - getMinDiscount() + getPlusDiscount();
    };
    // End Harga

    // Diskon
    var getDiscount = function () {
        var discountPercentage = document.querySelector('[name="discountPercentage"]').value;
        var biaya = getBiaya() - getMinDiscount();
        var discount = ( biaya * discountPercentage) / 100;
        document.querySelector('[name="discountValue"]').value = Bisnis.Util.Money.format(discount);
        return discount;
    };
    // End Diskon

    // Cash Back
    var getCashBack = function () {
        var cashBackPercentage = document.querySelector('[name="cashBackPercentage"]').value;
        var biaya = getBiaya() - getMinDiscount() - getDiscount();
        var cashBack = ( biaya * cashBackPercentage) / 100;
        document.querySelector('[name="cashBackValue"]').value = Bisnis.Util.Money.format(cashBack);
        return cashBack;
    };
    // End Cash Back

    // Total
    var getTotal = function () {
        return getHarga() - getDiscount() - getCashBack();
    };
    // End Total

    // PPN
    var getPPN = function () {
        var ppn = (getTotal() * 10) / 100;
        document.querySelector('[name="taxValue"]').value = Bisnis.Util.Money.format(ppn);
        return ppn;
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

    Bisnis.Util.Event.bind('input', '[name="jumlahBayar"]', function () {
        console.log( getNetto() );
    });

    Bisnis.Util.Event.bind('input', '[name="milimeterSize"]', function () {
        console.log( getNetto() );
    });

    Bisnis.Util.Event.bind('input', '[name="basePrice"]', function () {
        console.log( getNetto() );
    });

    Bisnis.Util.Event.bind('input', '[name="surchargePercentage"]', function () {
        console.log( getNetto() );
    });

    Bisnis.Util.Event.bind('input', '[name="minDiscountPercentage"]', function () {
        console.log( getNetto() );
    });

    Bisnis.Util.Event.bind('input', '[name="discountPercentage"]', function () {
        console.log( getNetto() );
    });

    Bisnis.Util.Event.bind('input', '[name="cashBackPercentage"]', function () {
        console.log( getNetto() );
    });

    Bisnis.Util.Event.bind('input', '[name="quantity"]', function () {
        console.log( getNetto() );
    });

})(window.Bisnis || {});