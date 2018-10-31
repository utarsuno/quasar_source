'use strict';

$_QE.prototype.World = function() {};

Object.assign($_QE.prototype.World.prototype, {

    init_world: function(player) {
        this.player                     = player;
        this.scene                      = new THREE.Scene();
        this.currently_looked_at_object = null;

        this.elements_interactive= [];
        this.raycaster           = new THREE.Raycaster();

        // For cache optimizations.
        this._intersections      = [];
        this._nums               = new Int32Array(2);
        this._intersection_data  = null;
        this._intersection_match = null;

        this.elements_root = [];

        this.previous_tab_target = null;

        // State
        this.player_last_position_and_normal_set = false;
        this.player_last_position                = new THREE.Vector3();
        this.player_last_normal                  = new THREE.Vector3();

        this.on_world_enter                      = null;
        this.on_world_exit                       = null;
        this.player_default_enter_position       = null;
        this.player_default_enter_normal         = null;

    },

    _refresh_element: function(element) {
        if (element.get_flag(EFLAG_IS_ROOT)) {
            element.re_cache_normal();
        }
        element.refresh();
    },

    create_and_add_element_to_root: function(element) {
        element.world = this;
        this.add_element_root(element);
        //this.check_if_element_needs_interactive(element);

        this.create_element(element);
        this.add_element(element);

        this._refresh_element(element);
    },

    add_element: function(element, create=false, trigger_event=false) {
        if (element.get_flag(EFLAG_IN_WORLD)) {
            QE.log_warning('Element already in world?', element);
        }

        element.world = this;
        element.set_flag(EFLAG_IN_WORLD, true);
        this.check_if_element_needs_interactive(element);
        this.check_if_element_needs_root(element);
        this.scene.add(element.get_object());
        if (trigger_event) {
            element.trigger_event(ELEMENT_EVENT_ON_WORLD_ENTER);
        }
    },

    add_object_to_scene: function(object) {
        this.scene.add(object);
    },

    remove_object_from_scene: function(object) {
        this.scene.remove(object);
    },

    /*__   ___  __   __        __   __   ___     __        ___                 __
     |__) |__  /__` /  \ |  | |__) /  ` |__     /  ` |    |__   /\  |\ | |  | |__)
     |  \ |___ .__/ \__/ \__/ |  \ \__, |___    \__, |___ |___ /~~\ | \| \__/ |    */
    _remove_element: function(element) {
        this.scene.remove(element.get_object());
        element.set_flag(EFLAG_IN_WORLD, false);
        element.world = null;
    },

    _remove_element_if_needed: function(element) {
        if (element.get_flag(EFLAG_IN_WORLD)) {
            if (element.world == this) {
                this._remove_element(element);
            } else if (element.world != null) {
                element.world._remove_element(element);
            } else {
                element.set_flag(EFLAG_IN_WORLD, false);
                QE.log_warning('Element had in_world flag as true but world variable was null.');
                l(element);
            }
        }
    },

    remove_element: function(element) {
        this._remove_element_if_needed(element);
    },

});
