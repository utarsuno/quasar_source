'use strict';

$_NL.prototype.FloatingTerminal = function(world, number_of_rows, font) {

    // Inherit.
    $_QE.prototype.FeatureSize.call(this, 1024, number_of_rows * font[1]);
    $_QE.prototype.FloatingElement.call(this, world);
    $_QE.prototype.FeatureTextLines.call(this, number_of_rows);
    $_QE.prototype.CanvasFont.call(this, font);
    $_QE.prototype.CanvasTexture.call(this, null, CANVAS_GUI_2D_ABSOLUTE_PIXELS, CANVAS_RENDERING_ROWS);

    $_QE.prototype.FeatureInteractive.call(this);
    $_QE.prototype.FeatureClickable.call(this, true);
    $_QE.prototype.FeatureTyping.call(this);

    this.add_message = function(m) {
        this.add_row(m);
    };

    this.on_post_render = function() {
        this.material.needsUpdate = true;
    };

    this.create_base_material = function() {
        this.material = new THREE.MeshToonMaterial({
            map : this.texture, transparent: true, side: THREE.FrontSide
        //    map : this.texture, transparent: false, side: THREE.DoubleSide
        });
        //this.material.transparent = true;
        //this.material.side = THREE.FrontSide;
    };

    this.create_base_mesh = function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    };

    /*__   __        __  ___  __        __  ___  __   __
     /  ` /  \ |\ | /__`  |  |__) |  | /  `  |  /  \ |__)
     \__, \__/ | \| .__/  |  |  \ \__/ \__,  |  \__/ |  \ */
    this.on_engage = function() {
        QE.player.set_state(PLAYER_STATE_ENGAGED);
    };

    this.initialize_terminal = function() {
        this.initialize(this.width, this.height);

        //this.override_background_color = FLOATING_TEXT_BACKGROUND_DEFAULT;
        //this.override_background_color = FLOATING_TEXT_BACKGROUND_DARK_GRAY;
        this.set_background_color(FLOATING_TEXT_BACKGROUND_DARK_GRAY);
        this.set_foreground_color(COLOR_GREEN);
        //this.override_foreground_color = 'orange';
        //this.override_foreground_color = COLOR_GREEN;

        this.create_base_material();
        this.create_base_mesh();

        this.world.add_element_interactive(this);
        this.world.add_element_root(this);

        $_QE.prototype.FeatureOutlineGlow.call(this, null, null, this.on_engage.bind(this), null);
        //$_QE.prototype.CloseButton.call(this);

        this.update();
    };

};