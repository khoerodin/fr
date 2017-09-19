Bisnis.init(function () {

    var pageParams = {
        module: 'users',
        elm: '#aeGrid',
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
            }
        ],
        buttons: [
            {
                btnContent: '<i class="fa fa-pencil"></i>',
                btnClass: 'btn btn-xs btn-flat btn-default'
            },
            {
                btnContent: '<i class="fa fa-times"></i>',
                btnClass: 'btn btn-xs btn-flat btn-default'
            },
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
