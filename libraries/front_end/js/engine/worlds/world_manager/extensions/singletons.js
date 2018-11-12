'use strict';

Object.assign($_QE.prototype.WorldManager.prototype, {
    singletons: [],

    singleton_add: function(element) {
        this.singletons.push(element);
        element.set_flag(EFLAG_IS_SINGLETON         , true);
        element.set_flag(EFLAG_IN_ELEMENTS_SINGLETON, true);
    },

    singletons_leave_world: function() {
        this.player_cursor.detach();
        this.player._singleton_leave(this.current_world.scene);

        let s;
        for (s = 0; s < this.singletons.length; s++) {
            this.current_world.remove_element(this.singletons[s]);
        }
    },

    singletons_enter_world: function() {
        this.player._singleton_enter(this.current_world.scene);

        let s;
        for (s = 0; s < this.singletons.length; s++) {
            this.current_world.add_element(this.singletons[s]);
        }
    },

});
