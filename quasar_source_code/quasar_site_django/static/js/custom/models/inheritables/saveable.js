'use strict';

function Saveable(entity_type, load_completed_callback) {

    this.load_completed_callback = load_completed_callback;

    this.save_type = entity_type;
    // TODO : Change design so that this is false and saving must be explicitly enabled.
    this.saveable  = true;
    this._save_field_keys = [];

    this._entity = null;

    this.set_to_saveable = function() {
        if (!is_defined(this._entity)) {
            this.create_new_entity();
        }
    };

    this.set_entity = function(e) {
        this._entity = e;
    };

    this.add_save_field = function(field_key) {
        this._save_field_keys.push(field_key);
    };

    this.create_new_entity = function() {
        var entity_data = {};

        for (var k = 0; k < this._save_field_keys.length; k++) {
            var key = this._save_field_keys[k];
            switch(key) {
            case ENTITY_PROPERTY_IS_ROOT_ATTACHABLE:
                entity_data[key] = this.is_root().toString();
                break;
            case ENTITY_PROPERTY_IMAGE_DATA:
                entity_data[key] = this._image_data;
                break;
            default:
                //l('THE KEY {' + key + '} IS NOT DEFINED YET FOR SAVING!!!');
                break;
            }
        }

        entity_data[ENTITY_DEFAULT_PROPERTY_TYPE] = this.save_type;

        // Creating a new entity will automatically add it to the EntityManager.
        this._entity = new Entity(entity_data);
    };

    this.update_values_for_entity = function() {
        for (var k = 0; k < this._save_field_keys.length; k++) {
            var key = this._save_field_keys[k];
            switch(key) {
            case ENTITY_PROPERTY_WIDTH:
                this._entity.set_property(key, this.width);
                break;
            case ENTITY_PROPERTY_HEIGHT:
                this._entity.set_property(key, this.height);
                break;
            case ENTITY_PROPERTY_NORMAL:
                var n = this.get_normal();
                this._entity.set_property(key, n.x + '+' + n.y + '+' + n.z);
                break;
            case ENTITY_PROPERTY_POSITION:
                var p = this.get_position();
                this._entity.set_property(key, p.x + '+' + p.y + '+' + p.z);
                break;
            case ENTITY_PROPERTY_3D_ROWS:
                if (this.has_3D_rows()) {
                    this._entity.set_property(ENTITY_PROPERTY_3D_ROWS, this.get_3D_rows_save_data());
                } else {
                    this._entity.set_property(ENTITY_PROPERTY_3D_ROWS, NO_SAVE_DATA);
                }
                break;
            }
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_self_entity = function() {
        return this._entity;
    };

    this.get_value = function(key) {
        switch (key) {
        case ENTITY_PROPERTY_NORMAL:
            var n = this._entity.get_value(key);
            n = n.split('+');
            // TODO : Actually just send a list of 3 values.
            return new THREE.Vector3(parseFloat(n[0]), parseFloat(n[1]), parseFloat(n[2]));
        case ENTITY_PROPERTY_POSITION:
            var p = this._entity.get_value(key);
            p = p.split('+');
            // TODO : Actually just send a list of 3 values.
            return new THREE.Vector3(parseFloat(p[0]), parseFloat(p[1]), parseFloat(p[2]));
        default:
            return this._entity.get_value(key);
        }
    };

    /*     __        __          __
     |    /  \  /\  |  \ | |\ | / _`
     |___ \__/ /~~\ |__/ | | \| \__> */
    this.load_from_entity_data = function(entity) {
        this.set_entity(entity);

        for (var k = 0; k < this._save_field_keys.length; k++) {
            var key = this._save_field_keys[k];
            var value = this.get_value(key);

            switch (key) {
            case ENTITY_PROPERTY_WIDTH:
                this.width = value;
                break;
            case ENTITY_PROPERTY_HEIGHT:
                this.height = value;
                break;
            case ENTITY_PROPERTY_POSITION:
                this.set_position(value.x, value.y, value.z);
                break;
            case ENTITY_PROPERTY_NORMAL:
                this.set_normal(value.x, value.y, value.z);
                break;
            case ENTITY_PROPERTY_3D_ROWS:
                var rows_3D = this.get_value(ENTITY_PROPERTY_3D_ROWS);
                    // INDEX --> 0 - row_number, 1 - text, 2 - type
                if (rows_3D !== NO_SAVE_DATA) {
                    var rows_3D_to_load = [];
                        // Check if there is only a single row or multiple.
                    if (rows_3D.indexOf('@') === NOT_FOUND) {
                            // Single row.
                        rows_3D_to_load.push(rows_3D);
                    } else {
                            // Multiple.
                        rows_3D_to_load = rows_3D.split('@');
                    }
                    for (var r = 0; r < rows_3D_to_load.length; r++) {
                        var data = rows_3D_to_load[r].split('+');
                        if (is_string(data[0])) {
                            this.add_full_row_3D(parseInt(data[0]), data[1], data[2]);
                        } else {
                            this.add_full_row_3D(data[0], data[1], data[2]);
                        }
                    }
                }
                break;
            }
        }

        if (is_defined(this.load_completed_callback)) {
            this.load_completed_callback();
        }
    };

}
