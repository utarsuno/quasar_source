'use strict';

$_QE.prototype.DoublyLinkedList = function(call_update_on_nodes) {

    this.call_update_on_nodes = call_update_on_nodes;

    this._node_head = null;
    this._node_tail = null;
    this._length    = 0;

    this._cache_node_head = null;
    this._cache_node_tail = null;
    this._cache_length    = 0;

    this._get_node = function(object) {
        if (this._cache_node_head == null) {
            return new $_QE.prototype.DoublyLinkedListNode(object);
        } else {
            l('TODO: RE-USE A CACHED NODE!!');
        }
    };

    this.get_node = function(object) {
        if (this._length == 1) {
            if (this._node_head._object == object) {
                return this._node_head;
            }
        } else if (this._length != 0) {
            let n = this._node_head._node_next;
            while (n != null) {
                if (n._object == object) {
                    return n;
                }
                n = n._node_next;
            }
        }
        return null;
    };

    this.set_head = function(node) {
        node = this._get_node(node);
        if (this._length == 0) {
            this._node_head = node;
            this._node_tail = node;
        } else if (this._length == 1) {
            node._node_next            = this._node_tail;
            this._node_tail._node_prev = node;
            this._node_head            = node;
        } else {
            this._node_head._node_prev = node;
            node._node_next            = this._node_head;
            this._node_head            = node;
        }
        node._position = 0;
        this._length += 1;
        this._update_nodes(node);
    };

    this.set_tail = function(node) {
        node = this._get_node(node);
        if (this._length == 0) {
            this._node_head = node;
            this._node_tail = node;
        } else if (this._length == 1) {
            node._node_prev            = this._node_head;
            this._node_head._node_next = node;
            this._node_tail            = node;
        } else {
            this._node_tail._node_next = node;
            node._node_prev            = this._node_tail;
            this._node_tail            = node;
        }
        node._position = this._length;
        this._length += 1;
        this._update_nodes(node);
    };

    this.insert = function(node, position=0) {
        if (position == 0) {
            this.set_head(node);
        } else if (position >= this._length - 1) {
            this.set_tail(node);
        } else {
            l('TODO: insert node! {' + position + '} - {' + this._length + '}');
            node = this._get_node(node);
            let current_node = this._node_head;
            let index = 0;
            while (current_node != null) {
                if (position == index) {
                    current_node._node_prev._node_next = node;
                    node._node_prev                    = current_node._node_prev;
                    current_node._node_prev            = node;
                    node._node_next                    = current_node;
                    node._position                     = position;
                    break;
                }
                index += 1;
                current_node = current_node._node_next;
            }
            this._update_nodes(node);
            this._length += 1;
        }
    };

    this._update_nodes = function(node) {
        let n = node;
        while (n != null) {
            if (n._node_prev != null) {
                if (n._node_prev._position == n._position) {
                    n._position += 1;
                }
            }
            if (this.call_update_on_nodes) {
                n._object.trigger_event(ELEMENT_EVENT_ON_NODE_UPDATE, n);
            }
            n = n._node_next;
        }
    };


    // TODO: delete
    // TODO: insert before

    /*
        this.set_tail = function(node) {
        node = this._get_node(node);
        if (this._length == 0) {
            this._node_head = node;
            this._node_tail = node;
        } else if (this._length == 1) {
            node._node_prev            = this._node_head;
            this._node_head._node_next = node;
            this._node_tail            = node;
        } else {
            this._node_tail._node_next = node;
            node._node_prev            = this._node_tail;
            this._node_tail            = node;
        }
        node._position = this._length;
        this._length += 1;
        this._update_nodes(node);
    };
     */

    this.insert_before_node = function(node_base, node_insert) {
        node_insert = this._get_node(node_insert);
        if (this._node_head == node_base) {
            node_insert._node_next = node_base;
            node_base._node_prev   = node_insert;
            this._node_head        = node_insert;
        } else {
            node_insert._node_prev          = node_base._node_prev;
            node_base._node_prev._node_next = node_insert;
            node_base._node_prev            = node_insert;
            node_insert._node_next          = node_base;
        }
        node_insert._position = node_base._position;
        this._length += 1;
        this._update_nodes(node_insert);
    };

    this.insert_after_node = function(node_base, node_insert) {
        node_insert = this._get_node(node_insert);
        if (this._length == 1) {
            node_base._node_next   = node_insert;
            node_insert._node_prev = node_base;
            this._node_tail        = node_insert;
        } else if (this._node_tail == node_base) {
            node_base._node_next   = node_insert;
            node_insert._node_prev = node_base;
            this._node_tail        = node_insert;
        } else {
            node_base._node_next._node_prev = node_insert;
            node_insert._node_next          = node_base._node_next;
            node_base._node_next            = node_insert;
            node_insert._node_prev          = node_base;
        }
    };

};
