'use strict';

$_QE.prototype.DemoRoomTile = function(x, y, home_tile, demo_room) {
    this.room         = demo_room;
    this.is_home_tile = home_tile;
    this.x            = x;
    this.y            = y;
    this.has_left     = false;
    this.has_right    = false;
    this.has_up       = false;
    this.has_down     = false;
};

$_QE.prototype.DemoRoomTile.prototype = {

    is_matched: function(x, y) {
        return this.x == x && this.y == y;
    },

    initialize_neighbors: function() {
        this.has_left  = this.room._has_tile(this.x - 1, this.y);
        this.has_right = this.room._has_tile(this.x + 1, this.y);
        this.has_up    = this.room._has_tile(this.x, this.y + 1);
        this.has_down  = this.room._has_tile(this.x, this.y - 1);
    },

    _get_mat: function() {
        let material = new THREE.MeshStandardMaterial({
            displacementMap: QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_DISPLACMENT),
            map            : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_COLOR),
            normalMap      : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_NORMAL),
            aoMap          : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_OCCULANT),

            envMap         : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_ROUGH),
            //specularMap    : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_ROUGH), // specular

            //color          : 0x939393,
            color          : 0xb2dde6,
            side           : THREE.DoubleSide
        });
        return material;
    },

    _create_floor: function() {
        let geo = new THREE.PlaneGeometry(1024, 1024);
        let mesh = new THREE.Mesh(geo, this._get_mat());
        mesh.position.x = this.x * 1024;
        mesh.position.y = this.y * 1024;
        mesh.updateMatrix();
        return mesh;
        //this.floor.add(mesh);
    },

    _create_ceiling: function() {
        let geo = new THREE.PlaneGeometry(1024, 1024);
        let material = new THREE.MeshLambertMaterial({color: QE.COLOR_WHITE, side: THREE.DoubleSide});
        let mesh = new THREE.Mesh(geo, material);
        mesh.position.x = this.x * 1024;
        mesh.position.y = this.y * 1024;
        mesh.position.z = 1024;
        mesh.updateMatrix();
        this._ceiling = mesh;
        return mesh;
    },

    _create_wall: function() {
        let geo = new THREE.PlaneGeometry(1024, 1024);
        let material = new THREE.MeshLambertMaterial({color: QE.COLOR_BLUE, side: THREE.FrontSide, transparent: true, opacity: .25});
        let mesh = new THREE.Mesh(geo, material);
        mesh.position.x = this.x * 1024;
        mesh.position.y = this.y * 1024;
        mesh.position.z = 512;
        mesh.updateMatrix();
        return mesh;
    },

    _create_light: function() {
        let p = new THREE.Vector3();
        this._ceiling.updateMatrixWorld();
        p.setFromMatrixPosition(this._ceiling.matrixWorld);
        l(p);
        this._light = new THREE.PointLight(0xccffcc, .6, 10240, 2);
        this._light.position.set(p.x, p.y - 5, p.z);
        this._light.updateMatrix();
        return this._light;
    },

    _create_walls: function() {
        let walls = [];
        if (!this.has_left) {
            walls.push(this._create_wall());
        } else {
            walls.push(null);
        }
        if (!this.has_right) {
            walls.push(this._create_wall());
        } else {
            walls.push(null);
        }
        if (!this.has_up) {
            walls.push(this._create_wall());
        } else {
            walls.push(null);
        }
        if (!this.has_down) {
            walls.push(this._create_wall());
        } else {
            walls.push(null);
        }
        return walls;
    },
};
