'use strict';

Object.assign($_QE.prototype.WorldManager.prototype, {
    singletons: [],

    _create_global_singletons: function() {
        //
        this._singleton_grid         = new $_QE.prototype.HexagonGrid(6, SINGLETON_HEXAGON_GRID);
        this._singleton_light_w      = new $_QE.prototype.LightPoint(0xccffcc, .5, 3500, 2, 750, 450, 750, SINGLETON_HEXAGON_LIGHT_0);
        this._singleton_light_r      = new $_QE.prototype.LightPoint(0xff8579, .5, 3500, 2, 750, 450, -750, SINGLETON_HEXAGON_LIGHT_1);
        this._singleton_light_g      = new $_QE.prototype.LightPoint(0xb1ff90, .5, 3500, 2, -750, 450, 750, SINGLETON_HEXAGON_LIGHT_2);
        this._singleton_light_b      = new $_QE.prototype.LightPoint(0x84b5ff, .5, 3500, 2, -750, 450, -755, SINGLETON_HEXAGON_LIGHT_3);
        this._singleton_ambient      = new $_QE.prototype.LightAmbient(0xffffff, .60, SINGLETON_AMBIENT_LIGHT);
        this._singleton_skybox_gray  = new $_QE.prototype.SkyBox(SINGLETON_SKY_BOX_GRAY);
        this._singleton_skybox_space = new $_QE.prototype.SkyBoxSpace(SINGLETON_SKY_BOX_SPACE);

        this.player_cursor         = new $_QE.prototype.PlayerCursor(this.engine);

        this.player_menu           = new $_QE.prototype.PlayerMenu(this.player, this.first_world);
        this.singleton_player_menu = new $_QE.prototype.Singleton(this.player_menu);
        this.singleton_player_menu.set_alias(SINGLETON_PLAYER_MENU);
        this.singleton_player      = new $_QE.prototype.Singleton(this.player.yaw);
        this.singleton_player.set_alias(SINGLETON_PLAYER);
    },

    singleton_add_as_singleton: function(object) {
        new $_QE.prototype.Singleton(object, this.engine);
    },

    singleton_add: function(singleton) {
        singleton.on_add_to_singletons();
        this.singletons.push(singleton);
    },

    singletons_leave_world: function() {
        this.player_cursor.detach();
        //this.player_menu.set_to_invisible();
        this.player_menu.trigger_event(ELEMENT_EVENT_ON_WORLD_EXIT);
        let s;
        for (s = 0; s < this.singletons.length; s++) {
            this.singletons[s].world_leave(this.current_world);
        }
    },

    singletons_enter_world: function() {
        let s;
        for (s = 0; s < this.singletons.length; s++) {
            this.singletons[s].world_enter(this.current_world);
        }
    },

});
