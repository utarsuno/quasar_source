'use strict';


$_NL.prototype.FloatingTerminal = function(world, number_of_rows, font) {

    // Inherit.
    $_QE.prototype.FloatingElement.call(this, world);

    this.position = new THREE.Vector3(0, 0, 0);
    this.normal   = new THREE.Vector3(0, 0, 0);

    //this.position = new THREE.Vector3(0, 0, 0);

    this.initialized = false;

    this.height = number_of_rows * font[1];
    this.width = 1024;

    this._w = this.width;
    this._h = this.height;

    this.canvas = new $_QE.prototype.CanvasConsole(number_of_rows, font);

    this.canvas.override_background_color = FLOATING_TEXT_BACKGROUND_DEFAULT;
    //this.override_foreground_color = 'orange';
    this.canvas.override_foreground_color = COLOR_GREEN;

    this.add_message = function(m) {
        this.canvas.add_message(m);
    };

    this.update = function(delta) {
        this.refresh();
    };

    this.refresh = function() {
        l('Trying to refresh terminal!');
        if (this.initialized) {
            l('refreshing terminal!');
            if (this.canvas.needs_paint) {
                l('needs paint!');
                this.canvas.update_step(this.current_background_color, this.current_foreground_color);
                this.material.needsUpdate = true;
                this.canvas.needs_paint = false;
            }
        }
    };

    this.create_base_material = function() {
        this.material = new THREE.MeshToonMaterial({
        //    map : this.canvas.texture, transparent: true, side: THREE.FrontSide
            map : this.canvas.texture, transparent: false, side: THREE.DoubleSide
        });
        //this.material.transparent = true;
        //this.material.side = THREE.FrontSide;
    };

    this.create_base_mesh = function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    };

    this.initialize = function() {
        this.ratio = 1;
        this.canvas.initialize();
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.canvas._w = this._w;
        this.canvas._h = this._h;


        this.create_base_material();
        this.create_base_mesh();
        this.initialized = true;

        this.world.root_attachables.push(this);

        this.refresh();
    };
};