'use strict';

$_QE.prototype.WallAbstraction = function(is_base, width, height) {

    $_QE.prototype.FeatureSize.call(this, width, height);
    $_QE.prototype.FloatingElement.call(this, is_base);

    this._tab_target_first   = null;
    this._tab_target_current = null;

    this._wall_rows          = null;

    this.set_default_tab_target = function(target) {
        this._tab_target_first = target;
    };

    this.get_tab_target_first = function() {
        if (this._tab_target_first != null) {
            return this._tab_target_first;
        } else {
            // TODO:!
            return null;
        }
    };

    this.add_row = function(row) {
        if (this._wall_rows == null) {
            this._wall_rows = new $_QE.prototype.DoublyLinkedListBase($_QE.prototype.DoublyLinkedListNode);
        }
        this._wall_rows.set_tail(row);
    };
};
