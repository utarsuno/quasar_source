'use strict';

$_CQE.prototype.ClientDataDisplay = function() {
    this.enabled = true;

    // DOM elements.
    this.element_container = new $_CQE.prototype.DomElement('data_display');
    this.element_x_coordinate = new $_CQE.prototype.DomElement('x_coordinate');
    this.element_y_coordinate = new $_CQE.prototype.DomElement('y_coordinate');
    this.element_z_coordinate = new $_CQE.prototype.DomElement('z_coordinate');
    this.element_x_direction = new $_CQE.prototype.DomElement('x_direction');
    this.element_y_direction = new $_CQE.prototype.DomElement('y_direction');
    this.element_z_direction = new $_CQE.prototype.DomElement('z_direction');

    this.has_memory_information = performance.memory;
    if (this.has_memory_information) {
        this.element_heap_size = new $_CQE.prototype.DomElement('heap_size');
        this.element_heap_max_size = new $_CQE.prototype.DomElement('max_heap_size');
    }

    this.element_geometreis = new $_CQE.prototype.DomElement('geometries');
    this.element_textures   = new $_CQE.prototype.DomElement('textures');
    this.element_shaders    = new $_CQE.prototype.DomElement('shader_programs');

    this.update = function() {
        let position = CURRENT_PLAYER.fps_controls.get_position();
        let direction = CURRENT_PLAYER.fps_controls.get_direction();
        let velocity  = CURRENT_PLAYER.fps_controls.get_velocity();

        // Perform text operations first so that any DOM changes happen as close to each other as possible in order
        // to let the browser optimize visual updates better.
        let x  = 'x : ' + int(position.x) + ' | ' + int(velocity.x);
        let y  = 'y : ' + int(position.y) + ' | ' + int(velocity.y);
        let z  = 'z : ' + int(position.z) + ' | ' + int(velocity.z);
        let dx = 'xd : ' + direction.x;
        let dy = 'yd : ' + direction.y;
        let dz = 'zd : ' + direction.z;
        let js_heap_size;
        let js_heap_max_size;
        if (this.has_memory_information) {
            let memory = performance.memory;
            js_heap_size = memory.usedJSHeapSize;
            js_heap_max_size = memory.jsHeapSizeLimit;
        }

        this.element_x_coordinate.set_text(x);
        this.element_y_coordinate.set_text(y);
        this.element_z_coordinate.set_text(z);

        this.element_x_direction.set_text(dx);
        this.element_y_direction.set_text(dy);
        this.element_z_direction.set_text(dz);

        if (this.has_memory_information) {
            this.element_heap_size.set_text(js_heap_size);
            this.element_heap_max_size.set_text(js_heap_max_size);
        }

        let geometries = 'g: ' + MANAGER_RENDERER.renderer.info.memory.geometries;
        let textures   = 't: ' + MANAGER_RENDERER.renderer.info.memory.textures;
        let shaders    = 's: ' + MANAGER_RENDERER.renderer.info.programs.length;

        this.element_geometreis.set_text(geometries);
        this.element_textures.set_text(textures);
        this.element_shaders.set_text(shaders);
    };

    this.hide = function() {
        this.element_container.hide();
    };

    this.show = function() {
        this.element_container.show();
    };
};

/*
function DataDisplay() {
    this.__init__();
}

DataDisplay.prototype = {

    __init__: function() {
        this.enabled = true;

        // DOM elements.
        this.element_container = new DomElement('data_display');
        this.element_x_coordinate = new DomElement('x_coordinate');
        this.element_y_coordinate = new DomElement('y_coordinate');
        this.element_z_coordinate = new DomElement('z_coordinate');
        this.element_x_direction = new DomElement('x_direction');
        this.element_y_direction = new DomElement('y_direction');
        this.element_z_direction = new DomElement('z_direction');

        this.has_memory_information = performance.memory;
        if (this.has_memory_information) {
            this.element_heap_size = new DomElement('heap_size');
            this.element_heap_max_size = new DomElement('max_heap_size');
        }

        this.element_geometreis = new DomElement('geometries');
        this.element_textures   = new DomElement('textures');
        this.element_shaders    = new DomElement('shader_programs');
    },

    update: function() {
        let position = CURRENT_PLAYER.fps_controls.get_position();
        let direction = CURRENT_PLAYER.fps_controls.get_direction();
        let velocity  = CURRENT_PLAYER.fps_controls.get_velocity();

        // Perform text operations first so that any DOM changes happen as close to each other as possible in order
        // to let the browser optimize visual updates better.
        let x  = 'x : ' + int(position.x) + ' | ' + int(velocity.x);
        let y  = 'y : ' + int(position.y) + ' | ' + int(velocity.y);
        let z  = 'z : ' + int(position.z) + ' | ' + int(velocity.z);
        let dx = 'xd : ' + direction.x;
        let dy = 'yd : ' + direction.y;
        let dz = 'zd : ' + direction.z;
        let js_heap_size;
        let js_heap_max_size;
        if (this.has_memory_information) {
            let memory = performance.memory;
            js_heap_size = memory.usedJSHeapSize;
            js_heap_max_size = memory.jsHeapSizeLimit;
        }

        this.element_x_coordinate.set_text(x);
        this.element_y_coordinate.set_text(y);
        this.element_z_coordinate.set_text(z);

        this.element_x_direction.set_text(dx);
        this.element_y_direction.set_text(dy);
        this.element_z_direction.set_text(dz);

        if (this.has_memory_information) {
            this.element_heap_size.set_text(js_heap_size);
            this.element_heap_max_size.set_text(js_heap_max_size);
        }

        let geometries = 'g: ' + MANAGER_RENDERER.renderer.info.memory.geometries;
        let textures   = 't: ' + MANAGER_RENDERER.renderer.info.memory.textures;
        let shaders    = 's: ' + MANAGER_RENDERER.renderer.info.programs.length;

        this.element_geometreis.set_text(geometries);
        this.element_textures.set_text(textures);
        this.element_shaders.set_text(shaders);
    },

    hide: function() {
        this.element_container.hide();
    },

    show: function() {
        this.element_container.show();
    }
};
*/