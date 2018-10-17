'use strict';

$_QE.prototype.Element = function() {};

Object.assign(
    $_QE.prototype.Element.prototype,
    $_QE.prototype.BooleanFlagsDynamic.prototype,
    {
        group  : null,
        // Element usually refers to the mesh.
        element: null,
        world  : null,


        world_enter: function(world) {
            if (this.get_flag(EFLAG_IN_WORLD)) {
                this.world_exit();
            }
            this.set_flag(EFLAG_IN_WORLD, true);
            this.world = world;
            // TODO: Check the whole parent/children/group status.
            this.world.add_to_scene(this.element);
            this.trigger_event(ELEMENT_EVENT_ON_WORLD_ENTER);
        },

        world_exit: function() {
            if (this.world != null) {
            // TODO: Check the whole parent/children/group status.
                this.world.remove_from_scene(this.element);
                this.set_flag(EFLAG_IN_WORLD, false);
                this.trigger_event(ELEMENT_EVENT_ON_WORLD_EXIT);
            }
        },
    });


$_QE.prototype.Element = function(is_base=false) {

    //$_QE.prototype.FloatingElementMetaData.call(this);
    this.set_flag(EFLAG_IS_BASE, is_base);

    this.group              = null;
    this.element            = null;
    this.world              = null;

    this.set_to_root_element = function() {
        if (this.group == null) {
            this.group = new THREE.Group();
        }
    };

    this.replace_mesh_with_group = function() {
        l('replace_mesh_with_group!!!!!!!!');

        if (this.element.parent != null) {
            l('PRINTING THE PARENT!');
            l(this.element.parent);
        }

        this.group = new THREE.Group();

        if (this.get_flag(EFLAG_IN_WORLD)) {
            // Save relative offset.
            // TEMP.
            //let relative_offset = new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);

            if (this.element.parent != null) {
                l('PRINTING THE PARENT!');
                l(this.element.parent);
            }

            this.group = new THREE.Group();


            //this.group.add(this.element);
            //this.world.remove_from_scene(this.element);
            //this.world.add(this.group);
        }
    };

    this.world_enter = function(world) {
        if (this.get_flag(EFLAG_IN_WORLD)) {
            this.world_exit();
        }
        this.set_flag(EFLAG_IN_WORLD, true);
        this.world = world;
        // TODO: Check the whole parent/children/group status.
        this.world.add_to_scene(this.element);
        this.trigger_event(ELEMENT_EVENT_ON_WORLD_ENTER);
    };

    this.world_exit = function() {
        if (this.world != null) {
            // TODO: Check the whole parent/children/group status.
            this.world.remove_from_scene(this.element);
            this.set_flag(EFLAG_IN_WORLD, false);
            this.trigger_event(ELEMENT_EVENT_ON_WORLD_EXIT);
        }
    };
};

