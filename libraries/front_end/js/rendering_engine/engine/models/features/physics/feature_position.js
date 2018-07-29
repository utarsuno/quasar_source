'use strict';

$_QE.prototype.FeaturePosition = function(world) {

    this.object3D = new THREE.Object3D();
    this.object3D.matrixAutoUpdate = false;
    this.world    = world;
    this.world.add_to_scene(this.object3D);

    this.offset_horizontal_distance   = 0;
    this.offset_horizontal_percentage = 0;
    this.offset_vertical_distance     = 0;
    this.offset_vertical_percentage   = 0;
    this.offset_depth_distance        = 0;

    $_QE.prototype.FeatureNormal.call(this);

    // For optimization.
    this._position_offset = new THREE.Vector3(0, 0, 0);
    this._look_at_position = new THREE.Vector3(0, 0, 0);

    /*__   __   ___  __       ___    __        __
     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this.refresh_for_render = function() {
        this._refresh_look_at();
        this.refresh_matrix();
    };

    // WARNING : This is recursive. Change the design later.
    this.refresh_for_render_recursively = function() {
        let p = this.get_position();

        let a;
        for (a = 0; a < this.attachments.length; a++) {
            this.attachments[a].set_position(p.x, p.y, p.z);
            this.attachments[a].refresh_for_render();
            if (this.attachments[a].length > 0) {
                this.attachments[a].refresh_for_render_recursively();
            }
        }
    };

    this.refresh_matrix = function() {
        this.object3D.updateMatrix();
        this.object3D.matrixWorldNeedsUpdate = true;
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_position = function(x, y, z) {
        if (this.is_root_attachment()) {
            this.object3D.position.set(x, y, z);
        } else {
            this.calculate_xy_offset();
            this.object3D.position.set(x + this._position_offset.x, y + this._position_offset.y, z + this._position_offset.z);
        }
    };

    this.calculate_xy_offset = function() {
        let dy = this.offset_vertical_distance;
        let normal = this.get_normal();
        let left_right = this.get_left_right();
        let magnitude = this.offset_horizontal_distance;
        if (this.offset_horizontal_percentage !== 0) {
            magnitude += this.attachment_parent.width * this.offset_horizontal_percentage;
        }
        // TODO : WARNING : For now this only supports y-normals of 0.
        if (this.offset_vertical_percentage !== 0) {
            dy += this.offset_vertical_percentage * this.attachment_parent.height;
        }
        if (this.offset_depth_distance !== 0) {
            this._position_offset.set(
                (left_right.x * magnitude) + (normal.x * this.offset_depth_distance),
                (left_right.y * magnitude) + (normal.y * this.offset_depth_distance) + dy,
                (left_right.z * magnitude) + (normal.z * this.offset_depth_distance));
        } else {
            this._position_offset.set(
                left_right.x * magnitude,
                left_right.y * magnitude + dy,
                left_right.z * magnitude);
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_horizontal_distance_to_center = function(x, z) {
        return Math.sqrt((x - this.object3D.position.x) * (x - this.object3D.position.x) + (z - this.object3D.position.z) * (z - this.object3D.position.z));
        //return sqrt(squared(x - this.object3D.position.x) + squared(z - this.object3D.position.z));
    };

    this.get_parent_position = function() {
        return this.attachment_parent.object3D.position;
    };

    this.get_position = function() {
        return this.object3D.position;
    };

};