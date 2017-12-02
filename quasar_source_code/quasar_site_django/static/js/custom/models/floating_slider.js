'use strict';

function FloatingSlider(slider_title, current_value, minimum_value, maximum_value, width, position, normal, world) {
    this.__init__(slider_title, current_value, minimum_value, maximum_value, width, position, normal, world);
}

FloatingSlider.prototype = {

    minimum_value: null,
    maximum_value: null,
    current_value: null,

    slider_increased: function() {
        if (this.current_value < this.maximum_value) {
            this.current_value += this.one_percent_value;
        }
        if (this.current_value > this.maximum_value) {
            this.current_value = this.maximum_value;
        }
        this.update();
    },

    slider_decreased: function() {
        if (this.current_value > this.minimum_value) {
            this.current_value -= this.one_percent_value;
        }
        if (this.current_value < this.minimum_value) {
            this.current_value = this.minimum_value;
        }
        this.update();
    },

    update: function() {
        this.current_percentage = (this.current_value - this.minimum_value) / (this.maximum_value - this.minimum_value);
        this.current_value = (this.current_percentage * (this.maximum_value - this.minimum_value) + this.minimum_value);

        var current_value_text = round_to_n_decimal_places(this.current_value.toString(), 3);

        this.current_value_text.update_text(current_value_text);
        this.current_value_text.update_position_and_look_at(this._get_current_position_on_slider(0, 50, 0), this._get_current_look_at_on_slider(0, 50, 0));
        this.slider_object.update_position_and_look_at(this._get_current_position_on_slider(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2), this._get_current_look_at_on_slider(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2));

        // World manager won't be defined on the first call to update.
        // TODO : Eventually change the design then
        if (is_defined(MANAGER_WORLD)) {
            CURRENT_PLAYER.look_at(this.slider_object.get_position());
        }

        if (is_defined(this.value_changed_function)) {
            this.value_changed_function(this.current_value);
        }
    },

    __init__: function(slider_title, current_value, minimum_value, maximum_value, width, position, normal, world) {
        this.object3D = new THREE.Object3D();

        // Visibility must be inherited after interactive.
        Interactive.call(this);
        Visibility.call(this);

        this.current_value     = current_value;
        this.minimum_value     = minimum_value;
        this.maximum_value     = maximum_value;
        this.one_percent_value = (this.maximum_value - this.minimum_value) * 0.01;
        this.width             = width;
        this.position          = position;
        this.normal            = normal;
        this.world             = world;
        this.slider_title      = slider_title;

        this.left_right = new THREE.Vector3(0, 1, 0);
        this.left_right.cross(this.normal);
        this.left_right.normalize();

        // Create the slider wall here.
        this.wall = new PlaneAPI(this.width, 20);
        this.object3D.add(this.wall.mesh);

        // Create the actual slider object.
        var current_percentage = (this.current_value - this.minimum_value) / (this.maximum_value - this.minimum_value);
        this.current_value_text = new Floating2DText(100, current_percentage.toString(), COLOR_TEXT_CONSTANT, this.world.scene);
        this.slider_object = new Floating2DText(12, '|||||||||', COLOR_TEXT_CONSTANT, this.world.scene);

        // Minimum Value Label
        this.minimum_value_label = new Floating2DText(25, this.minimum_value.toString(), TYPE_CONSTANT_TEXT, this.world.scene);
        this.minimum_value_label.update_position_and_look_at(this.get_position_on_slider_based_off_percentage(0, 0, -40, 0), this.get_look_at_on_slider_based_off_percentage(0, 0, -40, 0));

        // Maximum Value Label
        this.maximum_value_label = new Floating2DText(25, this.maximum_value.toString(), TYPE_CONSTANT_TEXT, this.world.scene);
        this.maximum_value_label.update_position_and_look_at(this.get_position_on_slider_based_off_percentage(1, 0, -40, 0), this.get_look_at_on_slider_based_off_percentage(1, 0, -40, 0));

        // Slider Title.
        this.slider_floating_title = new Floating2DText(this.width / 2.0, this.slider_title, TYPE_TITLE, this.world.scene);
        this.slider_floating_title.update_position_and_look_at(this.get_position_on_slider_based_off_percentage(.5, 0, -40, 0), this.get_look_at_on_slider_based_off_percentage(.5, 0, -40, 0));

        this.object3D.position.x = position.x;
        this.object3D.position.y = position.y;
        this.object3D.position.z = position.z;
        this.object3D.lookAt(new THREE.Vector3(position.x + normal.x, position.y + normal.y, position.z + normal.z));

        this.current_value_text.update_position_and_look_at(this._get_current_position_on_slider(0, 40, 0), this._get_current_look_at_on_slider(0, 40, 0));
        this.slider_object.update_position_and_look_at(this._get_current_position_on_slider(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2), this._get_current_look_at_on_slider(this.normal.x * 2, this.normal.y * 2, this.normal.z * 2));
        this.slider_object.requires_mouse_x_movement = true;

        this.slider_object.bind_slider_delta_x_functions(this.slider_increased.bind(this), this.slider_decreased.bind(this));

        this.world.scene.add(this.object3D);
        this.world.interactive_objects.push(this.slider_object);

        this.value_changed_function = null;

        // Update once initially to set the floating % title.
        this.update();
    },

    get_current_value: function() {
        return this.current_value;
    },

    get_position_on_slider_based_off_percentage: function(percentage, x_offset, y_offset, z_offset) {
        var position = new THREE.Vector3(this.position.x, this.position.y, this.position.z);

        if (percentage < 0.5) {
            position.addScaledVector(this.left_right, (percentage * this.width) - (this.width * 0.5));
        } else {
            position.addScaledVector(this.left_right, (percentage - 0.5) * this.width);
        }
        if (is_defined(x_offset)) {
            position.x += x_offset;
        }
        if (is_defined(y_offset)) {
            position.y += y_offset;
        }
        if (is_defined(z_offset)) {
            position.z += z_offset;
        }
        return position;
    },

    get_look_at_on_slider_based_off_percentage: function(percentage, x_offset, y_offset, z_offset) {
        var position = this.get_position_on_slider_based_off_percentage(percentage, x_offset, y_offset, z_offset);
        return new THREE.Vector3(position.x + this.normal.x, position.y + this.normal.y, position.z + this.normal.z);
    },

    _get_current_position_on_slider: function(x_offset, y_offset, z_offset) {
        return this.get_position_on_slider_based_off_percentage((this.current_value - this.minimum_value) / (this.maximum_value - this.minimum_value), x_offset, y_offset, z_offset);
    },

    _get_current_look_at_on_slider: function(x_offset, y_offset, z_offset) {
        var position = this._get_current_position_on_slider(x_offset, y_offset, z_offset);
        return new THREE.Vector3(position.x + this.normal.x, position.y + this.normal.y, position.z + this.normal.z);
    }

}