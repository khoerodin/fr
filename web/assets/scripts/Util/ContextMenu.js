(function (Bisnis) {
    Bisnis.Util.ContextMenu = {};

    Bisnis.Util.ContextMenu.create = function (selector, params) {
        params.menuEvent = 'right-click';
        params.menuSource = 'element';

        new BootstrapMenu(selector, params);
    };
})(window.Bisnis || {});