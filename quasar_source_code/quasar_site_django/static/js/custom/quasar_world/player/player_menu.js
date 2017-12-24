'use strict';

function PlayerMenu(world) {
    this.__init__(world);
}

function MenuIcon(icon_type, world) {
    this.__init__(icon_type, world);
}

MenuIcon.prototype = {
    __init__: function(icon_type, world) {
        this.world = world;
        this.object3D = new THREE.Object3D();


        for (var i = 0; i < MANAGER_WORLD.icon_textures.length; i++) {
            if (MANAGER_WORLD.icon_textures[i][1].includes(icon_type)) {
                this.geometry = new THREE.CircleGeometry(10, 32);
                // TODO : Eventually just do FrontSide
                // TODO : Eventually add some transparency.
                this.material = new THREE.MeshBasicMaterial({map: MANAGER_WORLD.icon_textures[i][0], side: THREE.DoubleSide});
                this.icon = new THREE.Mesh(this.geometry, this.material);

                this.object3D.add(this.icon);

                this.world.add_to_scene(this.object3D);
            }
        }
    },

    update_position_and_normal: function(position, nx, nz) {
        this.object3D.position.set(position.x, position.y, position.z);
        this.object3D.lookAt(new THREE.Vector3(position.x + nx * 5, position.y, position.z + nz * 5));
    }
};

PlayerMenu.prototype = {

    world: null,

    __init__: function(world) {
        this.world = world;

        this.visible = false;

    },

    set_to_invisible: function() {
        this.visible = false;
    },

    set_to_visible: function() {
        this.visible = true;

        var pp = CURRENT_PLAYER.get_position();
        var pd = CURRENT_PLAYER.get_direction();

        var start_position = new THREE.Vector3(pp.x + pd.x * 100, pp.y + pd.y * 100, pp.z + pd.z * 100);
        var start_position_2 = new THREE.Vector3(pp.x + pd.x * 100, pp.y + pd.y * 100 - 50, pp.z + pd.z * 100);

        this.icon_save.update_position_and_normal(start_position, -pd.x, -pd.z);
        this.icon_create_entity_group.update_position_and_normal(start_position_2, -pd.x, -pd.z)
    },

    is_visible: function() {
        return this.visible;
    },

    update: function(delta) {
        l(delta);
    },

    // This function gets called once per player menu object.
    load_icon_textures: function() {
        this.icon_save = new MenuIcon(ICON_SAVE, this.world);
        this.icon_create_entity_group = new MenuIcon(ICON_ENTITY_GROUP, this.world);
    }

};


/*
this.player_menu = new FloatingWall(100, 50, new THREE.Vector3(-5000, -5000, -5000), new THREE.Vector3(0, 0, 0), this, false);
this.player_menu.add_floating_2d_text(0, 1, 'Create Entity Wall', TYPE_BUTTON, 0);
this.player_menu.add_floating_2d_text(0, 1, 'Create Image', TYPE_BUTTON, 1);
this.player_menu.add_floating_2d_text(0, 1, 'Save', TYPE_BUTTON, 2);
this.player_menu.set_to_invisible();
 */