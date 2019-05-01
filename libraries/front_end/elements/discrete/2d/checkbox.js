'use strict';

$_QE.prototype.FloatingCheckbox = function(size, checked, on_checked_function) {
    this.checked             = checked;
    this.on_checked_function = on_checked_function;
    this.__init__floating_element();
    this.set_dimensions(size, size);
};

Object.assign(
    $_QE.prototype.FloatingCheckbox.prototype,
    $_QE.prototype.FloatingIcon.prototype
);


/*
    __init__: function(world, size, checked, on_checked_function) {
        this.set_to_clickable();
        this.icon_checked = new FloatingIcon(this.world, ASSET_ICON_CHECKMARK, size, QE.COLOR_GREEN, true);
        this.create_base_material();
        this.create_base_mesh();
        this.add_floating_element(null, null, 1, this.icon_checked);
        if (this.checked) {
            this.set_checked_state(true);
        } else {
            this.set_checked_state(false);
        }
        this.set_engage_function(this.clicked_on.bind(this));
        return this;
    },
    create_base_material: function() {
        this.material = new THREE.MeshBasicMaterial({opacity: 0.01, transparent: true, side: THREE.FrontSide});
    },
    create_base_mesh: function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    },
    is_checked: function() {
        return this.checked;
    },
    // State changes. ------------------------------------------------------------------------------------
    set_checked_state: function(is_checked) {
        if (is_checked) {
            this.icon_checked.switch_icon_and_color(ASSET_ICON_CHECKMARK, QE.COLOR_GREEN);
            this.checked = true;
        } else {
            this.icon_checked.switch_icon_and_color(ASSET_ICON_CROSS, QE.COLOR_RED);
            this.checked = false;
        }
    },
    clicked_on: function() {
        MANAGER_AUDIO.play_sound(AUDIO_SOUND_CHECKBOX);
        if (this.checked) {
            this.set_checked_state(false);
        } else {
            this.set_checked_state(true);
        }
        if (this.on_checked_function != null) {
            this.on_checked_function(this.checked);
        }
    },
 */
