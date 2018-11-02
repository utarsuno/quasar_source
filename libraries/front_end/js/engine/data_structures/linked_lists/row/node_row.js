'use strict';

$_QE.prototype.DoublyLinkedListNodeRow = function(object) {
    this._object                     = object;
    this.already_in_interactive_list = false;
};

Object.assign($_QE.prototype.DoublyLinkedListNodeRow.prototype, $_QE.prototype.DoublyLinkedListNodeInteractive.prototype, {

    has_interactive: function() {
        return this._object.elements._interactive_head != null;
    },

    get_first_interactive_element: function() {
        return this._object._interactive_head._object;
    },

    get_row_height: function() {
        return this._object.row_height;
    },

    get_row_y: function() {
        return this._object.row_y_start;
    },

});
