'use strict';

$_NL.prototype.FloatingTerminal = function(world, number_of_rows, font) {

    // PASSED REFACTOR
    $_QE.prototype.FeatureColor.call(this, QE.COLOR_GREEN, QE.COLOR_CANVAS_GRAY);
    $_QE.prototype.CanvasGUI2D.call(this, 'floating_terminal', DOM_ELEMENT_CONSTRUCTOR_TYPE_ID_NAME_DNE, CANVAS_GUI_2D_ABSOLUTE_PIXELS);
    $_QE.prototype.FeatureTextLines.call(this, number_of_rows, true);

    // BEING REFACTORED!

    //$_QE.prototype.FeatureSize.call(this, 1024, number_of_rows * font[1]);
    //$_QE.prototype.FloatingElement.call(this, world, true);

    $_QE.prototype.FeatureInteractive.call(this, true);
    this.feature_engable_only_from_double_click = true;
    $_QE.prototype.FeatureClickable.call(this, true);

    ///
    $_QE.prototype.FeatureGeometry.call(this, false, FEATURE_GEOMETRY_TYPE_PLANE);
    $_QE.prototype.FeatureMaterial.call(this, false, FEATURE_MATERIAL_CANVAS_FANCY);
    $_QE.prototype.FeatureMesh.call(this, false, FEATURE_MESH_TYPE_DEFAULT);
    ///

    $_QE.prototype.FeatureMouseMove.call(this);

    ///

    this.on_enter_key = function() {
        l('on enter key!');
        let text = this.get_text_and_clear();
        if (text !== '') {
            this.add_text_line_to_bottom(text, QE.COLOR_CANVAS_TEAL);
        }
    };

    /*__   __        __  ___  __        __  ___  __   __
     /  ` /  \ |\ | /__`  |  |__) |  | /  `  |  /  \ |__)
     \__, \__/ | \| .__/  |  |  \ \__/ \__,  |  \__/ |  \ */
    this.on_engage = function() {
        QE.player.set_state(PLAYER_STATE_ENGAGED);
    };

    this.initialize_terminal = function() {
        this.width = 1024;
        this.height = number_of_rows * font[1];

        this.initialize_gui(this.width, this.height, null, null, null, true, false, $_QE.prototype.CANVAS_FONT_SMALLER);

        this.create_geometry();
        this.create_material();
        this.create_mesh();

        $_QE.prototype.CanvasRenderingTextLines.call(this, number_of_rows, true);

        this.world.add_element_interactive(this);
        this.world.add_element_root(this);

        this.on_engage = this.on_engage.bind(this);

        this.on_enter_key_event = this.on_enter_key.bind(this);



        this.title = new $_QE.prototype.FeatureTitleBar(this, 'Terminal Title!', ASSET_ICON_TERMINAL, true);
        this.title.add_settings_button();
        this.title.add_close_button();
    };

};
