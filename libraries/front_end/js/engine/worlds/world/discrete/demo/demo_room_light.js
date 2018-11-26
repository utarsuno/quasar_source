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

    _get_light: function(color, intensity, width=null) {
        if (width != null) {
            return new THREE.RectAreaLight(color, intensity, this.get_size() / 4, width);
        } else {
            return new THREE.RectAreaLight(color, intensity, this.get_size() / 4, this.depth);
        }
    },

    _get_mesh: function(width=null) {
        if (width != null) {
            return new THREE.Mesh(new THREE.PlaneGeometry(this.get_size() / 4, width), new THREE.MeshBasicMaterial());
        } else {
            return new THREE.Mesh(new THREE.PlaneGeometry(this.get_size() / 4, this.depth), new THREE.MeshBasicMaterial());
        }
    },

    _get_light_aura: function(color, target) {
        let l = new THREE.SpotLight(color, 1000, 200, 0.85, 0.4, 2.0);
        //l.position.y = -1;
        //target.updateMatrixWorld();
        l.target = target;
        return l;
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
        this.tile.group.add(o);
        if (add_to_scene) {
            this.tile.room.world.scene.add(o);
        }
        return o;
    },

    _update_directions: function() {
        this._l.updateMatrix();
        this._l.updateMatrixWorld();
        //this._la.updateMatrix();
        //this._la.updateMatrixWorld();
    },

    _create_lights: function() {
        this._set(this._get_light(QE.COLOR_WHITE, 4, this.get_size() / 4), 'down');
        this._l  = this._set(this._get_mesh(this.get_size() / 4), 'down');
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
