(function (Bisnis) {
    var notify = function (domain, message, callback) {
        jQuery.notify(message, {
            title: domain
        }).click(function(){
            location.href = "/notifications";
        });

        callback();
    };

    Bisnis.Notification.send = function (domain, receiver, sender, message, callback) {
        Bisnis.request({
            module: 'notifications',
            method: 'post',
            params: [
                { name: 'domain', value: domain },
                { name: 'receiver', value: receiver },
                { name: 'sender', value: sender },
                { name: 'message', value: message }
            ]
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                callback(JSON.parse(response));
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Notification.read = function(notificationId, callback) {
        Bisnis.request({
            module: 'notifications/' + notificationId,
            method: 'put',
            params: [
                { name: 'read', value: true }
            ]
        }, function () {
            if (Bisnis.validCallback(callback)) {
                callback();
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Notification.notify = function(notificationId, callback) {
        Bisnis.request({
            module: 'notifications/' + notificationId,
            method: 'put',
            params: [
                { name: 'notify', value: true }
            ]
        }, function () {
            if (Bisnis.validCallback(callback)) {
                callback();
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Notification.needToBroadcast = function (userId, callback) {
        Bisnis.request({
            module: 'notifications',
            method: 'get',
            params: [{
                'receiver': userId,
                'notify': false,
                'read': false
            }]
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                var rawData = JSON.parse(response);
                callback(rawData['hydra:member']);
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Notification.enableTo = function (userId) {
        setInterval(function() {
            Bisnis.Notification.needToBroadcast(userId, function (notifications) {
                Bisnis.each(function (idx, notification) {
                    notify(notification.domain, notification.message, function () {
                        Bisnis.Notification.notify(notification.id);
                    });
                }, notifications);
            });
        }, 7000);
    };
})(window.Bisnis || {});