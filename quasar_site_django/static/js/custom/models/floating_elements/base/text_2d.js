'use strict';

const FLOATING_TEXT_BACKGROUND_DEFAULT = 'rgba(20, 20, 20, .25)';
const FLOATING_TEXT_BACKGROUND_ERROR = 'rgba(57, 0, 6, .25)';
const FLOATING_TEXT_BACKGROUND_SUCESS = 'rgba(30, 63, 30, .25)';


function Text2D(world, width, height, text) {

    // Inherit.
    FloatingElement.call(this, world);
    TextAbstraction.call(this, text);

    this.canvas = new CanvasAbstraction(width, height);

    this.needs_hex_colors = true;

    this.width = width;
    this.height = height;

    this.refresh = function() {
        this.canvas.render(this.get_current_background_color(), this.get_current_foreground_color(), false, this.text);
        this.material.needsUpdate = true;
    };

    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
    this.initialize = function() {
        this.canvas.initialize();
        this.create_base_material();
        this.create_base_mesh();
    };

    this.create_base_material = function() {
        this.material = new THREE.MeshBasicMaterial({
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
}