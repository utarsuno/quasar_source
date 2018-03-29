'use strict';

function Text2D(world, width, height, text, text_properties) {

    // Inherit.
    FloatingElement.call(this, world);
    TextAbstraction.call(this, text);

    this.canvas = new CanvasAbstraction(width, height);
    if (is_defined(text_properties)) {
        this.canvas.text_property_italic = text_properties[0];
        this.canvas.text_property_bold   = text_properties[1];
        this.canvas.update_font();
    }

    this.needs_hex_colors = true;

    this.width = width;
    this.height = height;

    this.set_text_property_centered = function (is_centered) {
        this.canvas.text_property_centered = is_centered;
    };

    this.set_text_property_bold = function(is_bold) {
        this.canvas.text_property_bold = is_bold;
        this.canvas.update_font();
    };

    this.set_text_property_italic = function(is_italic) {
        this.canvas.text_property_italic = is_italic;
        this.canvas.update_font();
    };

    this.refresh = function() {
        this.canvas.render(this.get_current_background_color(), this.get_current_foreground_color(), this.get_display_text());
        this.material.needsUpdate = true;
    };

    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
    this.initialize = function() {
        this.canvas.initialize();
        this.create_base_material();
        this.create_base_mesh();
        this.refresh();
    };

    this.create_base_material = function() {
        this.material = new THREE.MeshBasicMaterial({
            map : this.canvas.texture, transparent: true, side: THREE.FrontSide
        });
        this.material.transparent = true;
        this.material.side = THREE.FrontSide;
    };

    this.create_base_mesh = function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    };
}