'use strict';


Object.assign(
    $_NL.prototype,
    {
        add_singletons: function(world_manager) {
            this.grid    = new $_QE.prototype.HexagonGrid(6);
            this.light_w = new $_QE.prototype.LightPoint(0xccffcc, .5, 3500, 2, 750, 450, 750);
            this.light_r = new $_QE.prototype.LightPoint(0xff8579, .5, 3500, 2, 750, 450, -750);
            this.light_g = new $_QE.prototype.LightPoint(0xb1ff90, .5, 3500, 2, -750, 450, 750);
            this.light_b = new $_QE.prototype.LightPoint(0x84b5ff, .5, 3500, 2, -750, 450, -755);
            this.light_a = new $_QE.prototype.LightAmbient(0xffffff, .60);
            this.skybox  = new $_QE.prototype.SkyBox();

            //
            this.tile_cube = new $_QE.prototype.TileCube();
            world_manager.singleton_add(this.tile_cube);
            //

            world_manager.singleton_add(this.grid);
            world_manager.singleton_add(this.light_w);
            world_manager.singleton_add(this.light_r);
            world_manager.singleton_add(this.light_g);
            world_manager.singleton_add(this.light_b);
            world_manager.singleton_add(this.light_a);
            world_manager.singleton_add(this.skybox);
        },
    }
);
