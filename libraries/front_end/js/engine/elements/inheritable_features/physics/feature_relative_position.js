'use strict';

$_QE.prototype.FeatureRelativePosition = function() {

    this.horizontal_offsets = new Float64Array(3);
    this.vertical_offsets   = new Float64Array(3);

    this.get_world_position = function() {
        // TEMP:
        this.mesh.geometry.computeBoundingBox();
        let box = this.mesh.geometry.boundingBox;
        let position = new THREE.Vector3();
        position.subVectors(box.max, box.min);
        position.multiplyScalar(0.5);
        position.add(box.min);
        position.applyMatrix4(this.mesh.matrixWorld);
        return position;
    };

    this.set_offset_vertical_percentage = function(parent_percentage, self_percentage=null, distance=null) {
        this.vertical_offsets[0] = parent_percentage;
        if (self_percentage != null) {
            this.vertical_offsets[1] = self_percentage;
        }
        if (distance != null) {
            this.vertical_offsets[2] = distance;
        }
        this.mesh.position.y = this.parent.height * (this.vertical_offsets[0] - 0.5) + this.height * this.vertical_offsets[1];
        this.set_flag(EFLAG_UPDATE_POSITION, true);
        this.parent.set_flag(EFLAG_UPDATE_CHILD, true);
    };

    this._update_horizontal_position = function() {

    };

    this.set_offset_horizontal_percentage = function(parent_percentage, self_percentage=null, distance=null) {
        this.horizontal_offsets[0] = parent_percentage;
        if (self_percentage != null) {
            this.horizontal_offsets[1] = self_percentage;
        }
        if (distance != null) {
            this.horizontal_offsets[2] = distance;
        }
        this.mesh.position.x = this.parent.width * (this.horizontal_offsets[0] - 0.5) + this.width * this.horizontal_offsets[1] + this.horizontal_offsets[2];
        this.set_flag(EFLAG_UPDATE_POSITION, true);
        this.parent.set_flag(EFLAG_UPDATE_CHILD, true);
    };

    this.set_offset_depth = function(distance) {
        this.mesh.position.z += distance;
        this.set_flag(EFLAG_UPDATE_POSITION, true);
        this.parent.set_flag(EFLAG_UPDATE_CHILD, true);
    };

};
