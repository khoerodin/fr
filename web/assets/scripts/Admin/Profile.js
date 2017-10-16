(function (Bisnis) {
    Bisnis.Admin.Profile = {};

    Bisnis.Util.Event.bind('click', '#update-profile', function () {
        document.querySelector('#update-profile').disabled = true;
        Bisnis.Util.Grid.removeErrorForm('form-profile');

        var id = document.querySelector('input#userId').value;
        var params = Bisnis.Util.Form.serializeArray('#form-profile');

        Bisnis.Admin.Users.updateById(id, params,
            function (dataResponse) {
                document.querySelector('#fullname').value = dataResponse.fullname;
                document.querySelector('#email').value = dataResponse.email;
                document.querySelector('#username').value = dataResponse.username;
                toastr.success('Berhasil memperbarui profil');
                document.querySelector('#update-profile').disabled = false;
                document.querySelector('#plainPassword').value = '';

                if ( document.querySelector('#plainPassword').value ) {
                    document.querySelector('#update-profile').disabled = true;
                    var params = [ { name : 'plainPassword', value : document.querySelector('#plainPassword').value } ]
                    Bisnis.Admin.Users.changePassword(params,
                        function () {
                            toastr.success('Berhasil memperbarui Sandi');
                            document.querySelector('#update-profile').disabled = false;
                            document.querySelector('#plainPassword').value = '';
                        },
                        function () {
                            Bisnis.Util.Dialog.alert('PERHATIAN', 'GAGAL MEMPERBARUI SANDI');
                            document.querySelector('#update-profile').disabled = false;
                            document.querySelector('#plainPassword').value = '';
                        }
                    );
                }
            },
            function (response) {
                if (response.responseJSON) {
                    Bisnis.Util.Grid.validate('form-profile', response.responseJSON.violations);
                }
                document.querySelector('#update-profile').disabled = false;
                document.querySelector('#plainPassword').value = '';
            }
        );
    });

    $(document).on('keypress', '#form-profile input', function (e) {
        if (e.which === 13) {
            Bisnis.Util.Event.triggerClick('#update-profile');
            return false;
        }
    });

    var readFile = function() {

        if (this.files && this.files[0]) {

            var FR= new FileReader();

            FR.addEventListener("load", function(e) {
                document.querySelector('#profile-image').style.backgroundImage = 'url('+e.target.result+')';
                var dataExt = e.target.result.split(';')[0];
                dataExt = dataExt.split(':')[1];

                var imgExt = dataExt.split('/')[1];
                var imgString = e.target.result.split(',')[1];
                document.querySelector('input[name="imageExtension"]').value = imgExt;
                document.querySelector('input[name="imageString"]').value = imgString;
            });

            FR.readAsDataURL( this.files[0] );
        }

    };

    document.getElementById("file-image").addEventListener("change", readFile);
})(window.Bisnis || {});