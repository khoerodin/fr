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
            if (data === false) {
                document.getElementById('aeGridAddBtn').removeAttribute("disabled");
            } else {
                document.getElementById('aeGridAddBtn').setAttribute("disabled", "disabled");
            }
        },
        function (data) {
            // selected callback
            console.log(data)
        },
        function (data) {
            // open input callback
            if (data) {
                document.getElementById('aeGridAddBtn').setAttribute("disabled", "disabled");
            }
        },
        function (data) {
            // close input callback
            if (data) {
                document.getElementById('aeGridAddBtn').setAttribute("disabled", "disabled");
            }
        }
    );
});
