'use strict';

function FloatingIcon(world, icon_type) {
    this.__init__(world, icon_type);
}

FloatingIcon.prototype = {

    __init__: function(world) {
        // Inherit.
        FloatingElement.call(this, world);


    },

    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
    create_base_mesh: function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    }

};



/*
        if (this.type === TYPE_ICON) {
            // TODO : Create a cleaner design in the future.
            if (this.text === CURSOR_TYPE_HORIZONTAL || this.text === CURSOR_TYPE_VERTICAL || this.text === CURSOR_TYPE_HAND || this.text === CURSOR_TYPE_POINTER || this.text === CURSOR_TYPE_LARGER || this.text === CURSOR_TYPE_MOUSE) {
                this.material = new THREE.MeshBasicMaterial({map : MANAGER_TEXTURE.get_texture(TEXTURE_GROUP_CURSOR, this.text), transparent : true});
            } else {
                this.material = new THREE.MeshBasicMaterial({map : MANAGER_TEXTURE.get_texture(TEXTURE_GROUP_ICONS, this.text)});
            }

 */