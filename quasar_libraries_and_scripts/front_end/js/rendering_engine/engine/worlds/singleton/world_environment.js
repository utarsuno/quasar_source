'use strict';

$_QE.prototype.WorldEnvironment = function() {

    this.update = function(delta) {
    };

    this.switch_to_new_world = function(old_world, new_world) {
        old_world.remove_from_scene(this.light);

        new_world.add_to_scene(this.light);
    };

    this.create = function(world) {
        this.grid = new $_QE.prototype.HexagonGrid();
        this.grid.__init__(6);
        this.grid.create();
        //world.add_to_scene(this.grid.object3D);

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
        this.light = new THREE.AmbientLight(0xffffff, .60);
        world.add_to_scene(this.light);
    };
};
