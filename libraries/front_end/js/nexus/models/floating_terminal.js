'use strict';

$_NL.prototype.FloatingTerminal = function(world, number_of_rows, font) {

    this.height = number_of_rows * font[1];
    this.width = 1024;

    this.position = new THREE.Vector3(0, 0, 0);
    this.normal   = new THREE.Vector3(0, 0, 0);

    // Inherit.
    $_QE.prototype.FloatingElement.call(this, world);
    $_QE.prototype.CanvasLines.call(this, number_of_rows, font);
    $_QE.prototype.CanvasTexture.call(this, null, CANVAS_GUI_2D_ABSOLUTE_PIXELS, CANVAS_RENDERING_ROWS);

    //this.position = new THREE.Vector3(0, 0, 0);

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

    this.initialize_terminal = function() {
        this.initialize(this.width, this.height);

        //this.override_background_color = FLOATING_TEXT_BACKGROUND_DEFAULT;
        this.override_background_color = FLOATING_TEXT_BACKGROUND_DARK_GRAY;
        this.set_background_color(FLOATING_TEXT_BACKGROUND_DARK_GRAY);
        //this.override_foreground_color = 'orange';
        this.override_foreground_color = COLOR_GREEN;

        this.create_base_material();
        this.create_base_mesh();

        this.world.root_attachables.push(this);
        this.world.interactive_objects.push(this);

        this.update();
    };

    /* __  ___      ___  ___     __                  __   ___  __
      /__`  |   /\   |  |__     /  ` |__|  /\  |\ | / _` |__  /__`
      .__/  |  /~~\  |  |___    \__, |  | /~~\ | \| \__> |___ .__/ */
    this.state_change_look_at = function(being_looked_at) {
        //l('Terminal being looked at: ' + being_looked_at);
        if (being_looked_at) {
            //this.set_background_color(BACKGROUND_COLOR_FOCUS, true);
            QE.manager_renderer.outline_glow.set_hover_object(this.object3D);
        } else {
            //this.set_background_color(this.default_background_color, true);
            QE.manager_renderer.outline_glow.remove_hover_object(this.object3D);
        }
    };

    // TODO : Reformat engage / disengage logic.
    this.state_change_engage = function(being_engaged_with) {
        //l('Terminal being engaged with: ' + being_engaged_with);
        if (being_engaged_with) {
            QE.player.set_state(PLAYER_STATE_ENGAGED);
            QE.manager_renderer.outline_glow.set_to_engage_color();
        } else {
            QE.manager_renderer.outline_glow.set_to_hover_color();
        }
        //this.color_changed = true;
        //this.refresh();
    };
};