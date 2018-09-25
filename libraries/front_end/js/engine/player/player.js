'use strict';

$_QE.prototype.Player = function(engine) {
    this.engine = engine;
    this.client = engine.client;

    $_QE.prototype.PlayerState.call(this);

    this.initialize_player_controls = function() {
        this.camera = this.engine.manager_renderer.camera;
        $_QE.prototype.FPSControls.call(this);
    };

};
