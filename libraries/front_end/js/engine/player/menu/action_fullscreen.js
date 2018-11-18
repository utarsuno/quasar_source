'use strict';

$_QE.prototype.PlayerMenuRowFullScreen = function(menu) {

    if (QE.flag_is_on(QEFLAG_STATE_FULLSCREEN)) {
        this.__init__(menu, ASSET_ICON_EXPAND, 'exit full-screen', this._action_fullscreen.bind(this));
    } else {
        this.__init__(menu, ASSET_ICON_EXPAND, 'enter full-screen', this._action_fullscreen.bind(this));
    }

    let self = this;
    this.button.set_event(ELEMENT_EVENT_ON_LOOK_AT, function() {
        self.row.parent_wall.on_main_menu_button_look_at(self.button);
    });
};

Object.assign(
    $_QE.prototype.PlayerMenuRowFullScreen.prototype,
    $_QE.prototype.PlayerMenuRow.prototype,
    {
        _action_fullscreen: function() {
            if (QE.flag_is_on(QEFLAG_STATE_FULLSCREEN)) {
                QE.exit_fullscreen();
                this.text.update_text('enter full-screen');
            } else {
                QE.enter_fullscreen();
                this.text.update_text('exit full-screen');
            }
        },
    }
);
