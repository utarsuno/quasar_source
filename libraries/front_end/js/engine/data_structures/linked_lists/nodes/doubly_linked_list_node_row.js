'use strict';

$_QE.prototype.DoublyLinkedListNodeRow = function(object) {
    this._object = object;
};

Object.assign($_QE.prototype.DoublyLinkedListNodeRow.prototype, $_QE.prototype.DoublyLinkedListNodeInteractive.prototype, {

    already_in_interactive_list: false,

    has_interactive: function() {
        return this._object.elements._interactive_head != null;
    },

    get_first_interactive_element: function() {
        return this._object.elements._interactive_head._object;
    },

});
