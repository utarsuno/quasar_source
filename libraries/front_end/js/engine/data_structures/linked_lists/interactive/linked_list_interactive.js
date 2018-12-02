'use strict';

$_QE.prototype.LinkedListInteractive = function() {
};

Object.assign(
    $_QE.prototype.LinkedListInteractive.prototype,
    $_QE.prototype.LinkedListBase.prototype,
    {
        __init__ll_interactive: function(node_class) {
            this._node_class         = node_class;
            this._interactive_head   = null;
            this._interactive_tail   = null;
            this._length_interactive = 0;
            this.__init__ll();
        },

        on_element_set_to_interactive: function(element) {
            this.on_node_set_to_interactive(this.get_node_from_object(element));
        },

        on_node_set_to_interactive: function(node) {
            this._insert_interactive_node(node);
        },

        _set_only_interactive: function(node) {
            this._interactive_head = node;
            this._interactive_tail = node;
        },

        _insert_interactive_node: function(node) {
            switch (this._length_interactive) {
            case 0:
                this._set_only_interactive(node);
                break;
            case 1:
                if (node._position < this._interactive_head._position) {
                    this._interactive_head = node;
                } else {
                    this._interactive_tail = node;
                }
                this._interactive_head.set_interactive_next(this._interactive_tail);
                break;
            case 2:
                if (node._position < this._interactive_head._position) {
                    node.set_interactive_next(this._interactive_head);
                    this._interactive_head = node;
                } else if (node._position > this._interactive_tail._position) {
                    this._interactive_tail.set_interactive_next(node);
                    this._interactive_tail = node;
                } else {
                    this._interactive_head.set_interactive_next(node);
                    this._interactive_tail.set_interactive_previous(node);
                }
                break;
            default:
                this._insert_interactive_node_util(node);
                break;
            }
            this._length_interactive += 1;
        },

        _insert_interactive_node_util: function(node) {
            // It can be assumed that length is minimum of 3.

            // 0x0: First check if the head is being replaced.
            if (node._position < this._interactive_head._position) {
                node.set_interactive_next(this._interactive_head);
                this._interactive_head = node;
            } else {
                // 0x1: Otherwise insert in-between two interactive nodes.
                let n = this._interactive_head._interactive_next;
                let p;
                while (n != null) {
                    if (n._position > node._position && node.is_interactive()) {
                        node.set_interactive_prev_and_next(n._interactive_prev, n);
                        return;
                    }
                    p = n;
                    n = n._interactive_next;
                }
                p.set_interactive_next(node);
            }
        },
    }
);

