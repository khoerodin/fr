(function (Bisnis) {
    Bisnis.Helpdesk.Staff = {};

    Bisnis.Helpdesk.Staff.fetchByCategory = function (categoryId, callback) {
        Bisnis.request({
            module: 'helpdesk/staffs',
            method: 'get',
            params: [{'category.id' : categoryId}]
        }, function (response) {
            var rawData = JSON.parse(response);
            var staffList = rawData['hydra:member'];

            if (Bisnis.validCallback(callback)) {
                callback(staffList);
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Helpdesk.Staff.fetchByUser = function (userId, callback) {
        Bisnis.request({
            module: 'helpdesk/staffs',
            method: 'get',
            params: [{'user.id' : userId}]
        }, function (response) {
            var rawData = JSON.parse(response);
            var staffList = rawData['hydra:member'];

            if (Bisnis.validCallback(callback)) {
                callback(staffList);
            }
        }, function () {
            console.log('KO');
        });
    };

})(window.Bisnis || {});