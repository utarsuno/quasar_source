'use strict';

$_QE.prototype.PlayerMenuRowClose = function(menu) {
    this.__init__(menu, ASSET_ICON_CROSS, 'close', this._action_close.bind(this));
};

Object.assign(
    $_QE.prototype.PlayerMenuRowClose.prototype,
    $_QE.prototype.PlayerMenuRow.prototype,
    {
        _action_close: function() {
            this._parent_menu._on_exit();
        },
    }
);
