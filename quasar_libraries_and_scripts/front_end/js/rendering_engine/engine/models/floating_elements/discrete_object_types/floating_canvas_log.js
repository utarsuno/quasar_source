'use strict';

$_QE.prototype.FloatingCanvasLogs = function(world, number_of_rows, width, height) {
    // Inherit.
    $_QE.prototype.FloatingElement.call(this, world);

    this.position = new THREE.Vector3(0, 0, 0);
    //this.normal = new THREE.Vector3(0, 0, 0);
    //this.menu = new FakeFloatingWall(this.menu_width, 100, temp_position, temp_normal, world);
    this.set_attachment_horizontal_offset(-15, null);
    this.set_attachment_vertical_offset(-15, null);
    this.set_attachment_depth_offset(300);

    this.override_background_color = FLOATING_TEXT_BACKGROUND_TRANSPARENT;
    this.override_foreground_color = 'orange';

    this.width = width;
    this.height = height;

    this.canvas = new $_QE.prototype.CanvasConsole(number_of_rows);

    this.initialized = false;

    this.lock_to_player = false;

    this.create_base_material = function() {
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

    this.refresh = function() {
        if (this.initialized) {
            if (this.canvas.needs_paint) {
                this.canvas.update_step(this.get_current_background_color(), this.get_current_foreground_color());
                this.material.needsUpdate = true;
                this.canvas.needs_paint = false;
            }
            if (this.lock_to_player && (is_defined(QE.player.get_position))) {

                let player_position = QE.player.get_position();
                let player_normal   = QE.player.get_direction();

                this.set_normal(-player_normal.x, -player_normal.y, -player_normal.z, false);

                //let position_offset = this.menu_main.menu.get_position_offset(player_normal);
                this.set_position_offset(player_normal);

                let position_x = player_position.x + this._position_offset.x;
                let position_y = player_position.y + this._position_offset.y;
                let position_z = player_position.z + this._position_offset.z;

                this.set_position(position_x, position_y, position_z, false);
                this.refresh_position_and_look_at();
                //this.set_normal(player_position.x - position_x, 0, player_position.z - position_z, false);
            }
        }
    };

    this.initialize = function() {
        this.ratio = 1;
        this.canvas.set_dimensions(this.width, this.height);
        this.canvas.initialize();

        this.create_base_material();
        this.create_base_mesh();
        this.initialized = true;

        this.world.root_attachables.push(this);

        this.refresh();

        l('Canvas initialized!');
    };

    this.add_message = function(m) {
        this.canvas.add_message(m);
    };

    this.update = function(delta) {
        this.refresh();
    };
};

//function FloatingCheckBox(world, size, checked, on_checked_function) {

