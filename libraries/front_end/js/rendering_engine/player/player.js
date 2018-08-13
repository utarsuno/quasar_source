'use strict';

$_QE.prototype.Player = function(client, engine) {
    this.client = client;
    this.engine = engine;
    $_QE.prototype.PlayerState.call(this);

    this.initialize_player_controls = function() {
        $_QE.prototype.FPSControls.call(this);
    };

};
