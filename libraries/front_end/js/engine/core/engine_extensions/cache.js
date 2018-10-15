'use strict';

Object.assign($_QE.prototype, {
    CACHE_ZERO_VECTOR: new THREE.Vector3(0, 0, 0),
    //CACHE_UP_VECTOR: new THREE.Vector3(0, 1, 0),

    // Cache.
    _frames_passed  : 0,
    _frame_iteration: 0,
    _delta_clock    : new THREE.Clock(false),
    _delta          : 0,

    pause_engine: function() {
        this.player.set_state(PLAYER_STATE_PAUSED);
    },

    resume: function() {
        this.manager_hud.hide_pause_menu();
        if (!this.client.is_feature_enabled(CLIENT_FEATURE_MOBILE)) {
            this.client.mouse_lock();
        }
    },

    on_pause: function() {
        this.manager_hud.show_paused();

        this._engine_elapsed_time_physics = 0.0;
        this._engine_elapsed_time_render  = 0.0;
        this._engine_elapsed_time_logic   = 0.0;
        this._engine_elapsed_time_second  = 0.0;

        this._engine_frame_counter_render = 0;
    },
});
