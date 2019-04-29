'use strict';

$_QE.prototype.Text2D = function(args) {
    /*this.set_dimensions(width, height);
    let w = QE.manager_text2D.get_text_width(text, font);
    l('The needed width is {' + w + '}');*/

    this.__init__text2d(args);

    if (this._arg_is_on(args, ARG_INTERACTIVE)) {
        $_QE.prototype.FeatureTyping.call(this);
    }
};


Object.assign(
    $_QE.prototype.Text2D.prototype,
    $_QE.prototype.FloatingElementText.prototype,
    $_QE.prototype.DomCanvasTexture.prototype,
    $_QE.prototype.CanvasRenderingTextLine.prototype,
    {
        constructor: $_QE.prototype.Text2D,

        __init__text2d: function(args) {
            args[ARG_GEOMETRY_TYPE]            = FEATURE_GEOMETRY_TYPE_PLANE;
            args[ARG_MATERIAL_TYPE]            = FEATURE_MATERIAL_CANVAS_BASIC;
            args[ARG_MESH_TYPE]                = FEATURE_MESH_TYPE_DEFAULT;
            args[ARG_COLOR_DEFAULT_FOREGROUND] = QE.COLOR_RGB_GREEN_LIGHT;
            args[ARG_COLOR_DEFAULT_BACKGROUND] = QE.COLOR_RGBA_TRANSPARENT;
            args[ARG_NUMBER_OF_ROWS]           = -1;

            this.__init__floating_element();
            this.__init__canvas_texture(args);
            this._parse_arguments_engine(args);
            this._parse_arguments_color(args);
            this._parse_arguments_text(args);
            this._parse_arguments_floating_element(args);
            this.set_value_post_changed_event(this._on_text_change.bind(this));
        },

        _on_text_change: function(text) {
            this.set_row_text(text);
            if (this.attachment_parent != null) {
                this.attachment_parent.flag_set_on(EFLAG_IS_UPDATED_NEEDED_FOR_CHILD);
            }
        },

        create: function() {
            this._create_engine_objects();

            this._force_refresh();

            let self = this;
            this.set_event(ELEMENT_EVENT_ON_FOREGROUND_COLOR, function() {
                self._render_needed = true;
                if (self.attachment_parent != null) {
                    self.attachment_parent.flag_set_on(EFLAG_IS_UPDATED_NEEDED_FOR_CHILD);
                }
            });
            this.set_event(ELEMENT_EVENT_ON_BACKGROUND_COLOR, function() {
                self._render_needed = true;
                if (self.attachment_parent != null) {
                    self.attachment_parent.flag_set_on(EFLAG_IS_UPDATED_NEEDED_FOR_CHILD);
                }
            });
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

/*
$_QE.prototype.Text2D = function(world, width, height, text, cacheable, cacheable_texture) {

    // Inherit.
    $_QE.prototype.FloatingElement.call(this, world);
    $_QE.prototype.FeatureText.call(this, text);

    this.cacheable = cacheable;
    if (is_defined(cacheable_texture)) {
        this.cacheable_texture = cacheable_texture;
    } else {
        this.cacheable_texture = false;
    }

    this.width = width;
    this.height = height;
    this.dynamic_width = false;

    if (!this.cacheable_texture) {
        this.canvas = new $_QE.prototype.CanvasTexture();
    }
    //this.canvas = new CanvasTexture();

    this.initialized = false;
    this.needs_hex_colors = true;

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
                    if (this.is_attached()) {
                        if (this.is_left_attachment) {
                            this.set_attachment_horizontal_distance_offset(-this.width / 2);
                        } else if (this.is_right_attachment) {
                            this.set_attachment_horizontal_distance_offset(this.width / 2);
                        }
                        this.attachment_parent.refresh_position_and_look_at();
                    }
                }
            }

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

    // Creation
    this.process_width = function() {
        if (!is_defined(this.width)) {
            this._original_text_width = _MANAGER_TEXT_2D.get_width_needed(this.get_display_text(), this.height);
            this.width                = get_nearest_power_of_two_for_number(this._original_text_width);
            this.dynamic_width        = true;
            this.ratio                = this._original_text_width / (QE.get_next_highest_power_of_two(this.width * 2));
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

    this.create_base_material = function() {
        if (this.cacheable_texture) {
            this._material = QE.manager_heap.get_text_2D_material(this.width, this.height, this.get_display_text());
        } else {
            this.material = new THREE.MeshToonMaterial({
                map : this.canvas.texture, transparent: true, side: THREE.FrontSide
            });
            this.material.transparent = true;
            this.material.side = THREE.FrontSide;
        }
    };

    this._create_base_mesh = function(geometry) {
        if (is_defined(geometry)) {
            if (this.cacheable_texture) {
                this.mesh = new THREE.Mesh(geometry, this._material);
            } else {
                this.mesh = new THREE.Mesh(geometry, this.material);
            }
        } else {
            if (this.dynamic_width) {
                this.geometry = new THREE.PlaneGeometry(this.width, this.height);

                this.geometry.faceVertexUvs[0][0][2].x = this.ratio;
                this.geometry.faceVertexUvs[0][1][1].x = this.ratio;
                this.geometry.faceVertexUvs[0][1][2].x = this.ratio;

                this.geometry.uvsNeedUpdate = true;
            } else {
                this.geometry = new THREE.PlaneGeometry(this.width, this.height);
            }
            if (this.cacheable_texture) {
                this.mesh = new THREE.Mesh(this.geometry, this._material);
            } else {
                this.mesh = new THREE.Mesh(this.geometry, this.material);
            }
        }
        this.object3D.add(this.mesh);
    };

    this.create_base_mesh = function() {
        if (this.dynamic_width) {
            this.width *= this.ratio;
        }

        if (is_defined(this.cacheable)) {
            if (this.cacheable) {
                this._create_base_mesh(MANAGER_HEAP.get_text_2D_geometry(this.width, this.height, this.ratio));
            } else {
                this._create_base_mesh(null);
            }
        } else {
            this._create_base_mesh(null);
        }
    };
};
*/
