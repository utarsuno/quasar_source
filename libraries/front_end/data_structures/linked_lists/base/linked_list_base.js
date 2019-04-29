'use strict';

$_QE.prototype.LinkedListBase = function() {};

$_QE.prototype.LinkedListBase.prototype = {

    __init__ll: function() {
        this._node_head       = null;
        this._node_tail       = null;
        this._length          = 0;
        this._length_positive = 0;
        this._length_negative = 0;
        this._cache_node_head = null;
    },

    _on_node_added: function(node, position) {
        node._position = position;
        this._length += 1;
        if (position > 0) {
            this._length_positive += 1;
        } else {
            this._length_negative += 1;
        }
        this._update_node(node);
        if (position !== 0) {
            if (position > 0) {
                // TODO: Speed this up later.
                let n = this._node_head._node_next;
                while (n != null) {
                    if (n.is_positive()) {
                        if (!n.has_next()) {
                            return;
                        }
                        if (n.same_position_as_previous()) {
                            n.increment_and_update();
                        }
                    }
                    n = n._node_next;
                }
            } else {
                // TODO: Speed this up later.
                let n = this._node_tail._node_prev;
                while (n != null) {
                    if (n.is_negative()) {
                        if (!n.has_previous()) {
                            return;
                        }
                        if (n.same_position_as_previous()) {
                            n.decrement_and_update();
                        }
                    }
                    n = n._node_prev;
                }
            }
        }
    },

    _update_node: function(node) {
        if (node.update_node != null) {
            node.update_node();
        }
    },

    _set_only_node: function(node, position) {
        this._node_head = node;
        this._node_tail = node;
        this._on_node_added(node, position);
    },

    _add_tail_to_head: function(node, position) {
        this._node_tail = node;
        this._node_head.set_next(this._node_tail);
        this._on_node_added(node, position);
    },

    _add_head_to_tail: function(node, position) {
        this._node_head = node;
        this._node_head.set_next(this._node_tail);
        this._on_node_added(node, position);
    },

    _replace_current_tail: function(node, position) {
        this._node_tail.set_next(node);
        this._node_tail = node;
        this._on_node_added(node, position);
    },

    _replace_current_head: function(node, position) {
        this._node_head.set_previous(node);
        this._node_head = node;
        this._on_node_added(node, position);
    },

    _insert_node_between_nodes: function(node_left, node_center, node_right, position) {
        node_center.set_previous(node_left);
        node_center.set_next(node_right);
        this._on_node_added(node_center, position);
    },

    _are_nodes_both_positive: function(node0, node1) {
        return node0.is_positive() && node1.is_positive();
    },

    _are_nodes_both_negative: function(node0, node1) {
        return node0.is_negative() && node1.is_negative();
    },

    _cache_add: function(node) {
        if (this._cache_node_head == null) {
            this._cache_node_head = node;
            node.clear();
        } else {
            node.clear();
            node._node_next       = this._cache_node_head;
            this._cache_node_head = node;
        }
    },

    _cache_get: function(object) {
        if (this._cache_node_head == null) {
            return new this._node_class(object);
        } else {
            let old_cache_head     = this._cache_node_head;
            old_cache_head._object = object;
            if (this._cache_node_head._node_next != null) {
                this._cache_node_head = this._cache_node_head._node_next;
            } else {
                this._cache_node_head = null;
            }
            return old_cache_head;
        }
    },

    get_position_of_tail: function() {
        return this._node_tail._position;
    },

    get_position_of_head: function() {
        return this._node_head._position;
    },

    get_element_by_position: function(position) {
        let n = this._node_head;
        while (n != null) {
            if (n._position === position) {
                return n._object;
            }
            n = n._node_next;
        }
    },

    get_node_from_object: function(object) {
        let n;
        switch (this._length) {
        case 0:
            return null;
        case 1:
            if (this._node_head._object === object) {
                return this._node_head;
            }
            return null;
        case 2:
            if (this._node_head._object === object) {
                return this._node_head;
            } else if (this._node_tail._object === object) {
                return this._node_tail;
            }
            return null;
        default:
            n = this._node_head;
            while (n != null) {
                if (n._object === object) {
                    return n;
                }
                n = n._node_next;
            }
            return null;
        }
    },

    _insert_center: function(node) {
        if (this._are_nodes_both_negative(this._node_head, this._node_tail)) {
            this.set_tail(node, 0);
        } else if (this._are_nodes_both_positive(this._node_head, this._node_tail)) {
            this.set_head(node, 0);
        } else {
            let current  = this._node_head._node_next;
            while (current != null) {
                if (current._position > 0 && current._node_prev._position < 0) {
                    this._insert_node_between_nodes(current._node_prev, node, current, 0);
                    return;
                }
                current = current._node_next;
            }
        }
        l('TODO: if this is reached then need to add tail!! 2 2 2 2 2');
    },

    insert_element_at_position: function(element, position) {
        return this.insert_node_at_position(this._cache_get(element), position);
    },

    insert_node_at_position: function(node_insert, insert_position) {
        let node;
        switch (this._length) {
        case 0:
            this._set_only_node(node_insert, insert_position);
            return this._node_head;
        case 1:
            if (insert_position > this._node_head._position) {
                this._add_tail_to_head(node_insert, insert_position);
                return this._node_tail;
            } else {
                this._add_head_to_tail(node_insert, insert_position);
                return this._node_head;
            }
        default:
            if (insert_position === 0) {
                return this._insert_center(node_insert);
            } else if (insert_position < this.get_position_of_head()) {
                this._replace_current_head(node_insert, insert_position);
                return this._node_head;
            } else if (insert_position > this.get_position_of_tail()) {
                this._replace_current_tail(node_insert, insert_position);
                return this._node_tail;
            } else {
                node = this._node_head;
                while (node != null) {
                    if (node._position > insert_position) {
                        this._insert_node_between_nodes(node._node_prev, node_insert, node, insert_position);
                        return node_insert;
                    }
                    node = node._node_next;
                }
                l('TODO: if this is reached then need to add tail!!');
            }
            break;
        }
    },

    set_head: function(node, position) {
        switch (this._length) {
        case 0:
            this._set_only_node(node, position);
            break;
        case 1:
            this._add_head_to_tail(node, position);
            break;
        default:
            this._replace_current_head(node, position);
            break;
        }
    },

    set_tail: function(node, position) {
        switch (this._length) {
        case 0:
            this._set_only_node(node, position);
            break;
        case 1:
            this._add_tail_to_head(node, position);
            break;
        default:
            this._replace_current_tail(node, position);
            break;
        }
    },

};


