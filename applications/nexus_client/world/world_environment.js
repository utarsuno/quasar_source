'use strict';

$_NL.prototype.WorldEnvironment = function() {

    this.create_world_environment_singletons = function(world, world_manager) {
        this.grid = new $_QE.prototype.HexagonGrid(6);
        this.grid.create();

        this.light_w = new $_QE.prototype.LightPoint(0xccffcc, .5, 2000, 2);
        this.light_w.element.position.set(750, 450, 750);

        this.light_r = new $_QE.prototype.LightPoint(0xff8579, .5, 2000, 2);
        this.light_r.element.position.set(750, 450, -750);

        this.light_g = new $_QE.prototype.LightPoint(0xb1ff90, .5, 2000, 2);
        this.light_g.element.position.set(-750, 450, 750);

        this.light_b = new $_QE.prototype.LightPoint(0x84b5ff, .5, 2000, 2);
        this.light_b.element.position.set(-750, 450, -755);

        this.light_a = new $_QE.prototype.LightAmbient(0xffffff, .60);

        this.light_w.element.updateMatrix();
        this.light_r.element.updateMatrix();
        this.light_g.element.updateMatrix();
        this.light_b.element.updateMatrix();

        world_manager.singletons.push(this.grid);
        world_manager.singletons.push(this.light_w);
        world_manager.singletons.push(this.light_r);
        world_manager.singletons.push(this.light_g);
        world_manager.singletons.push(this.light_b);
        world_manager.singletons.push(this.light_a);

        this.grid.world_enter(world);
        this.light_w.world_enter(world);
        this.light_r.world_enter(world);
        this.light_g.world_enter(world);
        this.light_b.world_enter(world);
        this.light_a.world_enter(world);
    };
};