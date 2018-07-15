'use strict';

$_QE.prototype.FloatingIconButton = function(world, icon_type, size, engage_function) {

    this.floating_icon = new $_QE.prototype.FloatingIcon(world, icon_type, size);
    this.floating_icon.set_current_foreground_color(COLOR_GREEN, true);
    //this.add_floating_element(null, null, 1, this.floating_icon);


    $_QE.prototype.FeatureInteractive.call(this);
    $_QE.prototype.FeatureClickable.call(this, false);

    this.set_engage_function(engage_function);

    this.icon_type = icon_type;
    this.width = size;
    this.height = size;


    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
    this.create_base_material = function() {
        this.material = new THREE.MeshBasicMaterial({opacity: 0.01, transparent: true, side: THREE.FrontSide});
    };

    this.create_base_mesh = function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    };

    this.create_base_material();
    this.create_base_mesh();

    $_QE.prototype.FeatureOutlineGlow.call(this, null, null, null, null);
};
