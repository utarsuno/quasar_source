$_QE.prototype.PlayerMenuRowFullScreen = function(menu) {
    if (QE.flag_is_on(QEFLAG_STATE_FULLSCREEN)) {
        this.__init__(menu, ASSET_ICON_EXPAND, 'exit full-screen', this._action_fullscreen.bind(this));
    } else {
        this.__init__(menu, ASSET_ICON_EXPAND, 'enter full-screen', this._action_fullscreen.bind(this));
    }
};

Object.assign(
    $_QE.prototype.PlayerMenuRowFullScreen.prototype,
    $_QE.prototype.PlayerMenuRow.prototype,
    {
        _action_fullscreen: function() {
            if (QE.flag_is_on(QEFLAG_STATE_FULLSCREEN)) {
                QE.fullscreen_exit();
                this.text.update_text('enter full-screen');
            } else {
                QE.fullscreen_enter();
                this.text.update_text('exit full-screen');
            }
        },
    }
);
