'use strict';

$_QE.prototype.FeaturePosition = function() {

    this._cache_previous_position_center_x         = null;
    this._cache_previous_position_center_y         = null;
    this._cache_previous_position_center_z         = null;
    this._cache_previous_position_center_look_at_x = null;
    this._cache_previous_position_center_look_at_y = null;
    this._cache_previous_position_center_look_at_z = null;

    this.get_world_position = function() {
        // TEMP:
        /*
        this.mesh.geometry.computeBoundingBox();
        let box = this.mesh.geometry.boundingBox;
        let position = new THREE.Vector3();
        position.subVectors(box.max, box.min);
        position.multiplyScalar(0.5);
        position.add(box.min);
        position.applyMatrix4(this.mesh.matrixWorld);
        return position;
        */
        if (this.group != null) {
            return this.group.position;
        }
        return this.mesh.position;
    };

    this.set_position = function(x, y, z) {
        //this.mesh.position.set(x, y, z);
        if (this.group != null) {
            this.group.position.set(x, y, z);
        } else {
            this.mesh.position.set(x, y, z);
        }
        this.set_flag(EFLAG_UPDATE_POSITION, true);
    };

    this.shift_by_left_right = function(distance) {
        if (this.group != null) {
            this.group.position.set(
                this.group.position.x + this._cache_absolute_left_right.x * distance,
                this.group.position.y,
                this.group.position.z + this._cache_absolute_left_right.z * distance
            );
        } else {
            this.mesh.position.set(
                this.mesh.position.x + this._cache_absolute_left_right.x * distance,
                this.mesh.position.y,
                this.mesh.position.z + this._cache_absolute_left_right.z * distance
            );
        }
        this.set_flag(EFLAG_UPDATE_POSITION, true);
    };

    this.set_position_center = function(x, y, z, look_at_x, look_at_y, look_at_z, cache=false) {

        if (cache) {
            this._cache_previous_position_center_x = x;
            this._cache_previous_position_center_y = y;
            this._cache_previous_position_center_z = z;
            this._cache_previous_position_center_look_at_x = look_at_x;
            this._cache_previous_position_center_look_at_y = look_at_y;
            this._cache_previous_position_center_look_at_z = look_at_z;
        }

        if (this.group != null) {
            this.group.position.set(
                x,
                y - this.height / 2,
                z
            );
            this.group.updateMatrix();
            //this.group.updateMatrixWorld();
        } else {
            this.mesh.position.set(
                x,
                y - this.height / 2,
                z
            );

            this.mesh.updateMatrix();
        }

        if (cache) {
            this.look_at(look_at_x, look_at_y, look_at_z);
            this.re_cache_normal();
            this.shift_by_left_right(this.width / 2);
        } else {
            if (this.group == null) {
                this.look_at(look_at_x, look_at_y, look_at_z);
                this.re_cache_normal();
            }
            this.shift_by_left_right(this.width / 2);
            //this.look_at(look_at_x, look_at_y, look_at_z);
        }

        //this.look_at(look_at_x, look_at_y, look_at_z);

        //this.re_cache_normal();
        //if (cache) {
        //    this.re_cache_normal();
        //}

        //l('Shifting left right by {' + (this.width / 2) + '}');
        //this.shift_by_left_right(this.width / 2);

        this.set_flag(EFLAG_UPDATE_POSITION, true);
    };
};