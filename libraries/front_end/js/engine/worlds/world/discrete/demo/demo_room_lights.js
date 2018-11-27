'use strict';

Object.assign(
    $_QE.prototype.DemoRoom.prototype,
    // DemoRoom --> light features
    {
        set_ceiling_light_settings: function(color, intensity, distance, decay) {
            let b;
            for (b = 0; b < this._bulbs.length; b++) {
                if (color != null) {
                    this._bulbs[b].color = color;
                }
                if (intensity != null) {
                    this._bulbs[b].intensity = intensity;
                }
                if (distance != null) {
                    this._bulbs[b].distance = distance;
                }
                if (decay != null) {
                    this._bulbs[b].decay = decay;
                }
            }
        },

        //

        _get_light_ray: function(color) {
            return new THREE.SpotLight(color, 0.75,  this.tile_size * 1.75, 1.55, 1, 2.0);
        },

        _get_light_bulb: function(color) {
            let pl = new THREE.PointLight(color, 0.85, this.tile_size + this.tile_size / 2, 1.25);
            /*
            pl.caseShadow = true;
            pl.shadow.mapSize.width  = 4086;
            pl.shadow.mapSize.height = 4086;
            pl.shadow.camera.near    = 1;
            pl.shadow.camera.far     = 4086;

            pl.shadow.camera.left   = -128;
            pl.shadow.camera.bottom = -128;
            pl.shadow.camera.right  = 128;
            pl.shadow.camera.top    = 128;
            */
            return pl;
        },

        _set: function(o, x, y) {
            o.position.set(x * this.tile_size, this.tile_size * (7/10), y * this.tile_size);
            o.lookAt(0, -1, 0);
            o.updateMatrix();
            o.updateMatrixWorld();
            this.group.add(o);
            return o;
        },

        _initialize_cache_light: function() {
            this._bulbs = [];
            this._rays  = [];
        },

        _finalize_cache_lights: function() {
            let l;
            for (l = 0; l < this._rays.length; l++) {
                let p = new THREE.Vector3();
                this._rays[l].getWorldPosition(p);
                this._rays[l].target.position.set(p.x, p.y - 1, p.z);
                this._rays[l].target.updateMatrix();
                this._rays[l].target.updateMatrixWorld();
            }
            /*
            let l;
            for (l = 0; l < this._bulbs.length; l++) {
                this._bulbs[l].updateMatrix();
                this._bulbs[l].updateMatrixWorld();
                this._rays[l].updateMatrix();
                this._rays[l].updateMatrixWorld();

                let p = new THREE.Vector3();
                this._bulbs[l].getWorldPosition(p);

                let p2 = new THREE.Vector3();
                this._rays[l].getWorldPosition(p2);

                this._rays[l].target.position.set(p.x, p.y - this.tile_size / 2, p.z);
                this._rays[l].target.updateMatrix();
                this._rays[l].target.updateMatrixWorld();

                this._bulbs[l].position.y = -this.tile_size;
                this._bulbs[l].updateMatrix();
            }
            */
        },

        _cache_add_lights: function(x, y) {
            let b = this._set(this._get_light_bulb(QE.COLOR_BLUE_LIGHTER), x, y);
            //let r = this._set(this._get_light_ray(QE.COLOR_WHITE), x, y);
            //this.group.add(r.target);
            this._bulbs.push(b);
            //this._rays.push(r);
        },

    }
);
