'use strict';

$_QE.prototype.FloatingElement = function(is_base) {

    //$_QE.prototype.Element.call(this, is_base);
    //$_QE.prototype.FeatureRecycle.call(this);

    this.set_to_button = function(engage_function, use_confirmation_prompt=false) {
        $_QE.prototype.FeatureButton.call(this, engage_function);
        if (use_confirmation_prompt) {
            this.use_confirmation_prompt();
        }
    };

    this.update_element = function() {

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
    };

    this.add_to_world = function(world, create=false, set_to_group=true, add_to_scene=false, refresh=false) {
        this.world = world;

        if (set_to_group) {
            this.set_to_root_element();
        }

        if (create) {
            this.create();
            this.set_flag(EFLAG_CREATED, true);
        }

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
        if (this.are_flags_on_and_off_respectively(EFLAG_INTERACTIVE, EFLAG_IN_ELEMENTS_INTERACTIVE)) {
            world.add_element_interactive(this);
        }

        // TODO: remove this?
        if (refresh) {
            //this.refresh();
            //this.re_cache_normal();
            //this.refresh();
            this.re_cache_normal();
            this.refresh();
        }
    };

    this.recycle = function(remove_from_scene, remove_from_root, remove_from_interactive) {
        if (remove_from_scene) {
            if (this.group != null) {
                this.group.remove(this.mesh);
            } else {
                this.world.remove_from_scene(this.mesh);
            }
        }
        if (remove_from_root) {
            if (this.get_flag(EFLAG_IN_ELEMENTS_ROOT)) {
                this.world.remove_from_elements_root(this);
            }
        }
        if (remove_from_interactive) {
            if (this.get_flag(EFLAG_IN_ELEMENTS_INTERACTIVE)) {
                this.remove_from_elements_interactive(this);
            }
        }
    };

};

Object.assign(
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.Element.prototype,
    {
        refresh: function() {
            if (this.group != null) {
                this.group.updateMatrix();
            } else {
                this.mesh.updateMatrix();
            }
        },
    }
);