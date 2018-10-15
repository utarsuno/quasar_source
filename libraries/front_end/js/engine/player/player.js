'use strict';

$_QE.prototype.Player = function(engine) {
    this.engine = engine;
    this.client = engine.client;

    this.initialize_player_controls = function() {
        this.input_manager = this.engine.manager_input;
        this.camera        = this.engine.manager_renderer.camera;

        this.pitch.add(this.camera);
        this.yaw.add(this.pitch);
    };

};
