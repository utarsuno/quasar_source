'use strict';

$_QE.prototype.HUDManager = function(engine) {
    this.engine       = engine;
    this.hud_elements = [];

    this.pause_menu.set_display_style('table');

    this._add_hud_element = function(hud_element) {
        this.hud_elements.push(hud_element);
    };

    this.initialize = function() {
        this.application = this.engine.application;
        this.hud_debug   = new $_QE.prototype.GUI2DDebugInformation(this.engine);
        this.hud_chat    = new $_QE.prototype.GUI2DMessageLogs(32);
        this.hud_typing  = new $_QE.prototype.GUI2DPlayerTypingInput(this.application);

        this._add_hud_element(this.engine.manager_world.player_cursor);
        this._add_hud_element(this.hud_debug);
        this._add_hud_element(this.hud_chat);
        this._add_hud_element(this.hud_typing);
    };

    this.update = function(delta) {
        let i;
        for (i = 0; i < this.hud_elements.length; i++) {
            if (this.hud_elements[i].content_update != null) {
                this.hud_elements[i].content_update();
            }
            this.hud_elements[i].update();
        }
    };

};
