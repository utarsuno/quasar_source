'use strict';

$_QE.prototype.Player = function(engine) {
    this.engine     = engine;
    this._cache[10] = 27.5;
    this._cache[11] = 19.445436482630058;
    this._cache[12] = 0.025;
    // Somewhat the formula:  1.0 - this._decay;
    this._cache[13] = 0.55;

    // TEMPORARY LOCATION.
    this.is_walking = false;
    this._has_boundary = false;
    this._boundary_x_min = -1000;
    this._boundary_x_max = 1000;
    this._boundary_z_min = -1000;
    this._boundary_z_max = 1000;
};

Object.assign($_QE.prototype.Player.prototype, {

    // The first 9 values are used for the mouse.
    // Last 1 value is used for movement.
    _cache: new Float64Array(14),

    set_to_walking: function() {
        this.is_walking    = true;
        this._has_boundary = true;
    },

    set_to_flying: function() {
        this.is_walking    = false;
        this._has_boundary = false;
    },

    initialize_player_controls: function() {
        this.pitch.add(this.engine.camera);
        this.yaw.add(this.pitch);

        this._initialize_flashlight();
    },

    set_in_front_of_object: function(element, distance) {
        // Temporary.
        let p = element.get_world_position();
        let n = element.get_normal();
        this.set_position_xyz(
            p.x + n.x * distance,
            p.y + n.y * distance,
            p.z + n.z * distance
        );
        this.look_at(p);
    },

    set_object_in_front_of: function(element, distance, dx=0, dy=0, dz=0) {
        element.set_position(
            this.yaw.position.x + this._cache_normal.x * distance + dx,
            this.yaw.position.y + dy,
            this.yaw.position.z + this._cache_normal.z * distance + dz
        );
        element.update_element();
        element.look_at(
            this.yaw.position.x,
            this.yaw.position.y,
            this.yaw.position.z
        );
        element.update_element();
    },

    /*
     * pp: plane_position
     * pn: plane_normal
     */
    get_intersection_y_onto_plane: function(pp, pn) {
        let p = this.get_position();
        let n = this.get_normal();

        //let plane_d = pp.x * pn.x + pp.y * pn.y + pp.z * pn.z;
        //let t       = (plane_d - pn.x * p.x - pn.y * p.y - pn.z * p.z) / (pn.x * n.x + pn.y * n.y + pn.z * n.z);
        //let t         = ((pp.x * pn.x + pp.y * pn.y + pp.z * pn.z) - pn.x * p.x - pn.y * p.y - pn.z * p.z) / (pn.x * n.x + pn.y * n.y + pn.z * n.z);

        //return [p.x + n.x * t, p.y + n.y * t, p.z + n.z * t];
        //return p.y + n.y * t;
        return p.y + n.y * (((pp.x * pn.x + pp.y * pn.y + pp.z * pn.z) - pn.x * p.x - pn.y * p.y - pn.z * p.z) / (pn.x * n.x + pn.y * n.y + pn.z * n.z));
    },

});
