'use strict';

$_QE.prototype.HUDManager = function(engine) {
    this.engine       = engine;
    this.hud_elements = [];
    this.pause_menu.set_display_style('table');
};

Object.assign($_QE.prototype.HUDManager.prototype,
    {
        _add_hud_element: function(hud_element) {
            this.hud_elements.push(hud_element);
        },

        initialize: function() {
            this.application = this.engine.application;
            this.hud_debug   = new $_QE.prototype.HUDDebug().__init__(this.engine);
            this.hud_chat    = new $_QE.prototype.HUDLogs().__init__(32);
            this.hud_typing  = new $_QE.prototype.HUDUserTyping().__init__(this.application);

            this._add_hud_element(this.engine.manager_world.player_cursor);
            this._add_hud_element(this.hud_debug);
            this._add_hud_element(this.hud_chat);
            this._add_hud_element(this.hud_typing);
        },

        update: function(delta) {
            let i;
            for (i = 0; i < this.hud_elements.length; i++) {
                if (this.hud_elements[i].content_update != null) {
                    this.hud_elements[i].content_update();
                }
                if (this.hud_elements[i].update != null) {
                    this.hud_elements[i].update();
                } else {
                    l(this.hud_elements[i]);
                }
            }
        },
    }
);

