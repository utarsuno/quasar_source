'use strict';

const SINGLETON_BACKGROUND = 'background';       // #pre-process_global_constant
const SINGLETON_AMBIENT    = 'ambient_lighting'; // #pre-process_global_constant

Object.assign($_QE.prototype.WorldManager.prototype, {
    singletons: [],

    _create_global_singletons: function() {
        // Default ambient light.
        new $_QE.prototype.LightAmbient(0xffffff, .60);
        // Default background.
        new $_QE.prototype.SkyBox();

        this.player_cursor         = new $_QE.prototype.PlayerCursor(this.engine);

        this.player_menu           = new $_QE.prototype.PlayerMenu(this.player, this.first_world);
        this.singleton_player_menu = new $_QE.prototype.Singleton(this.player_menu, this.engine);
        this.singleton_player      = new $_QE.prototype.Singleton(this.player.yaw, this.engine);
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
