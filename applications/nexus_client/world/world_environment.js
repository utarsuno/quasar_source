'use strict';

$_NL.prototype.WorldEnvironment = function(world_manager) {

    this.grid = new $_QE.prototype.HexagonGrid(world_manager, 6);
    this.grid.create();

    this.light_w = new $_QE.prototype.LightPoint(world_manager, 0xccffcc, .5, 2000, 2);
    this.light_w.element.position.set(750, 450, 750);

    this.light_r = new $_QE.prototype.LightPoint(world_manager, 0xff8579, .5, 2000, 2);
    this.light_r.element.position.set(750, 450, -750);

    this.light_g = new $_QE.prototype.LightPoint(world_manager, 0xb1ff90, .5, 2000, 2);
    this.light_g.element.position.set(-750, 450, 750);

    this.light_b = new $_QE.prototype.LightPoint(world_manager, 0x84b5ff, .5, 2000, 2);
    this.light_b.element.position.set(-750, 450, -755);

    this.light_a = new $_QE.prototype.LightAmbient(world_manager, 0xffffff, .60);

    this.light_w.element.updateMatrix();
    this.light_r.element.updateMatrix();
    this.light_g.element.updateMatrix();
    this.light_b.element.updateMatrix();

};