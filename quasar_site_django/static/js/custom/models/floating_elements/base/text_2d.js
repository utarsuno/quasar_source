'use strict';

const TEMP_SMUDGE_FACTOR = 0.75;

const FLOATING_TEXT_BACKGROUND_DEFAULT = 'rgba(20, 20, 20, .25)';
const FLOATING_TEXT_BACKGROUND_ERROR = 'rgba(57, 0, 6, .25)';
const FLOATING_TEXT_BACKGROUND_SUCESS = 'rgba(30, 63, 30, .25)';

function Text2D(world, width, text_height, text) {

    // Inherit.
    FloatingElement.call(this, world);
    TextAbstraction.call(this, text);

    this.needs_hex_colors = true;

    this.height = text_height;
    this.width = width;

    this.width = get_nearest_power_of_two_for_number(this.width);
    this.height = get_nearest_power_of_two_for_number(this.height);


    this.refresh = function() {
        if (this.background_is_transparent) {
            this.context.fillStyle = this.get_current_foreground_color();
            this.context.clearRect(0, 0, this.width, this.height);
            this.context.fillText(this.text, 0, this.height);
        } else {
            // TEMPORARY
            this.context.fillStyle = this.get_current_foreground_color();
            this.context.clearRect(0, 0, this.width, this.height);
            this.context.fillText(this.text, 0, this.height);
        }
        this.texture.needsUpdate = true;
        this.material.needsUpdate = true;

        /*
        var x_offset = 0;
        if (this.centered) {
            x_offset = this.texture_width / 2 - this._get_text_length() / 2;
        }
        this.dynamic_texture.clear('rgba(0, 0, 0, 0');
        this.dynamic_texture.clear(this.get_current_background_color()).drawText(this.text, x_offset, this.font_size * TEMP_SMUDGE_FACTOR, this.get_current_foreground_color());
        //this.dynamic_texture.clear(this.get_current_background_color()).drawText(this.text, x_offset, this.font_size * TEMP_SMUDGE_FACTOR, this.get_current_foreground_color());
        //this.dynamic_texture.clear(this.current_background_color).drawText(this.text, x_offset, this.font_size * TEMP_SMUDGE_FACTOR, this.current_color);
        this.dynamic_texture.needsUpdate = true;
        */
    };

    /*__   __   ___      ___    __
     /  ` |__) |__   /\   |  | /  \ |\ |
     \__, |  \ |___ /~~\  |  | \__/ | \| */
    this.initialize = function() {
        this._create_canvas();
        this.create_base_mesh();
    };

    this._create_canvas = function() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');
        this.texture = new THREE.Texture(this.canvas);

        this.font_size = this.height;
        if (this.bold) {
            this.context.font = 'Bold ' + str(this.font_size) + 'px Arial';
        } else {
            this.context.font = str(this.font_size) + 'px Arial';
        }
        this.texture.anisotropy = MANAGER_RENDERER.renderer.capabilities.getMaxAnisotropy();

        this.material = new THREE.MeshBasicMaterial({
            map : this.texture
        });

        this.material.transparent = true;
        this.material.side = THREE.FrontSide;
    };

    this.create_base_mesh = function() {
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.object3D.add(this.mesh);
    };

    /*
    this.create_base_dynamic_texture = function() {
        //this.texture_width = get_nearest_power_of_two_for_number(this.width * 2);
        //this.texture_height = get_nearest_power_of_two_for_number(this.height * 2);

        //this.font_size = this.texture_height;
        this.font_size = this.height;

        //this.dynamic_texture = new THREEx.DynamicTexture(this.texture_width, this.texture_height);

        /*
        if (this.bold) {
            this.context.font = 'Bold ' + str(this.font_size) + 'px Arial';
        } else {
            this.context.font = str(this.font_size) + 'px Arial';
        }
        */
    /*
        this.texture.anisotropy = MANAGER_RENDERER.renderer.capabilities.getMaxAnisotropy();

        this.material = new THREE.MeshBasicMaterial({
            map : this.dynamic_texture.texture
        });

        this.material.transparent = true;
        this.material.side = THREE.FrontSide;
    };
    */

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this._get_text_length = function() {
        return this.context.measureText(this.text).width;
    };
}