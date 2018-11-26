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

    this.group        = new THREE.Group();
    this.group.position.set(this.x * this.get_size(), 0, this.y * this.get_size());
    this.group.updateMatrix();
};

$_QE.prototype.DemoRoomTile.prototype = {

    get_size: function() {
        return this.room.tile_size;
    },

    is_matched: function(x, y) {
        return this.x == x && this.y == y;
    },

    initialize_neighbors: function() {
        this.has_left  = this.room._has_tile(this.x - 1, this.y);
        this.has_right = this.room._has_tile(this.x + 1, this.y);
        this.has_up    = this.room._has_tile(this.x, this.y + 1);
        this.has_down  = this.room._has_tile(this.x, this.y - 1);
    },

    _update_lights: function() {
        this._room_lights._update_directions();
    },

    _create_tile: function() {
        this._create_floor();
        this._create_ceiling();
        //new $_QE.prototype.DemoRoomLight(36, this);
        //this._room_lights = new $_QE.prototype.DemoRoomLight(2, this);
        this._room_lights = new $_QE.prototype.DemoRoomLight(32, this);
        this._create_walls();
    },

    _create_floor: function() {
        let geo = new THREE.PlaneGeometry(this.get_size(), this.get_size());
        let material = new THREE.MeshPhongMaterial({
        //let material = new THREE.MeshStandardMaterial({
            normalMap      : QE.manager_assets.get_asset(ASSET_TEXTURE_HARDWOOD_NORMAL),
            map            : QE.manager_assets.get_asset(ASSET_TEXTURE_HARDWOOD_COLOR),
            displacementMap: QE.manager_assets.get_asset(ASSET_TEXTURE_HARDWOOD_GLOSS),

            specularMap    : QE.manager_assets.get_asset(ASSET_TEXTURE_HARDWOOD_SPEC),

            //aoMap          : QE.manager_assets.get_asset(ASSET_TEXTURE_TILE_OCCULANT),
            //envMap         : QE.manager_assets.get_asset(ASSET_TEXTURE_HARDWOOD_GLOSS),
            //lightMap       : QE.manager_assets.get_asset(ASSET_TEXTURE_HARDWOOD_GLOSS),
            //specularMap    : QE.manager_assets.get_asset(ASSET_TEXTURE_HARDWOOD_SPEC), // specular
            //color          : 0x939393,
            //color          : 0xb2dde6,
            side           : THREE.FrontSide,

            roughness      : 0.4,

            // Test
            shininess: 50,

            // Test
            specular: QE.COLOR_BLUE_LIGHT,
        });
        //var a = '#b2dde6';
        let mesh = new THREE.Mesh(geo, material);

        mesh.lookAt(0, 1, 0);
        mesh.updateMatrix();

        mesh.receiveShadow = true;

        this.group.add(mesh);
    },

    _create_ceiling: function() {
        let geo      = new THREE.PlaneGeometry(this.get_size(), this.get_size());
        //let material = new THREE.MeshStandardMaterial({
        let material = new THREE.MeshPhongMaterial({
            color : QE.COLOR_WHITE,
            side  : THREE.FrontSide,
            reflectivity : 0.6,
            lights: true,
        });
        material.needsUpdate = true;
        let mesh             = new THREE.Mesh(geo, material);
        mesh.position.set(0, this.get_size(), 0);
        mesh.lookAt(0, -1, 0);
        mesh.updateMatrix();
        this.group.add(mesh);
    },

    _create_wall: function() {
        let geo      = new THREE.PlaneGeometry(this.get_size(), this.get_size());
        /*
        let material = new THREE.MeshStandardMaterial({
            color      : QE.COLOR_BLACK,
            side       : THREE.DoubleSide,
            transparent: true,
            opacity    : .90,
            lights     : true,
            roughness  : .3,
            //metalness  : .3
        });
        */

        //let refractSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
        //this.group.add(refractSphereCamera);
        //refractSphereCamera.renderTarget.mapping = new THREE.CubeRefractionMapping();
        //refractSphereCamera.renderTarget.texture.mapping = new THREE.CubeRefractionMapping();

        let refractMaterial = new THREE.MeshPhongMaterial({
            color          : 0xccccff,

            //envMap         : refractSphereCamera.renderTarget,
            //refractionRatio: 0.985,
            //reflectivity   : 0.9,

            side           : THREE.FrontSide,
            transparent    : true,
            opacity        : .75,



            //lights         : true

        });

        refractMaterial.needsUpdate = true;
        //material.needsUpdate = true;
        //let mesh             = new THREE.Mesh(geo, material);
        let mesh             = new THREE.Mesh(geo, refractMaterial);
        mesh.position.y += this.get_size() / 2;

        mesh.castShadow    = true;
        mesh.receiveShadow = true;

        //refractSphereCamera.position = mesh.position;
        return mesh;
    },

    _add_wall: function(w) {
        w.updateMatrix();
        this.group.add(w);
    },

    _create_walls: function() {
        if (!this.has_left) {
            let w = this._create_wall();
            w.lookAt(1, 0, 0);
            w.position.x -= this.get_size() / 2;
            this._add_wall(w);
        }
        if (!this.has_right) {
            let w = this._create_wall();
            w.lookAt(-1, 0, 0);
            w.position.x += this.get_size() / 2;
            this._add_wall(w);
        }
        if (!this.has_up) {
            let w = this._create_wall();
            w.lookAt(0, 0, -1);
            w.position.z += this.get_size() / 2;
            this._add_wall(w);
        }
        if (!this.has_down) {
            let w = this._create_wall();
            w.lookAt(0, 0, 1);
            w.position.z -= this.get_size() / 2;
            this._add_wall(w);
        }
    },
};
