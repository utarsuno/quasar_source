'use strict';

$_QE.prototype.DemoRoomLight = function(depth, tile) {
    this.depth = depth;
    this.tile  = tile;
    this._create_lights();
};

$_QE.prototype.DemoRoomLight.prototype = {

    get_size: function() {
        return this.tile.room.tile_size;
    },

    _get_light_ray: function(color, intensity, distance) {
        return new THREE.SpotLight(color, intensity, distance, 1.55, 1, 2.0);
    },

    _get_light_bulb: function(color, intensity, distance) {
        let pl        = new THREE.PointLight(color, intensity, distance, 1.25);
        pl.caseShadow = true;
        pl.shadow.mapSize.width  = 4086;
        pl.shadow.mapSize.height = 4086;
        pl.shadow.camera.near    = 1;
        pl.shadow.camera.far     = 4086;

        pl.shadow.camera.left   = -128;
        pl.shadow.camera.bottom = -128;
        pl.shadow.camera.right  = 128;
        pl.shadow.camera.top    = 128;

        return pl;
    },

    _set: function(o, direction, x=0, y=null, z=0, add_to_scene=false) {
        o.position.x += x;
        if (y == null) {
            o.position.y = this.get_size() - this.depth;
        } else {
            o.position.y = y;
        }
        o.position.z += z;
        if (direction == 'down') {
            o.lookAt(0, -1, 0);
        } else if (direction == 'left') {
            o.lookAt(1, 0, 0);
        } else if (direction == 'right') {
            o.lookAt(-1, 0, 0);
        } else if (direction == 'up') {
            o.lookAt(0, 1, 0);
        } else if (direction == 'forward') {
            o.lookAt(0, 0, 1);
        } else if (direction == 'backward') {
            o.lookAt(0, 0, -1);
        }
        o.updateMatrix();
        //
        o.updateMatrixWorld();
        //
        this.tile.group.add(o);
        //if (add_to_scene) {
        //    this.tile.room.world.scene.add(o);
        //}
        return o;
    },

    _update_directions: function() {
        //this._l.updateMatrix();
        //this._l.updateMatrixWorld();

        //this._la.updateMatrix();
        //this._la.updateMatrixWorld();

        this._l0.updateMatrix();
        this._l0.updateMatrixWorld();
        this._l1.updateMatrix();
        this._l1.updateMatrixWorld();

        let p = new THREE.Vector3();
        this._l0.getWorldPosition(p);
        l(p);

        let p2 = new THREE.Vector3();
        this._l1.getWorldPosition(p2);
        l(p2);

        this._l1.target.position.set(
            p.x, p.y - this.get_size() / 2, p.z
        );
        this._l1.target.updateMatrix();
        this._l1.target.updateMatrixWorld();

        //this._l1.updateMatrixWorld();



        ////
        this._l0.position.y = this.get_size() - (this.get_size() * .2);
        this._l0.updateMatrix();
    },

    _create_lights: function() {
        this._l0 = this._set(this._get_light_bulb(QE.COLOR_BLUE_LIGHT, 2, this.get_size()), 'down');
        this._l1 = this._set(this._get_light_ray(QE.COLOR_WHITE, 0.75, this.get_size() * 1.75), 'down');



        //this._l  = this._set(this._get_mesh(this.get_size() / 4), 'down');
        //this._la = this._set(this._get_light_aura(QE.COLOR_RED, this._l), null, 0, 1024 - this.depth - 100, 0, true);

        //la.target.updateMatrix();
        //la.target.updateMatrixWorld();
        //la.updateMatrix();
        //la.updateMatrixWorld();

        /*
        // bezel left
        this._set(this._get_light(QE.COLOR_BLUE, 2), 'left', 128, 1024 - this.depth / 2);
        this._set(this._get_mesh(), 'left');

        // bezel right
        this._set(this._get_light(QE.COLOR_RED, 2), 'right', -128, 1024 - this.depth / 2);
        this._set(this._get_mesh(), 'right');

        // bezel forward
        this._set(this._get_light(QE.COLOR_YELLOW, 2), 'forward', 0, 1024 - this.depth / 2, 128);
        this._set(this._get_mesh(), 'forward');

        // bezel backward
        this._set(this._get_light(QE.COLOR_WHITE, 2), 'backward', 0, 1024 - this.depth / 2, -128);
        this._set(this._get_mesh(), 'backward');
        */
    },

};
