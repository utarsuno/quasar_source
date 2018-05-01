'use strict';

function WorldEnvironment() {
    this.__init__();
}

WorldEnvironment.prototype = {

    __init__: function() {
        this.half_pie          = Math.PI / 2;
        this.pie               = Math.PI;
        this.three_fourths_pie = this.half_pie * 3;
    },

    update: function(delta) {
        // Temp just for fun, rotate the lights in a circle.
        this.light_delta += delta;
        this.light_percentage = this.light_delta / this.light_delta_cap;
        this.light_0.position.set(Math.cos(this.light_percentage) * 1000, 100, Math.sin(this.light_percentage) * 1000);
        this.light_1.position.set(Math.cos(this.light_percentage + this.half_pie) * 1000, 100, Math.sin(this.light_percentage + this.half_pie) * 1000);
        this.light_2.position.set(Math.cos(this.light_percentage + this.pie) * 1000, 100, Math.sin(this.light_percentage + this.pie) * 1000);
        this.light_3.position.set(Math.cos(this.light_percentage + this.three_fourths_pie) * 1000, 100, Math.sin(this.light_percentage + this.three_fourths_pie) * 1000);

        // Temp for fun, slowly rotate the skybox.
        this.skybox_cube.rotation.x += .0001;
        this.skybox_cube.rotation.y += .0001;
        this.skybox_cube.rotation.z += .0001;
    },

    switch_to_new_world: function(old_world, new_world) {
        old_world.remove_from_scene(this.skybox_cube);
        //old_world.remove_from_scene(this.board.group);
        old_world.remove_from_scene(this.grid.object3D);
        old_world.remove_from_scene(this.light_0);
        old_world.remove_from_scene(this.light_1);
        old_world.remove_from_scene(this.light_2);
        old_world.remove_from_scene(this.light_3);
        old_world.remove_from_scene(this.light);

        new_world.add_to_scene(this.skybox_cube);
        //new_world.add_to_scene(this.board.group);
        new_world.add_to_scene(this.grid.object3D);
        new_world.add_to_scene(this.light_0);
        new_world.add_to_scene(this.light_1);
        new_world.add_to_scene(this.light_2);
        new_world.add_to_scene(this.light_3);
        new_world.add_to_scene(this.light);
    },

    /*        ___                      __        __
     | |\ | |  |  |  /\  |       |    /  \  /\  |  \
     | | \| |  |  | /~~\ |___    |___ \__/ /~~\ |__/ */
    create: function(world) {
        // Default skybox.
        this.skybox_geometry = new THREE.BoxGeometry(21000, 21000, 21000);
        this.skybox_cube = new THREE.Mesh(this.skybox_geometry, MANAGER_TEXTURE.get_skybox_material());
        this.skybox_cube.position.set(0, 0, 0);
        world.add_to_scene(this.skybox_cube);

        this.grid = new MANAGER_MANAGER.HexagonGrid(6);
        //this.grid = new HexagonGrid(6);
        this.grid.create();
        world.add_to_scene(this.grid.object3D);

        // Default lights.
        this.light_delta = 0;
        this.light_delta_cap = 10;
        this.light_radius = 1000;

        this.light_0 = new THREE.PointLight(0xccffcc, .5, 0);
        this.light_0.position.set(5, 100, 5);
        world.add_to_scene(this.light_0);

        this.light_1 = new THREE.PointLight(0xff8579, .5, 0);
        this.light_1.position.set(1000, 100, 0);
        world.add_to_scene(this.light_1);

        this.light_2 = new THREE.PointLight(0xb1ff90, .5, 0);
        this.light_2.position.set(0, 100, 1000);
        world.add_to_scene(this.light_2);

        this.light_3 = new THREE.PointLight(0x84b5ff, .5, 0);
        this.light_3.position.set(500, 100, 500);
        world.add_to_scene(this.light_3);

        // soft white light
        this.light = new THREE.AmbientLight(0xffffff, .40);
        world.add_to_scene(this.light);

        // TODO : Create a light at the player's position.
    }
};