'use strict';

function FloatingCursor(world) {
    this.__init__(world);
}

FloatingCursor.prototype = {

    __init__: function(world) {
        // TODO : Optimize in the future.
        // Load all instances of the cursor needed.
        this.cursors = {};

        // The cursor texture will get set once loaded.
        this.width = 7;
        this.height = 10;
        this.plane_geometry = new THREE.PlaneGeometry(7, 10, 1);
        // TODO : Dispose of this original material later on.
        this.temp_material = new THREE.MeshBasicMaterial({color: 0xa6fff2, transparent: true, opacity: 0.90, side: THREE.DoubleSide});
        this.cursor_temp = new THREE.Mesh(this.plane_geometry, this.temp_material);

        this.previous_cursor = null;
        this.current_cursor = this.cursor_temp;

        this.object3D = new THREE.Object3D();
        this.object3D.add(this.cursor_temp);

        this.world = world;
        this.scene = this.world.scene;
        this.scene.add(this.object3D);

        this.cursor_needed_from_interactive_objects = false;
        this.cursor_needed_from_floating_walls = false;
        this.engaged = false;
        this.visible = false;
    },

    engage: function() {
        this.engaged = true;
        CURRENT_PLAYER.engage();
        CURRENT_PLAYER.enable_controls();

    },

    disengage: function() {
        // TODO : temp fix.
        if (this.engaged) {
            this.engaged = false;
            CURRENT_PLAYER.disengage();
            if (is_defined(this.current_floating_wall)) {
                this.current_floating_wall.cursor_action_disengaged();
                this.current_floating_wall = null;
            }
        }
    },

    add_cursor_material: function(cursor_material, texture_name) {
        var cursor_name = '';

        if (texture_name.includes(CURSOR_TYPE_HORIZONTAL)) {
            cursor_name = CURSOR_TYPE_HORIZONTAL;
        } else if (texture_name.includes(CURSOR_TYPE_VERTICAL)) {
            cursor_name = CURSOR_TYPE_VERTICAL;
        } else if (texture_name.includes(CURSOR_TYPE_HAND)) {
            cursor_name = CURSOR_TYPE_HAND;
        } else if (texture_name.includes(CURSOR_TYPE_POINTER)) {
            cursor_name = CURSOR_TYPE_POINTER;
        } else if (texture_name.includes(CURSOR_TYPE_LARGER)) {
            cursor_name = CURSOR_TYPE_LARGER;
        } else if (texture_name.includes(CURSOR_TYPE_MOUSE)) {
            cursor_name = CURSOR_TYPE_MOUSE;
        }

        var cursor_plane_geometry = new THREE.PlaneGeometry(this.width, this.height, 1);
        var c = new THREE.Mesh(cursor_plane_geometry, cursor_material);
        c.userData.name = cursor_name;
        c.visible = false;
        this.object3D.add(c);
        //this.scene.add(c);
        this.cursors[cursor_name] = c;
    },

    is_currently_visible: function() {
        return this.current_cursor.visible;
    },

    set_data: function(data) {
        this.set_cursor(data[1]);
        this.current_floating_wall = data[2];
        this.current_floating_wall.currently_engaged_with_cursor = true;
        this.cursor_needed_from_floating_walls = true;
        this.set_position(data[0]);
    },

    update: function() {
        if (this.cursor_needed_from_floating_walls || this.cursor_needed_from_interactive_objects) {
            this.current_cursor.visible = true;
            this.cursor_needed_from_floating_walls = false;
            this.cursor_needed_from_interactive_objects = false;
        } else {
            if (!this.engaged) {
                this.current_cursor.visible = false;
            }
        }

        if (this.engaged) {
            if (is_defined(this.current_floating_wall)) {
                this.current_floating_wall.perform_action(this.current_cursor.userData.name);
            }
        }

        // TODO : Update the late positions here.
    },

    set_cursor: function(cursor_type) {
        if (this.cursors.hasOwnProperty(cursor_type)) {
            if (this.cursors[cursor_type] !== this.current_cursor) {
                this.previous_cursor = this.current_cursor;
                this.previous_cursor.visible = false;
                this.current_cursor = this.cursors[cursor_type];
            }
        }
    },

    get_position: function() {
        return this.object3D.position;
    },

    set_position: function(position) {
        var cursor_offset = 2;

        var normal;
        if (is_defined(this.world.currently_looked_at_object)) {
            normal = this.world.currently_looked_at_object.normal;
        } else {
            normal = this.current_floating_wall.normal;
        }

        // TODO : determine if there needs to be a horizontal shift as well.

        // TODO : The cursor position needs to be fixed (x-y offset)
        var cursor_look_at = new THREE.Vector3(position.x + normal.x * 4, position.y - this.height / 2, position.z + normal.z * 4);
        this.object3D.position.set(position.x + normal.x * cursor_offset, position.y - this.height / 2, position.z + normal.z * cursor_offset);
        this.object3D.lookAt(cursor_look_at);
    }
};