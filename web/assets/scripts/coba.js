Bisnis.init(function () {

    var pageParams = {
        module: 'advertising/account-executives',
        elm: '#usersGrid',
        columns: [
            {
                header: 'Kode',
                field: 'code',
                type: 'text'
            },
            {
                header: 'Nama',
                field: 'name',
                type: 'text'
            },
            {
                header: '<span class="pull-right">Aksi</span>',
                custom: '<span class="pull-right">' +
                '<button class="btn btn-xs btn-flat btn-default"><i class="fa fa-pencil"></i></button>' +
                '<button data-id="{{ id }}" class="btn-delete btn btn-xs btn-flat btn-default"><i class="fa fa-times"></i></button>' +
                '</span>',
                width: '5%'
            }
        ],
        search: {
            placeholder: 'CARI USERNAME / EMAIL',
            fields: ['name', 'code']
        }
    };

    Bisnis.SimpleGrid.fetch(pageParams, null,
        function (data) {
            // is has result
            // boolean
        },
        function (data) {
            // selected data callback
            // object
            // data.id
            // data.text
        },
        function (data) {
            // open input callback
            // boolean
        },
        function (data) {
            // close input callback
            // boolean
        }
    );

    Bisnis.Util.Event.bind('click', '.btn-delete', function (e) {
        var btnId = this.getAttribute('data-id');
        Bisnis.SimpleGrid.detailModal(

        );
    })
});
