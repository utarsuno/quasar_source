'use strict';

$_NL.prototype.FloatingTerminal = function(number_of_rows, font) {

    $_QE.prototype.FeatureColor.call(this, QE.COLOR_GREEN, QE.COLOR_CANVAS_GRAY);
    $_QE.prototype.CanvasGUI2D.call(this, 'floating_terminal', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, CANVAS_GUI_2D_ABSOLUTE_PIXELS);
    //$_QE.prototype.FeatureTextLines.call(this, number_of_rows, true);

    $_QE.prototype.FloatingElement.call(this);

    $_QE.prototype.FeatureGeometry.call(this, false, FEATURE_GEOMETRY_TYPE_PLANE);
    $_QE.prototype.FeatureMaterial.call(this, false, FEATURE_MATERIAL_CANVAS_FANCY);
    $_QE.prototype.FeatureMesh.call(this, false, FEATURE_MESH_TYPE_DEFAULT);

    $_QE.prototype.FeaturePosition.call(this);
    $_QE.prototype.FeatureNormal.call(this);

    $_QE.prototype.FeatureInteractive.call(this, true, null, null, null, null);
    this.feature_engable_only_from_double_click = true;
    $_QE.prototype.FeatureClickable.call(this, true);

    //$_QE.prototype.FeatureMouseMove.call(this);

    //$_QE.prototype.FeatureSize.call(this, 1024, number_of_rows * font[1]);

    // TEMP.
    this.width = 1024;
    this.height = 1024;

    this._on_enter_event = function() {
        if (this.get_text_length_without_whitespaces() != 0) {
            this.add_text_line_to_bottom(this.get_text_and_clear(), QE.COLOR_CANVAS_TEAL);
        }
    };

    this.create = function() {
        //this.initialize_gui(this.width, this.height, null, null, null, true, false, $_QE.prototype.CANVAS_FONT_SMALLER);
        this.initialize_gui(this.width, this.height, null, null, null, true, false, font);

        this.create_material();
        this.create_geometry();
        this.create_mesh();

        $_QE.prototype.CanvasRenderingTextLines.call(this, number_of_rows, true, this._on_enter_event.bind(this));
    };
};
