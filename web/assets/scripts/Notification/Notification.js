(function (Bisnis) {
    var notify = function (domain, message, callback, clickCallback) {
        jQuery.notify(message, {
            title: domain
        }).click(function(){
            clickCallback();
        });

        callback();
    };

    var createNotificationBadge = function (totalNotification, selector) {
         var targetSelector = selector.replace('.', '_');
        targetSelector = targetSelector.replace('#', '_');
         var badge = '<a href="#" class="notif' + targetSelector + '"><i class="fa fa-comments-o"></i><span class="label label-success">' + totalNotification + '</span></a>';
         Bisnis.Util.Document.putHtml(selector, badge);
    };

    var needToNotify = function (userId, callback) {
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

    var unReadNotification = function (userId, callback) {
        Bisnis.request({
            module: 'notifications',
            method: 'get',
            params: [{
                'receiver': userId,
                'read': false
            }]
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                var rawData = JSON.parse(response);
                callback(rawData);
            }
        }, function () {
            console.log('KO');
        });
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

    Bisnis.Notification.fetch = function(notificationId, callback) {
        Bisnis.request({
            module: 'notifications/' + notificationId,
            method: 'get',
            params: []
        }, function (response) {
            if (Bisnis.validCallback(callback)) {
                callback(JSON.parse(response));
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

    Bisnis.Notification.readAll = function(userId, callback) {
        Bisnis.request({
            module: 'notifications/' + userId + '/read-all.json',
            method: 'put',
            params: []
        }, function () {
            if (Bisnis.validCallback(callback)) {
                callback();
            }
        }, function () {
            console.log('KO');
        });
    };

    Bisnis.Notification.unread = function (userId, callback) {
        unReadNotification(userId, function (response) {
            if (Bisnis.validCallback(callback)) {
                callback(response['hydra:member']);
            }
        });
    };

    Bisnis.Notification.enableTo = function (userId, badgeSelector, clickNotificationCallback) {
        setInterval(function() {
            needToNotify(userId, function (notifications) {
                Bisnis.each(function (idx, notification) {
                    notify(notification.domain, notification.message, function () {
                        Bisnis.Notification.notify(notification.id);
                    }, clickNotificationCallback);
                }, notifications);
            });

            unReadNotification(userId, function (response) {
                var totalUnRead = response['hydra:totalItems'];
                if (0 < totalUnRead) {
                    createNotificationBadge(totalUnRead, badgeSelector);
                } else {
                    Bisnis.Util.Document.putHtml(badgeSelector, '');
                }
            });
        }, 7000);
        // var conn = new WebSocket('ws://localhost:8080');
        // conn.onopen = function(e) {
        //     console.log(e);
        //     conn.send(userId);
        // };
        //
        // conn.onmessage = function(e) {
        //     console.log(e.data);
        // };
    };
})(window.Bisnis || {});