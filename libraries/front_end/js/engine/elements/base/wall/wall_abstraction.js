'use strict';

$_QE.prototype.WallAbstraction = function(is_base, width, height) {

    $_QE.prototype.FeatureSize.call(this, width, height);
    $_QE.prototype.FloatingElement.call(this, is_base);

    this._wall_rows = new $_QE.prototype.DoublyLinkedListRows();

    this.add_row = function(row, interactive=false) {
        this._wall_rows.insert_element_at_position(row, this._wall_rows._length + 1);
        if (interactive) {
            this._wall_rows.on_element_set_to_interactive(row);
        }
    };

    this.ensure_row_is_interactive = function(row_node) {
        this._wall_rows.ensure_row_is_interactive(row_node);
    };

    this.get_next_tab_target_from_row_after = function(row) {
        return this._wall_rows.get_next_tab_target_past_row(row);
    };
};
