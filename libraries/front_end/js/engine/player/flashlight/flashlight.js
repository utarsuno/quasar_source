'use strict';

Object.assign(
    $_QE.prototype.Player.prototype,
    {
        _initialize_flashlight: function() {
            this.flashlight         = new THREE.SpotLight(0xb9fff3, 0.85, 6000, 0.35, 0.85, 1.0);
            this._flashlight_target = new THREE.Object3D();
            this.flashlight.target  = this._flashlight_target;
        },

        _update_flashlight: function() {
            this.flashlight.position.set(this.yaw.position.x, this.yaw.position.y, this.yaw.position.z);
            this._flashlight_target.position.set(
                this.yaw.position.x + this._cache_normal.x * 1000.0,
                this.yaw.position.y + this._cache_normal.y * 1000.0,
                this.yaw.position.z + this._cache_normal.z * 1000.0
            );
            this._flashlight_target.updateMatrix();
            this.flashlight.updateMatrix();
        },
    }
);
