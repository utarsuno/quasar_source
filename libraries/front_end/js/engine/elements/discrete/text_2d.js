'use strict';

$_QE.prototype.Text2D = function(text, width, height, font, interactive=false, color=null) {
    this.text = text;

    // TODO: USE WIDTH!

    let w = QE.manager_text2D.get_text_width(text, font);

    l('The needed width is {' + w + '}');

    this.initialize_floating_element_data();

    if (color != null) {
        this.set_colors(color, QE.COLOR_RGBA_TRANSPARENT);
    } else {
        this.set_colors(QE.COLOR_RGB_GREEN_LIGHT, QE.COLOR_RGBA_TRANSPARENT);
    }

    //this._initialize_renderer_text_internal_canvas(128, font, 'bla');
    this._initialize_renderer_text_internal_canvas(width, font, 'bla');

    this.set_geometry_type(false, FEATURE_GEOMETRY_TYPE_PLANE);
    this.set_material_type(false, FEATURE_MATERIAL_CANVAS_FANCY);
    this.set_mesh_type(false, FEATURE_MESH_TYPE_DEFAULT);

    if (interactive) {
        $_QE.prototype.FeatureTyping.call(this);
    }
    this.set_value_post_changed_event(this._on_text_change.bind(this));
};


Object.assign(
    $_QE.prototype.Text2D.prototype,
    $_QE.prototype.FloatingElement.prototype,
    $_QE.prototype.FeatureText.prototype,
    $_QE.prototype.FeatureSize.prototype,
    $_QE.prototype.FeatureColor.prototype,
    $_QE.prototype.DomElementCanvas.prototype,
    $_QE.prototype.CanvasRenderingTextLine.prototype,
    {
        constructor: $_QE.prototype.Text2D,

        _on_text_change: function(text) {
            //l('Text2D changed!');
            this.set_row_text(text);

            //if (this.attachment_parent != null) {
            //    l(this);
            //}
        },

        create: function() {
            this.create_material();
            this.create_geometry();
            this.create_mesh();

            this._force_refresh();
        },

        // Temporary solution.
        _force_refresh: function() {
            let t = this.text;
            this.update_text('');
            this.update_text(t);
        },
    }
);


/*
    this.process_width = function() {
        if (!(this.width != null)) {
            this._original_text_width = _MANAGER_TEXT_2D.get_width_needed(this.get_display_text(), this.height);
            this.width                = get_nearest_power_of_two_for_number(this._original_text_width);
            this.dynamic_width        = true;
            this.ratio                = this._original_text_width / (get_next_highest_power_of_two(this.width * 2));
        } else {
            this.ratio = 1;
        }
    };

    this.initialize = function() {
        this.process_width();

        if (!this.cacheable_texture) {
            this.canvas.set_dimensions(this.width, this.height);
            this.canvas.initialize();
        } else {
            this.canvas_cache = QE.manager_heap.get_text_2D_canvas(this.width, this.height, this.get_display_text(), this.get_current_background_color(), this.get_current_foreground_color());
        }

        this.create_base_material();
        this.create_base_mesh();
        this.initialized = true;
        this.refresh();
    };

 */

/*
if (!this.cacheable_texture) {
        this.canvas = new $_QE.prototype.CanvasTexture();
    }
    //this.canvas = new CanvasTexture();
    this.initialized = false;

    this.refresh = function() {
        if (this.initialized) {
            if (this.dynamic_width) {
                if (this.text_changed) {
                    this.width = null;
                    this.process_width();
                    if (!this.cacheable_texture) {
                        this.canvas.modify_canvas(this.width, this.height);
                    }
                    this.delete_mesh();
                    this.delete_material();
                    this.create_base_material();
                    this.create_base_mesh();

                    // Update horizontal offset if needed.
                    /*
                    if (this.is_attached()) {
                        if (this.is_left_attachment) {
                            this.offset_horizontal_distance = -this.width / 2;
                        } else if (this.is_right_attachment) {
                            this.offset_horizontal_distance = this.width / 2;
                        }
                        this.attachment_parent.refresh_position_and_look_at();
                    }
                    */
//                }
//            }

/*
            if (!this.cacheable_texture) {
                this.canvas.update(this.get_current_background_color(), this.get_current_foreground_color(), this.get_display_text());
                this.material.needsUpdate = true;
            } else {
                //this._material.needsUpdate = true;
            }

            this.text_changed = false;
            this.color_changed = false;
        }
    };
*/

/*
$_QE.prototype.Text2DUtilities = function() {
    this.canvas = new $_QE.prototype.CanvasAbstraction();
    this.get_width_needed = function(text, height, bold, italic) {
        if (is_defined(bold)) {
            this.canvas.set_font_property_bold(bold);
        }
        if (is_defined(italic)) {
            this.canvas.set_font_property_italic(italic);
        }
        this.canvas._set_height(height);
        this.canvas.set_font();
        return this.canvas.get_text_width(text);
    };
};

const _MANAGER_TEXT_2D = new $_QE.prototype.Text2DUtilities();
*/

//$_QE.prototype.Text2D = function(world, width, height, text) {

