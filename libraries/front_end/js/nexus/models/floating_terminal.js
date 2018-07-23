'use strict';

$_NL.prototype.FloatingTerminal = function(world, number_of_rows, font) {

    $_QE.prototype.FeatureColor.call(this, COLOR_GREEN, COLOR_DARK_GRAY);

    $_QE.prototype.DomElementCanvas.call(this, 'floating_terminal', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, CANVAS_GUI_2D_ABSOLUTE_PIXELS);
    $_QE.prototype.FeatureTextLines.call(this, number_of_rows);
    $_QE.prototype.FeatureText.call(this, '');
    $_QE.prototype.CanvasFont.call(this, font);

    //$_QE.prototype.FeatureSize.call(this, 1024, number_of_rows * font[1]);
    $_QE.prototype.FloatingElement.call(this, world);

    $_QE.prototype.FeatureInteractive.call(this);
    $_QE.prototype.FeatureClickable.call(this, true);
    $_QE.prototype.FeatureTyping.call(this);

    ///
    $_QE.prototype.FeatureGeometry.call(this, false, FEATURE_GEOMETRY_TYPE_PLANE);
    $_QE.prototype.FeatureMaterial.call(this, false, FEATURE_MATERIAL_CANVAS_FANCY);
    $_QE.prototype.FeatureMesh.call(this, false, FEATURE_MESH_TYPE_DEFAULT);
    ///

    $_QE.prototype.FeatureMouseMove.call(this);

    ///

    this.add_message = function(m) {
        this.add_row(m);
    };

    this.leave_bottom_row_for_input = true;


    /*__   __        __  ___  __        __  ___  __   __
     /  ` /  \ |\ | /__`  |  |__) |  | /  `  |  /  \ |__)
     \__, \__/ | \| .__/  |  |  \ \__/ \__,  |  \__/ |  \ */
    this.on_engage = function() {
        l('Terminal engaged!');
        QE.player.set_state(PLAYER_STATE_ENGAGED);
    };

    this.initialize_terminal = function() {
        this.width = 1024;
        this.height = number_of_rows * font[1];
        this.create_element();
        this.hide();

        this.set_canvas_width(this.width);
        this.set_canvas_height(this.height);

        $_QE.prototype.CanvasTexture.call(this, this._element);

        this.initialize_texture();
        this.create_geometry();
        this.create_material();
        this.create_mesh();

        $_QE.prototype.CanvasRendering.call(this, CANVAS_RENDERING_ROWS);

        this.world.add_element_interactive(this);
        this.world.add_element_root(this);

        $_QE.prototype.FeatureOutlineGlow.call(this, null, null, this.on_engage.bind(this), null);
        //$_QE.prototype.CloseButton.call(this);

    };

};