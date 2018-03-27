'use strict';

function FloatingIcon(world, icon_type, size) {
    this.__init__(world, icon_type, size);
}

FloatingIcon.prototype = {

    __init__: function(world, icon_type, size) {
        // Inherit.
        FloatingElement.call(this, world);

        this.icon_type = icon_type;
        this.width = size;
        this.height = size;

        this.create_base_material();
        this.create_base_mesh();
    },

    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
    create_base_material: function() {
        /*
        var transparent = false;
        switch (this.icon_type) {
        case CURSOR_TYPE_HORIZONTAL:
        case CURSOR_TYPE_VERTICAL:
        case CURSOR_TYPE_HAND:
        case CURSOR_TYPE_POINTER:
        case CURSOR_TYPE_LARGER:
        case CURSOR_TYPE_MOUSE:
            transparent = true;
            break;
        }
        */
        this.material = new THREE.MeshBasicMaterial({map : MANAGER_TEXTURE.get_texture(TEXTURE_GROUP_CURSOR, this.icon_type), transparent : true});
    },

    create_base_mesh: function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    }

};