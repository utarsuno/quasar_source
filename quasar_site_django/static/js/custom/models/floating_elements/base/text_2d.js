'use strict';

function Text2D(world, width, height, text) {

    // Inherit.
    FloatingElement.call(this, world);
    TextAbstraction.call(this, text);

    this.canvas = new CanvasTexture(width, height);
    this.fixed_width = true;

    this.initialized = false;

    this.needs_hex_colors = true;

    this.width = width;
    this.height = height;

    this.process_width = function() {
        if (!is_defined(this.width)) {
            this._original_text_width = MANAGER_TEXT_2D.get_width_needed(text, height);
            this.width = get_nearest_power_of_two_for_number(this._original_text_width);
            this.set_to_dynamic_width();
        }
    };

    this.refresh = function() {
        if (this.initialized) {

            if (!this.fixed_width) {

                l('TODO : Update for fixed width!');
                l(this.text_changed);
                l(this.color_changed);

            } else {
                this.canvas.update(this.get_current_background_color(), this.get_current_foreground_color(), this.get_display_text());
                this.material.needsUpdate = true;
            }

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

            //l('Rendering the following text: ' + this.get_display_text());
            //this.canvas.update(this.get_current_background_color(), this.get_current_foreground_color(), this.get_display_text());
            //this.material.needsUpdate = true;
        }
    };

    /*__   ___ ___ ___  ___  __   __
     /__` |__   |   |  |__  |__) /__`
     .__/ |___  |   |  |___ |  \ .__/ */
    this.set_to_dynamic_width = function() {
        this.fixed_width = false;
    };

    this.set_text_property_centered = function (is_centered) {
        this.canvas.set_font_property_centered(is_centered);
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
        this.process_width();

        this.canvas.initialize();

        let fixed_width = this.canvas.fixed_width;
        if (!fixed_width) {
            this.ratio = this._original_text_width / this.canvas.width;
        }

        this.create_base_material();
        this.create_base_mesh();
        this.initialized = true;
        this.refresh();
    };

    this.create_base_material = function() {
        this.material = new THREE.MeshToonMaterial({
            map : this.canvas.texture, transparent: true, side: THREE.FrontSide
        });
        this.material.transparent = true;
        this.material.side = THREE.FrontSide;
    };

    this.create_base_mesh = function() {
        let fixed_width = this.canvas.fixed_width;

        if (!fixed_width) {
            this.width *= this.ratio;
            this.geometry = new THREE.PlaneGeometry(this.width, this.height);

            //l(this.width);
            //l(this.canvas.width);
            //l(this._original_text_width);

            this.ratio = this._original_text_width / this.canvas.width;

            //l(this.ratio);

            this.geometry.faceVertexUvs[0][0][2].x = this.ratio;
            this.geometry.faceVertexUvs[0][1][1].x = this.ratio;
            this.geometry.faceVertexUvs[0][1][2].x = this.ratio;

            this.geometry.uvsNeedUpdate = true;

        } else {
            this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        }

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    };
}