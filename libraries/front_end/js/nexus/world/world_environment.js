'use strict';

$_NL.prototype.WorldEnvironment = function() {

    this.create_world_environment_singletons = function(world, world_manager) {
        this.grid = new $_QE.prototype.HexagonGrid(6);
        this.grid.create();

        this.light_0 = new $_QE.prototype.LightPoint(0xccffcc, .5, 2000, 2);
        this.light_0.set_position(5, 500, 5);

        this.light_1 = new $_QE.prototype.LightPoint(0xff8579, .5, 2000, 2);
        this.light_1.set_position(1000, 500, 0);

        this.light_2 = new $_QE.prototype.LightPoint(0xb1ff90, .5, 2000, 2);
        this.light_2.set_position(0, 500, 1000);

        this.light_3 = new $_QE.prototype.LightPoint(0x84b5ff, .5, 2000, 2);
        this.light_3.set_position(500, 500, 500);

        this.light_a = new $_QE.prototype.LightAmbient(0xffffff, .60);

        world_manager.singletons.push(this.grid);
        world_manager.singletons.push(this.light_0);
        world_manager.singletons.push(this.light_1);
        world_manager.singletons.push(this.light_2);
        world_manager.singletons.push(this.light_3);
        world_manager.singletons.push(this.light_a);

        this.grid.world_enter(world);
        this.light_0.world_enter(world);
        this.light_1.world_enter(world);
        this.light_2.world_enter(world);
        this.light_3.world_enter(world);
        this.light_a.world_enter(world);
    };
};