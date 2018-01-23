'use strict';

function Saveable(save_type) {

    this.save_type = save_type;
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
                l('THE KEY {' + key + '} IS NOT DEFINED YET FOR SAVING!!!');
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
            case ENTITY_PROPERTY_2D_ROWS:
                //l('TODO!!! SAVE ALL THE 2D ROWS!!!');

                var row_data = '';

                // INDEX {ROW}              - 0
                // INDEX {FLOATING_2D_TEXT} - 1

                for (var r = 0; r < this._2D_rows.length; r++) {
                    row_data += this._2D_rows[r][0] + '+';
                    row_data += this._2D_rows[r][1].get_text() + '+';
                    row_data += this._2D_rows[r][1].type + '+';
                    row_data += this._2D_rows[r][1].default_background_color + '@';
                }

                this._entity.set_property(key, row_data);

                break;
            case ENTITY_PROPERTY_3D_ROWS:

                var row_data = '';

                // INDEX {ROW}              - 0
                // INDEX {FLOATING_3D_TEXT} - 1

                for (var r = 0; r < this._3D_rows.length; r++) {
                    row_data += this._3D_rows[r][0] + '+';
                    row_data += this._3D_rows[r][1].get_text() + '+';
                    row_data += this._3D_rows[r][1].type + '+';
                    row_data += this._3D_rows[r][1].default_background_color + '@';
                }

                this._entity.set_property(key, row_data);

                //l('TODO!!! SAVE ALL THE 3D ROWS!!!');
                break;
            }
        }
    };

    this.get_value = function(key) {
        switch (key) {
        case ENTITY_PROPERTY_NORMAL:
            var n = this._entity.get_value(key);
            n = n.split('+');
            return new THREE.Vector3(parseFloat(n[0]), parseFloat(n[1]), parseFloat(n[2]));
        case ENTITY_PROPERTY_POSITION:
            var p = this._entity.get_value(key);
            p = p.split('+');
            return new THREE.Vector3(parseFloat(p[0]), parseFloat(p[1]), parseFloat(p[2]));
        default:
            return this._entity.get_value(key);
        }
    };
}
