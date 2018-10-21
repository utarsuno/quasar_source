'use strict';

$_QE.prototype.FloatingElement = function() {
    this.set_flag(EFLAG_VISIBLE, true);
};

Object.assign(
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.Element.prototype,
    {
        set_to_button: function(engage_function, use_confirmation_prompt=false) {
            $_QE.prototype.FeatureButton.call(this, engage_function);
            if (use_confirmation_prompt) {
                this.use_confirmation_prompt();
            }
        },

        update_element: function() {
            if (this.consume_flag(EFLAG_UPDATE_POSITION) || this.get_flag(EFLAG_UPDATE_NORMAL)) {
                this.refresh();
                if (this.get_flag(EFLAG_IS_BASE)) {
                    this.re_cache_normal();
                }
            }

            // TODO: set this to an event!
            if (this.update != null) {
                this.update();
            }

            if (this.consume_flag(EFLAG_UPDATE_CHILD)) {
                let c;
                for (c = 0; c < this.attachments.length; c++) {
                    this.attachments[c].update_element();
                }
            }
        },

        add_to_world: function(world, create=false, set_to_group=true, add_to_scene=false) {
            this.world = world;

            // TODO: Refactor this
            if (set_to_group) {
                this.set_to_root_element();
            }

            //if (create) {
            //    this.create();
            //    this.set_flag(EFLAG_CREATED, true);
            //}

            if (add_to_scene) {
                this.set_flag(EFLAG_IS_ROOT, true);
                this.set_flag(EFLAG_IN_ELEMENTS_ROOT, false);
                if (set_to_group) {
                    world.add_to_scene(this.group);
                } else {
                    world.add_to_scene(this.mesh);
                }
            }

            if (this.are_flags_on_and_off_respectively(EFLAG_IS_ROOT, EFLAG_IN_ELEMENTS_ROOT)) {
                world.add_element_root(this);
            }
            //if (this.are_flags_on_and_off_respectively(EFLAG_INTERACTIVE, EFLAG_IN_ELEMENTS_INTERACTIVE)) {
            //    world.add_element_interactive(this);
            //}
        },

        _remove_from_scene: function() {
            if (this.group != null) {
                this.group.remove(this.mesh);
            } else {
                this.world.remove_from_scene(this.mesh);
            }
        },

        _remove_from_root: function() {
            if (this.get_flag(EFLAG_IN_ELEMENTS_ROOT)) {
                this.world.remove_from_elements_root(this);
            }
        },

        _remove_from_interactive: function() {
            if (this.get_flag(EFLAG_IN_ELEMENTS_INTERACTIVE)) {
                this.remove_from_elements_interactive(this);
            }
        },

        /*
        full_remove: function() {
            this._remove_from_scene();
            this._remove_from_root();
            this._remove_from_interactive();
            this.recycle_material();
            this.recycle_geometry();
            this.recycle_mesh();
        },*/

        /*
            this.full_remove_self_and_all_children_recursively = function() {
                let a;
                for (a = 0; a < this.attachments.length; a++) {
                    this.attachments[a].full_remove_self_and_all_children_recursively();
                }
                this.full_remove();
            };
         */

        recycle: function(remove_from_scene, remove_from_root, remove_from_interactive) {
            if (remove_from_scene) {
                this._remove_from_scene();
            }
            if (remove_from_root) {
                this._remove_from_root();
            }
            if (remove_from_interactive) {
                this._remove_from_interactive();
            }
        },

        refresh: function() {
            if (this.group != null) {
                this.group.updateMatrix();
            } else {
                this.mesh.updateMatrix();
            }
        },
    }
);