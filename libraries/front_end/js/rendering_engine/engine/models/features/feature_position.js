'use strict';

$_QE.prototype.FeaturePosition = function(world) {

    this.object3D = new THREE.Object3D();
    this.world    = world;
    this.world.add_to_scene(this.object3D);

    this.manual_positioning = false;

    // For optimization.
    this._position_offset = new THREE.Vector3(0, 0, 0);
    this._look_at_position = new THREE.Vector3(0, 0, 0);

    /*__   __   ___  __       ___    __        __
     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    // WARNING : This is recursive. Change the design later.
    this.update_all_child_attachments = function() {
        let parent_position = this.get_position();

        let a;
        for (a = 0; a < this.attachments.length; a++) {
            this.attachments[a].set_position(parent_position.x, parent_position.y, parent_position.z, false);
            this.attachments[a]._refresh_look_at();

            if (this.attachments[a].manual_positioning) {
                this.attachments[a].object3D.updateMatrix();
                this.attachments[a].object3D.matrixWorldNeedsUpdate = true;
            }

            if (this.attachments.length > 0) {
                this.attachments[a].update_all_child_attachments();
            }
        }
    };

    this.refresh_position_and_look_at = function() {
        this._refresh_look_at();

        if (this.manual_positioning) {
            this.object3D.updateMatrix();
            this.object3D.matrixWorldNeedsUpdate = true;
        }

        this.update_all_child_attachments();

        if (is_defined(this.post_position_update)) {
            this.post_position_update();
        }
    };

    this.apply_delta_to_horizontal_offset = function(distance_offset, parent_width_percentage_offset) {
        if (is_defined(this.offset_horizontal_distance)) {
            this.offset_horizontal_distance += distance_offset;
        } else {
            this.offset_horizontal_distance = distance_offset;
        }
        if (is_defined(parent_width_percentage_offset)) {
            this.offset_horizontal_parent_width_percentage += parent_width_percentage_offset;
        } else {
            this.offset_horizontal_parent_width_percentage = parent_width_percentage_offset;
        }

    };

    this.apply_delta_to_vertical_offset = function(distance_offset, parent_height_percentage_offset) {
        if (is_defined(this.offset_vertical_distance)) {
            this.offset_vertical_distance += distance_offset;
        } else {
            this.offset_vertical_distance = distance_offset;
        }
        if (is_defined(this.offset_vertical_parent_height_percentage)) {
            this.offset_vertical_parent_height_percentage += parent_height_percentage_offset;
        } else {
            this.offset_vertical_parent_height_percentage = parent_height_percentage_offset;
        }
    };

    this.apply_delta_to_depth_offset = function(depth_offset) {
        if (is_defined(this.offset_normal_distance)) {
            this.offset_normal_distance += depth_offset;
        } else {
            this.offset_normal_distance = depth_offset;
        }
    };

    this._refresh_look_at = function() {
        let normal = this.get_normal();
        this._look_at_position.set(this.object3D.position.x + normal.x * 100, this.object3D.position.y + normal.y * 100, this.object3D.position.z + normal.z * 100);
        //let look_at_position = new THREE.Vector3(this.object3D.position.x + normal.x * 100, this.object3D.position.y + normal.y * 100, this.object3D.position.z + normal.z * 100);
        this.object3D.lookAt(this._look_at_position);
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_attachment_vertical_offset = function(distance_offset, parent_height_percentage_offset) {
        // No need for is_defined checks as the values will be checked before being used.
        this.offset_vertical_distance = distance_offset;
        this.offset_vertical_parent_height_percentage = parent_height_percentage_offset;
    };

    this.set_position = function(x, y, z, refresh) {
        if (this.is_root_attachment()) {
            this.object3D.position.set(x, y, z);
        } else {
            this.set_position_offset();
            this.object3D.position.set(x + this._position_offset.x, y + this._position_offset.y, z + this._position_offset.z);
        }
        if (refresh) {
            this._refresh_look_at();
            this.update_all_child_attachments();
        }
    };

    // This function should only be called on a root element.
    this.set_normal = function(x, y, z, refresh) {
        if (!is_defined(this.normal)) {
            this.normal = new THREE.Vector3(0, 0, 0);
        }
        this.normal.set(x, y, z);
        this.normal.normalize();

        if (!is_defined(this.left_right)) {
            this.left_right = new THREE.Vector3(0, 0, 0);
        }
        this.left_right.set(-this.normal.x, 0, -this.normal.z);
        this.left_right.cross(QE.UP_VECTOR);
        this.left_right.normalize();
        if (refresh) {
            this._refresh_look_at();
            this.update_all_child_attachments();
        }
    };

    this.set_attachment_horizontal_distance_offset = function(distance_offset) {
        this.offset_horizontal_distance = distance_offset;
    };

    this.set_attachment_horizontal_offset = function(distance_offset, parent_width_percentage_offset) {
        // No need for is_defined checks as the values will be checked before being used.
        this.offset_horizontal_distance = distance_offset;
        this.offset_horizontal_parent_width_percentage = parent_width_percentage_offset;
    };

    this.look_at_origin = function(refresh) {
        // OLD : this.object3D.lookAt(-this.object3D.position.x, 0, -this.object3D.position.z);
        this.object3D.lookAt(0, this.object3D.position.y, 0);
        if (this.is_root_attachment()) {
            if (!is_defined(this.normal)) {
                // OLD : var normal = new THREE.Vector3(-this.object3D.position.x, 0, -this.object3D.position.z);
                let normal = new THREE.Vector3(-this.object3D.position.x, 0, -this.object3D.position.z);
                normal.normalize();
                this.normal = normal;
            }
        }
        if (refresh) {
            this._refresh_look_at();
        }
    };

    this.set_to_manual_positioning = function() {
        this.manual_positioning = true;
        this.object3D.matrixAutoUpdate = false;
    };

    this.set_attachment_depth_offset = function(depth_offset) {
        this.offset_normal_distance = depth_offset;
    };

    this.set_position_offset = function(n) {
        let normal;
        if (is_defined(n)) {
            normal = n;
        } else {
            normal = this.get_normal();
        }
        let dx = 0;
        let dy = 0;
        let dz = 0;

        let magnitude = 0;
        if (is_defined(this.offset_horizontal_distance)) {
            magnitude += this.offset_horizontal_distance;
        }
        if (is_defined(this.offset_horizontal_parent_width_percentage)) {
            magnitude += this.attachment_parent.width * this.offset_horizontal_parent_width_percentage;
        }
        let left_right = this.get_left_right();
        dx += left_right.x * magnitude;
        dy += left_right.y * magnitude;
        dz += left_right.z * magnitude;

        // TODO : WARNING : For now this only supports y-normals of 0.
        if (is_defined(this.offset_vertical_distance)) {
            dy += this.offset_vertical_distance;
        }
        if (is_defined(this.offset_vertical_parent_height_percentage)) {
            dy += this.offset_vertical_parent_height_percentage * this.attachment_parent.height;
        }
        if (is_defined(this.offset_normal_distance)) {
            dx += normal.x * this.offset_normal_distance;
            dy += normal.y * this.offset_normal_distance;
            dz += normal.z * this.offset_normal_distance;
        }
        this._position_offset.set(dx, dy, dz);
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

    // WARNING : This is recursive. Use different design later.
    this.get_normal = function() {
        if (is_defined(this.normal)) {
            return this.normal;
        } else {
            return this.attachment_parent.get_normal();
        }
    };

    // WARNING : This is recursive. Use different design later.
    this.get_left_right = function() {
        if (is_defined(this.left_right)) {
            return this.left_right;
        } else {
            return this.attachment_parent.get_left_right();
        }
    };
};