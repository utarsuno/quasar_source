'use strict';

$_QE.prototype.FeatureNormal = function() {

    /*__   __   ___  __       ___    __        __
     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ */
    this._refresh_look_at = function() {
        let normal = this.get_normal();
        this._look_at_position.set(this.object3D.position.x + normal.x, this.object3D.position.y + normal.y, this.object3D.position.z + normal.z);
        //let look_at_position = new THREE.Vector3(this.object3D.position.x + normal.x * 100, this.object3D.position.y + normal.y * 100, this.object3D.position.z + normal.z * 100);
        this.object3D.lookAt(this._look_at_position);
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    // This function should only be called on a root element.
    this.look_at_origin = function() {
        if (!this.is_root_attachment()) {
            console.log('WARNING! SETTING NORMAL ON NON-ROOT ATTACHMENT!!');
        } else {
            this.set_normal(-this.object3D.position.x, 0, -this.object3D.position.z);
            this.object3D.lookAt(-this.object3D.position.x, this.object3D.position.y, -this.object3D.position.z);
        }
    };

    this._set_left_right = function() {
        this.left_right = new THREE.Vector3(-this.normal.x, 0, -this.normal.z);
        this.left_right.cross(QE.UP_VECTOR);
        this.left_right.normalize();
    };

    // This function should only be called on a root element.
    this.set_normal = function(x, y, z) {
        if (!this.is_root_attachment()) {
            console.log('WARNING! SETTING NORMAL ON NON-ROOT ATTACHMENT!!');
        } else {
            if (!is_defined(this.normal)) {
                this.normal = new THREE.Vector3(x, y, z);
            } else {
                this.normal.set(x, y, z);
            }
            this.normal.normalize();
            if (!is_defined(this.left_right)) {
                this._set_left_right();
            }
        }
    };


    ////

    // WARNING : This is recursive. Use different design later.
    this.get_left_right = function() {
        return (this.left_right !== null ? this.left_right : this.attachment_parent.get_left_right());
    };

    // WARNING : This is recursive. Use different design later.
    this.get_normal = function() {
        return (this.normal !== null ? this.normal : this.attachment_parent.get_normal());
    };

};