'use strict';

$_QE.prototype.WorldElements = function() {

    this.currently_looked_at_object = null;

    this.look_away_from_currently_looked_at_object = function() {
        this.currently_looked_at_object.look_away();
        if (is_defined(this.currently_looked_at_object.uses_cursor)) {
            if (this.currently_looked_at_object.uses_cursor) {
                this.floating_cursor.detach();
            }
        }
        this.currently_looked_at_object = null;
    };

    this.look_at_currently_looked_at_object = function(have_player_camera_look_at, set_cursor) {
        if (is_defined(this.currently_looked_at_object.tab_parent)) {
            this.manager_world.current_world.set_default_tab_target(this.currently_looked_at_object.tab_parent);
        }
        if (have_player_camera_look_at) {
            this.player.look_at(this.currently_looked_at_object.object3D.position);
        }
        if (set_cursor) {
            this.floating_cursor.attach(this.currently_looked_at_object);
        }
        this.currently_looked_at_object.look_at();
    };
};