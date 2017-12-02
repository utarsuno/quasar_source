'use strict';

function PlaneAPI(w, h) {
    this.__init__(w, h);
}

PlaneAPI.prototype = {
    width    : null,
    height   : null,

    mesh     : null,
    geometry : null,
    material : null,

    scene: null,
    
    __init__: function(w, h) {
        this.width    = w;
        this.height   = h;

        this.object3D = new THREE.Object3D();

        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);

        this.object3D.add(this.geometry.mesh);

        this.create();
    },

    create: function() {
        this.material = new THREE.MeshBasicMaterial({
            color: 0x060606,
            //transparent: true,
            //opacity: 0.85,
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        //var geo = new THREE.EdgesGeometry(this.mesh.geometry); // or WireframeGeometry
        //var mat = new THREE.LineBasicMaterial({color: 0xFFC0CB, linewidth: 3});
        //var wireframe = new THREE.LineSegments(geo, mat);
        //this.mesh.add(wireframe);
    },

    update_position_and_look_at: function(position_vector, look_at_position) {
        this.object3D.position.x = position_vector.x;
        this.object3D.position.y = position_vector.y;
        this.object3D.position.z = position_vector.z;

        var look_at = new THREE.Vector3(look_at_position.x, look_at_position.y + this.height / 2, this.look_at_position.z);

        this.object3D.lookAt(look_at);
    }

};



/*
        var relative_x_shift = this.get_relative_x_shift(x_offset);
        var y_position = this.get_y_position_for_row(row) + additional_y_offset;

        var new_position = new THREE.Vector3(position_vector.x + relative_x_shift.x, position_vector.y + this.height / 2 + y_position + relative_x_shift.y, position_vector.z + relative_x_shift.z);
        new_position.addScaledVector(this.depth_start, z_offset);

        var new_look_at = new THREE.Vector3(position_vector.x + relative_x_shift.x, position_vector.y + this.height / 2 + y_position + relative_x_shift.y, position_vector.z + relative_x_shift.z);
        new_look_at.addScaledVector(this.depth_start, z_offset);
        new_look_at.addScaledVector(this.normal, 10);

        floating_2d_text.update_position_and_look_at(new_position, new_look_at);

 */