'use strict';

$_QE.prototype.FeatureOutlineGlow = function(on_look_at, on_look_away, on_engage, on_disengage) {

    this.on_look_at   = on_look_at;
    this.on_look_away = on_look_away;
    this.on_engage    = on_engage;
    this.on_disengage = on_disengage;

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    this.state_change_look_at = function(being_looked_at) {
        if (being_looked_at) {
            if (is_defined(this.on_look_at)) {
                this.on_look_at();
            }
            QE.manager_renderer.outline_glow.set_hover_object(this.object3D);
        } else {
            if (is_defined(this.on_look_away)) {
                this.on_look_away();
            }
            QE.manager_renderer.outline_glow.remove_hover_object(this.object3D);
        }
    };

    this.state_change_engage = function(being_engaged_with) {
        if (being_engaged_with) {
            if (is_defined(this.on_engage)) {
                this.on_engage();
            }
            QE.player.set_state(PLAYER_STATE_ENGAGED);
            QE.manager_renderer.outline_glow.set_to_engage_color();
        } else {
            if (is_defined(this.on_disengage)) {
                this.on_disengage();
            }
            QE.manager_renderer.outline_glow.set_to_hover_color();
        }
    };

};