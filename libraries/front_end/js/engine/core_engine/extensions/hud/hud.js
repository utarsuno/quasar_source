'use strict';

Object.assign($_QE.prototype,
    {
        __init__hud: function() {
            this.hud_debug     = new $_QE.prototype.HUDDebug().__init__(this);
            this.hud_chat      = new $_QE.prototype.HUDLogs().__init__(32);
            this.hud_typing    = new $_QE.prototype.HUDUserTyping().__init__(this.application);
            this.hud_date_time = new $_QE.prototype.HUDDateTime().__init__(this);
        },

        hud_update: function(delta) {
            this.hud_debug.content_update();
            this.manager_world.player_cursor.update();

            this._update_pause_menu(delta);
        },

        hud_render: function() {
            this.hud_debug.update();
            //this.hud_date_time.update();
            this.hud_typing.update();
            this.hud_chat.update();
        },
    }
);
