'use strict';

$_QE.prototype.PlayerMenuRowFullScreen = function(menu) {

    if (QE.get_flag(ENGINE_STATE_FULL_SCREEN)) {
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
            if (QE.get_flag(ENGINE_STATE_FULL_SCREEN)) {
                QE.exit_fullscreen();
                this.text.update_text('enter full-screen');
            } else {
                QE.enter_fullscreen();
                this.text.update_text('exit full-screen');
            }
        },
    }
);
