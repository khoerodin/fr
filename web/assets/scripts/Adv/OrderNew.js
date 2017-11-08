(function (Bisnis) {
    Bisnis.Adv.OrderNew = {};

    // Tanggal Booking, Tanggal Faktur
    Bisnis.Util.DatePicker.render('#dtBookedAt, #dtInvoicedAt');
    // End Tanggal Booking, Tanggal Faktur

    // Perwakilan
    var repParams = {
        placeholder: 'CARI PERWAKILAN',
        module: 'representatives',
        prependValue: '/api/representatives/',
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
            totalTgl = edisiTanggal();
        } else if ( edisi === 'HARI' ) {
            totalTgl = edisiHari();
        }

        Bisnis.Util.Storage.store('edisiTerbit', JSON.stringify(totalTgl));
        document.querySelector('input[name="totalPost"]').value = totalTgl.length;
    });
    // End Edisi Terbit

    // Klik Simpan
    Bisnis.Util.Event.bind('click', '#btn-order', function () {
        var thisBtn = this;
        thisBtn.disabled = true;

        var params = Bisnis.Util.Form.serializeArray('#orderForm');
        const selectedTags = document.querySelectorAll('[name="orderTag"] option:checked');
        const values = Array.from(selectedTags).map((el) => el.value);

        params.push({
            name: 'orderTag',
            value: values.toString()
        });

        var fields = [
            'basePrice',
            'taxValue',
            'minDiscountValue',
            'surchargeValue',
            'discountValue',
            'cashBackValue',
            'totalAmount',
        ];

        params = Bisnis.Util.Form.unFormatMoney(fields, params);
        var dateFields = ['bookedAt', 'invoicedAt'];
        params = Bisnis.Util.Form.formatDate(dateFields, params, 'DD/MM/YYYY');

        Bisnis.Adv.Orders.add(params,
            function (dataResponse) {
                var publishDates = JSON.parse(Bisnis.Util.Storage.fetch('edisiTerbit'));
                var params = {
                    tanggal: publishDates,
                    orderId: dataResponse.id
                };
                Bisnis.request(params,
                    function () {
                        Bisnis.Util.Dialog.alert('SUKSES', 'ORDER IKLAN BERHASIL DIBUAT', function () {
                            window.location.href = '/advertising/orders/new';
                        });
                    },
                    function () {
                        Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MENYIMPAN EDISI TERBIT (JUMLAH TERBIT)');
                    },
                    '/advertising/orders/publish-ads'
                );
            },
            function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('orderForm', response.responseJSON.violations);
                }
                thisBtn.disabled = false;
            }
        );
    })
    // End Klik Simpan
})(window.Bisnis || {});