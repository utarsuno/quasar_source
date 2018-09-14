'use strict';

$_QE.prototype.FeatureNormal = function(set_center_offset) {

    this.update_needed_for_normal   = false;

    this._cache_normal              = new THREE.Vector3();
    this._cache_relative_up         = new THREE.Vector3();
    this._cache_relative_forward    = new THREE.Vector3();
    this._cache_relative_left_right = new THREE.Vector3();

    // TODO: if using 'set_center_offset', re-calculate on width/height/size change.

    this.re_cache_normal = function() {
        // Forward.
        this.mesh.getWorldDirection(this._cache_relative_forward);

        // Up.
        this._cache_relative_up.set(
            -this._cache_relative_forward.x * this._cache_relative_forward.y,
            this._cache_relative_forward.x * this._cache_relative_forward.x + this._cache_relative_forward.z * this._cache_relative_forward.z,
            -this._cache_relative_forward.z * this._cache_relative_forward.y
        );

        // Left right.
        let x_2 = this._cache_relative_forward.x * this._cache_relative_forward.x;
        let z_2 = this._cache_relative_forward.z * this._cache_relative_forward.z;
        let y_2 = this._cache_relative_forward.y * this._cache_relative_forward.y;
        this._cache_relative_left_right.set(
            -this._cache_relative_forward.z * y_2 - this._cache_relative_forward.z * x_2 - this._cache_relative_forward.z * z_2,
            0,
            this._cache_relative_forward.x * x_2 + z_2 * this._cache_relative_forward.x + y_2 * this._cache_relative_forward.x
        );

        // Don't re-calculate for the same values.
        this.update_needed_for_normal = false;
    };

    this.look_at = function(x, y, z) {
        this.mesh.lookAt(x, y, z);
        this.update_needed_for_normal = true;
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

/*
var matrix = new THREE.Matrix4();
matrix.extractRotation( mesh.matrix );

var direction = new THREE.Vector3( 0, 0, 1 );
matrix.multiplyVector3( direction );
 */


//up = (forward cross (0, 1, 0)) cross forward

//v.cross(v)
