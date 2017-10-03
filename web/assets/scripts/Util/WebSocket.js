(function (Bisnis) {
    var webSocket = null;

    Bisnis.WebSocket.create = function (address) {
        if (null === webSocket) {
            webSocket =  new WebSocket('ws://' + address);
        }
    };

    Bisnis.WebSocket.push = function (message) {
        webSocket.send(message);
    };

    Bisnis.WebSocket.ping = function () {
        webSocket.send('PING:PING');
    };

    Bisnis.WebSocket.close = function () {
        webSocket.close();
    };

    Bisnis.WebSocket.handle = function (openCallback, messageCallback) {
        webSocket.onopen = function (e) {
            if (Bisnis.validCallback(openCallback)) {
                openCallback(e);
            }
        };

        webSocket.onmessage = function(e) {
            if (Bisnis.validCallback(messageCallback)) {
                messageCallback(JSON.parse(e.data));
            }
        };
    };
    
    Bisnis.WebSocket.serve = function (openCallback, messageCallback, address) {
        Bisnis.WebSocket.create(address);
        Bisnis.WebSocket.handle(openCallback, messageCallback);
    };
})(window.Bisnis || {});