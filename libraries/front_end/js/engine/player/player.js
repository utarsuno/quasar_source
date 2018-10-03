'use strict';

$_QE.prototype.Player = function(engine) {
    this.engine = engine;
    this.client = engine.client;
    let self    = this;

    $_QE.prototype.PlayerState.call(this);

    this.initialize_player_controls = function() {
        self.input_manager = self.engine.manager_input;
        self.camera        = self.engine.manager_renderer.camera;
        $_QE.prototype.FPSControls.call(self);
    };

};
