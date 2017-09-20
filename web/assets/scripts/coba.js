Bisnis.init(function () {

    var pageParams = {
        module: 'users',
        elm: '#usersGrid',
        columns: [
            {
                header: 'Nama',
                field: 'fullname',
                type: 'text'
            },
            {
                header: 'Username',
                field: 'username',
                type: 'text'
            },
            {
                header: 'Email',
                field: 'email',
                type: 'text'
            },
            {
                header: '<span class="pull-right">Aksi</span>',
                custom: '<span class="pull-right">' +
                '<button class="btn btn-xs btn-flat btn-default"><i class="fa fa-pencil"></i></button>' +
                '<button class="btn btn-xs btn-flat btn-default"><i class="fa fa-times"></i></button>' +
                '</span>',
                width: '5%'
            }
        ],
        search: {
            placeholder: 'CARI USERNAME / EMAIL',
            fields: ['username', 'email']
        }
    };

    Bisnis.Advertising.Coba.fetch(pageParams, null,
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
});
