'use strict';

function FloatingCheckBox(world, size, checked) {
    this.__init__(world, size, checked);
}

FloatingCheckBox.prototype = {

    __init__: function(world, size, checked) {
        // Inherit.
        FloatingElement.call(this, world);

        this.checked = checked;
        if (!is_defined(this.checked)) {
            this.checked = false;
        }

        this.width = size;
        this.height = size;

        //this.icon_checked = new FloatingIcon(this.world, ICON_CHECKMARK, size);
        //this.icon_not_checked = new FloatingIcon(this.world, ICON_CROSS, size);

        this.create_base_material();
        this.create_base_mesh();
    },

    create_base_material: function() {
        this.material = new THREE.MeshBasicMaterial({opacity: 0.5, transparent: true, color: COLOR_BLACK});
    },

    create_base_mesh: function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    }

};


/*
'use strict';

function FloatingIcon(world, icon_type, size, background_color) {
    this.__init__(world, icon_type, size, background_color);
}

FloatingIcon.prototype = {

    __init__: function(world, icon_type, size, background_color) {
        // Inherit.
        FloatingElement.call(this, world);

        this.icon_type = icon_type;
        this.width = size;
        this.height = size;

        this.create_base_material();
        this.create_base_mesh();
    },

    create_base_material: function() {
        this.material = new THREE.MeshBasicMaterial({map : MANAGER_TEXTURE.get_texture(TEXTURE_GROUP_CURSOR, this.icon_type), transparent : true});
    },

    create_base_mesh: function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    }

};

 */