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

    var createOnlineBadge = function (totalOnline, selector) {
        var targetSelector = selector.replace('.', '_');
        targetSelector = targetSelector.replace('#', '_');
        var badge = '<a href="#" class="notif' + targetSelector + '"><i class="fa fa-user-o"></i><span class="label label-primary">' + totalOnline + ' User Online</span></a>';
        Bisnis.Util.Document.putHtml(selector, badge);
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

    Bisnis.Notification.send = function (domain, receiver, sender, message) {
        Bisnis.WebSocket.push('MESSAGE:' + domain + '#' + receiver + '#' + sender + '#' + message);
    };

    Bisnis.Notification.read = function(notificationId, callback) {
        Bisnis.request({
            module: 'notifications/' + notificationId,
            method: 'put',
            params: [
                { name: 'read', value: true }
            ]
        }, function () {
            Bisnis.WebSocket.ping();
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
            Bisnis.WebSocket.ping();
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

    Bisnis.Notification.enableTo = function (userId, notificationSelector, onlineSelector, clickNotificationCallback) {
        var totalUnread = 0;
        Bisnis.WebSocket.serve(function () {
            Bisnis.WebSocket.push('START:'+ userId);
        }, function (data) {
            Bisnis.each(function (idx, notification) {
                if (notification.receiver === userId) {
                    if (false === notification.notify) {
                        console.log(notification.id);
                        notify(notification.domain, notification.message, function () {
                            Bisnis.Notification.notify(notification.id);
                        }, clickNotificationCallback);
                    }

                    if (false === notification.read) {
                        totalUnread = totalUnread + 1;
                    }
                }
            }, data.messages);

            if (0 < totalUnread) {
                createNotificationBadge(totalUnread, notificationSelector);
                totalUnread = 0;
            } else {
                Bisnis.Util.Document.putHtml(notificationSelector, '');
            }

            createOnlineBadge(data.online, onlineSelector);
        }, Bisnis.BACKEND_HOST + ':7777');
    };
})(window.Bisnis || {});