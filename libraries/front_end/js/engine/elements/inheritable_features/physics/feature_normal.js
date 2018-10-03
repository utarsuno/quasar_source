'use strict';

$_QE.prototype.FeatureNormal = function() {

    this._cache_normal              = new THREE.Vector3();
    this._cache_relative_up         = new THREE.Vector3();
    this._cache_relative_forward    = new THREE.Vector3();
    this._cache_relative_left_right = new THREE.Vector3();
    this._cache_absolute_left_right = new THREE.Vector3();

    this._cache_calculation_normals = new Float64Array(3);

    this.re_cache_normal = function() {
        // Forward.
        if (this.group != null) {
            this.group.getWorldDirection(this._cache_relative_forward);
        } else {
            this.mesh.getWorldDirection(this._cache_relative_forward);
        }

        // Up.
        this._cache_relative_up.set(
            -this._cache_relative_forward.x * this._cache_relative_forward.y,
            this._cache_relative_forward.x * this._cache_relative_forward.x + this._cache_relative_forward.z * this._cache_relative_forward.z,
            -this._cache_relative_forward.z * this._cache_relative_forward.y
        );

        // Left right.
        /*        this._cache_relative_left_right.set(
            -this._cache_relative_forward.z * y_2 - this._cache_relative_forward.z * x_2 - this._cache_relative_forward.z * z_2,
            0,
            this._cache_relative_forward.x * x_2 + z_2 * this._cache_relative_forward.x + y_2 * this._cache_relative_forward.x
        );*/
        this._cache_calculation_normals[0] = this._cache_relative_forward.x * this._cache_relative_forward.x; // x_2
        this._cache_calculation_normals[1] = this._cache_relative_forward.z * this._cache_relative_forward.z; // z_2
        this._cache_calculation_normals[2] = this._cache_relative_forward.y * this._cache_relative_forward.y; // y_2
        this._cache_relative_left_right.set(
            -this._cache_relative_forward.z * this._cache_calculation_normals[2] - this._cache_relative_forward.z * this._cache_calculation_normals[0] - this._cache_relative_forward.z * this._cache_calculation_normals[1],
            0,
            this._cache_relative_forward.x * this._cache_calculation_normals[0] + this._cache_calculation_normals[1] * this._cache_relative_forward.x + this._cache_calculation_normals[2] * this._cache_relative_forward.x
        );

        // Absolute left right.
        this._cache_absolute_left_right.set(
            this._cache_relative_left_right.x,
            this._cache_relative_left_right.y,
            this._cache_relative_left_right.z
        ).normalize();

        // Don't re-calculate for the same values.
        this.set_flag(EFLAG_UPDATE_NORMAL, false);
    };

    this.look_at = function(x, y, z) {

        if (this.group != null) {
            this.group.lookAt(x, y, z);
            // Temp
            //this.group.updateMatrix();
            //this.group.updateMatrixWorld();
            //
        } else {
            this.mesh.lookAt(x, y, z);
            //this.mesh.updateMatrix();
            //this.mesh.updateMatrixWorld(true);
        }
        this.set_flag(EFLAG_UPDATE_NORMAL, true);
    };

    this.get_normal = function() {
        // To get relative forward:
        // e = this.<mesh>.matrixWorld.elements;
        // <Vector3>.set(e[8], e[9], e[10]).normalize()
        return this._cache_relative_forward;
    };

    this.get_up = function() {
        // To get relative up: relative_forward.cross(absolute_up).cross(relative_forward)
        return this._cache_relative_up;
    };

    this.get_left_right = function() {
        // To get left right: relative_forward.cross(relative_up)
        return this._cache_relative_left_right;
    };

};
