'use strict';

function FloatingWallAbstract(width, height, position, normal, world) {


    this.add_row = function(row_index, row_name) {
        if (!(row_index != null)) {
            row_index = this._get_max_row_number() + 1;
        } else {
            // Check if any existing rows need to be shifted down.
            let all_rows_to_shift = this._get_all_rows_with_index_equal_to_or_greater(row_index);
            let r;
            for (r = 0; r < all_rows_to_shift.length; r++) {
                all_rows_to_shift[r].shift_down();
            }
        }

        // Now create the new row.
        let floating_row = new FloatingRow(this, row_index, row_name);
        this.rows.push(floating_row);
        if (this.auto_adjust_height_if_needed != null) {
            this.auto_adjust_height_if_needed();
        }
        return floating_row;
    };

    this.delete_row_by_index = function(row_index) {
        let row_to_delete = -1;
        let deleted_rows_index = null;
        let r;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_number === row_index) {
                row_to_delete = r;
                deleted_rows_index = this.rows[r].row_number;
                break;
            }
        }
        if (row_to_delete !== NOT_FOUND) {
            this.rows[r].delete_all_elements();
            this.rows.splice(row_to_delete, 1);
            // Check if any existing rows need to be shifted up.
            let all_rows_to_shift = this._get_all_rows_with_index_equal_to_or_greater(deleted_rows_index);
            for (r = 0; r < all_rows_to_shift.length; r++) {
                all_rows_to_shift[r].shift_up();
            }
        }

        if (this.auto_adjust_height_if_needed != null) {
            this.auto_adjust_height_if_needed();
        }
    };

    this.delete_row_by_name = function(row_name) {
        let row_to_delete = -1;
        let deleted_rows_index = null;
        let r;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].row_name === row_name) {
                row_to_delete = r;
                deleted_rows_index = this.rows[r].row_number;
                break;
            }
        }
        if (row_to_delete !== NOT_FOUND) {
            this.rows[r].delete_all_elements();
            this.rows.splice(row_to_delete, 1);
            // Check if any existing rows need to be shifted up.
            let all_rows_to_shift = this._get_all_rows_with_index_equal_to_or_greater(deleted_rows_index);
            for (r = 0; r < all_rows_to_shift.length; r++) {
                all_rows_to_shift[r].shift_up();
            }
        }

        if (this.auto_adjust_height_if_needed != null) {
            this.auto_adjust_height_if_needed();
        }
    };

    /*__   ___ ___ ___  ___  __   __
     / _` |__   |   |  |__  |__) /__`
     \__> |___  |   |  |___ |  \ .__/ */
    this.get_3D_rows_save_data = function() {
        let save_data = '';
        let add_seperator = false;
        let r;
        for (r = 0; r < this.rows.length; r++) {
            let data = this.rows[r].get_3D_rows_save_data();
            if (data !== NO_SAVE_DATA) {
                if (add_seperator) {
                    save_data += '@';
                }
                save_data += data;
                if (!add_seperator) {
                    add_seperator = true;
                }
            }
        }
        if (save_data === '') {
            return NO_SAVE_DATA;
        }
        return save_data;
    };

    this.has_3D_rows = function() {
        let r;
        for (r = 0; r < this.rows.length; r++) {
            if (this.rows[r].get_all_elements_with_tag(SAVE_TAG_3D_ROW).length > 0) {
                return true;
            }
        }
        return false;
    };
}