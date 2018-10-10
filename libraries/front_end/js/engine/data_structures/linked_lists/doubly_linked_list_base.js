'use strict';

$_QE.prototype.DoublyLinkedListBase = function(node_class) {
    this._node_class      = node_class;
    this._node_head       = null;
    this._node_tail       = null;
    this._length          = 0;
    this._length_positive = 0;
    this._length_negative = 0;
    this._cache_node_head = null;

    this.get_position_of_tail = function() {
        return this._node_tail._position;
    };

    this.get_number_of_positive_elements = function() {
        return this._length_positive;
    };

    this.get_number_of_negative_elements = function() {
        return this._length_negative;
    };

    this._on_node_added = function(node, position) {
        this._length += 1;
        if (position > 0) {
            this._length_positive += 1;
        } else {
            this._length_negative += 1;
        }
        this._update_node(node);
    };

    this._update_node = function(node) {
        if (node.update_node != null) {
            node.update_node();
        }
    };

    this._set_only_node = function(node, position) {
        this._node_head = node;
        this._node_tail = node;
        node._position  = position;
        this._on_node_added(node, position);
    };

    this._add_tail_to_head = function(node, position) {
        this._node_tail            = node;
        this._node_head._node_next = this._node_tail;
        this._node_tail._node_prev = this._node_head;
        this._set_node_position_based_off_previous(node, position);
        this._on_node_added(node, position);
        this._update_node(this._node_head);
    };

    this._add_head_to_tail = function(node, position) {
        this._node_head            = node;
        this._node_head._node_next = this._node_tail;
        this._node_tail._node_prev = this._node_head;
        this._set_node_position_based_off_next(node, position);
        this._on_node_added(node, position);
        this._update_node(this._node_tail);
    };

    this._replace_current_tail = function(node, position) {
        this._node_tail._node_next = node;
        node._node_prev            = this._node_tail;
        this._node_tail            = node;
        this._set_node_position_based_off_previous(node, position);
        this._on_node_added(node, position);
        //this._slow_position_update(node);
    };

    this._replace_current_head = function(node, position) {
        this._node_head._node_prev = node;
        node._node_next            = this._node_head;
        this._node_head            = node;
        this._node_head._position  = position;
        this._set_node_position_based_off_next(node, position);
        this._on_node_added(node, position);
        //this._slow_position_update(node);
    };

    this._insert_node_between_nodes = function(node_left, node_center, node_right, position) {
        node_left._node_next   = node_center;
        node_center._node_prev = node_left;
        node_center._node_next = node_right;
        node_right._node_prev  = node_center;
        this._set_node_position_based_off_next(node_center, position);
        this._on_node_added(node_center, position);
        //this._slow_position_update(node_insert);
    };

    this._are_nodes_both_positive = function(node0, node1) {
        return node0.is_positive() && node1.is_positive();
    };

    this._are_nodes_both_negative = function(node0, node1) {
        return node0.is_negative() && node1.is_negative();
    };

    this._set_node_position_based_off_previous = function(node, position) {
        if (position != node._node_prev._position) {
            node._position = position;
        } else {
            if (this._are_nodes_both_negative(node, node._node_prev)) {
                node._position            = position;
                node._node_prev._position -= 1;
            } else {
                node._position = position + 1;
            }
        }
    };

    this._set_node_position_based_off_next = function(node, position) {
        if (position != node._node_next._position) {
            node._position = position;
        } else {
            if (this._are_nodes_both_negative(node, node._node_next)) {
                node._position = position - 1;
            } else {
                node._position            = position;
                node._node_next._position += 1;
            }
        }
    };

    this._cache_add = function(node) {
        if (this._cache_node_head == null) {
            this._cache_node_head = node;
            node.clear();
        } else {
            node.clear();
            node._node_next       = this._cache_node_head;
            this._cache_node_head = node;
        }
    };

    this._cache_get = function(object) {
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
    };

    this.get_node_from_object = function(object) {
        let n;
        switch (this._length) {
        case 0:
            return null;
        case 1:
            if (this._node_head._object == object) {
                return this._node_head;
            }
            return null;
        case 2:
            if (this._node_head._object == object) {
                return this._node_head;
            } else if (this._node_tail._object == object) {
                return this._node_tail;
            }
            return null;
        default:
            n = this._node_head._node_next;
            while (n != null) {
                if (n._object == object) {
                    return n;
                }
                n = n._node_next;
            }
            return null;
        }
    };

    this._slow_position_update = function(node_base) {
        // Slow operation for now but convenient.
        let n = node_base;

        if (n._position < 0) {
            let previous = node_base;
            let current  = node_base._node_prev;
            while (current != null) {
                if (current._position == previous._position) {
                    current._position -= 1;
                }
                previous = current;
                current  = current._node_prev;
            }
            while (n != null) {
                n.update_node();
                n = n._node_next;
                // TODO: stop before position 0.
            }
        } else {
            let previous = node_base;
            let current  = node_base._node_next;
            node_base.update_node();
            while (current != null) {
                if (current._position == previous._position) {
                    current._position += 1;
                }
                n.update_node();
                previous = current;
                current  = current._node_next;
            }
        }
        // } else if (node_base._position < 0) {
    };

    this.insert_center = function(node) {
        switch (this._length) {
        case 0:
            this._set_only_node(node, 0);
            break;
        case 1:
            if (this._node_head._position < 0) {
                this._add_tail_to_head(node, 0);
            } else {
                this._add_head_to_tail(node, 0);
            }
            break;
        default:
            if (this._are_nodes_both_negative(this._node_head, this._node_tail)) {
                this.set_tail(node, 0);
            } else if (this._are_nodes_both_positive(this._node_head, this._node_tail)) {
                this.set_head(node, 0);
            } else {
                let current  = this._node_head._node_next;
                while (current != null) {
                    if (current._position > 0 && current._node_prev._position < 0) {
                        this._insert_node_between_nodes(current._node_prev, node, current, 0);
                        break;
                    }
                    current = current._node_next;
                }
            }
            break;
        }
    };

    this.insert_node_at_position = function(node_insert, insert_position) {
        if (insert_position == 0) {
            this.insert_center(node_insert);
            return;
        }
        let node;
        switch (this._length) {
        case 0:
            this._set_only_node(node_insert, insert_position);
            break;
        case 1:
            if (insert_position > this._node_head._position) {
                this._add_tail_to_head(node_insert, insert_position);
            } else if (insert_position <= this._node_head._position) {
                this._add_head_to_tail(node_insert, insert_position);
            }
            break;
        default:
            if (insert_position < this._node_head._position) {
                this._replace_current_head(node_insert, insert_position);
            } else if (insert_position > this._node_tail._position) {
                this._replace_current_tail(node_insert, insert_position);
            } else {
                node = this._node_head;
                while (node != null) {
                    if (node._position > insert_position) {
                        this._insert_node_between_nodes(node._node_prev, node_insert, node, insert_position);
                        break;
                    }
                    node = node._node_next;
                }
            }
            break;
        }
    };

    this.set_head = function(node, position) {
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
    };

    this.set_tail = function(node, position) {
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
    };

};
