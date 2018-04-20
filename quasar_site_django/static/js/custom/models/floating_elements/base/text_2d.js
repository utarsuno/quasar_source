'use strict';

function Text2D(world, width, height, text) {

    // Inherit.
    FloatingElement.call(this, world);
    TextAbstraction.call(this, text);

    this.canvas = new CanvasTexture(width, height);

    //if (is_defined(text_properties)) {
    //    this.canvas = new CanvasAbstraction(width, height, text_properties);
    //} else {
    //    this.canvas = new CanvasAbstraction(width, height, null);
    //}

    this.initialized = false;

    this.needs_hex_colors = true;

    this.width = width;
    this.height = height;

    this.refresh = function() {

        if (this.initialized) {

            /*
            if (this.text_changed && !this._fixed_width) {
                this.delete_mesh();
                this.create_base_mesh();
            } else {
                this.canvas.render(this.get_current_background_color(), this.get_current_foreground_color(), this.get_display_text());
            }
            */
            //this.canvas.render(this.get_current_background_color(), this.get_current_foreground_color(), this.get_display_text());
            //this.material.needsUpdate = true;
            //this.text_changed = false;
            //this.color_changed = false;



            this.canvas.render(this.get_current_background_color(), this.get_current_foreground_color(), this.get_display_text());
            this.material.needsUpdate = true;
        }
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_to_fixed_width = function() {
        this.canvas.set_to_fixed_width();
    };

    // TODO : DELETE THIS!
    this.set_text_property_right = function(is_right) {
        this.canvas.text_property_right = is_right;
        //this.refresh();
    };

    this.set_text_property_centered = function (is_centered) {
        this.canvas.set_text_property_centered(is_centered);
        //this.refresh();
    };

    this.set_text_property_bold = function(is_bold) {
        this.canvas.set_font_property_bold(is_bold);
        //this.refresh();
    };

    this.set_text_property_italic = function(is_italic) {
        this.canvas.set_font_property_italic(is_italic);
        //this.refresh();
    };

    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
    this.initialize = function() {
        this.canvas.initialize();
        this.create_base_material();
        this.create_base_mesh();
        this.initialized = true;
        this.refresh();
    };

    this.create_base_material = function() {
        //this.material = new THREE.MeshBasicMaterial({
        //    map : this.canvas.texture, transparent: true, side: THREE.FrontSide
        //});
        this.material = new THREE.MeshToonMaterial({
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