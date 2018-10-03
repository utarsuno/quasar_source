'use strict';

$_QE.prototype.FeatureRow = function(parent_wall, height, y_percentage_position_start) {

    this.parent_wall    = parent_wall;
    this.row_height     = height;
    this.row_y_start    = y_percentage_position_start;

    this.parent_wall.add_row(this);

    this.element_center = null;
    this.elements_left  = new $_QE.prototype.DoublyLinkedList(true);
    this.elements_right = new $_QE.prototype.DoublyLinkedList(true);

    //
    this.elements_tab_target = new $_QE.prototype.DoublyLinkedList(false);
    this._tab_target_current = null;
    //

    this._create_icon = function(icon_type, color, relative_index, left) {
        if (left) {
            return this.add_element_left(new $_QE.prototype.FloatingIcon(false, icon_type, this.row_height, color), true, relative_index);
        } else {
            return this.add_element_right(new $_QE.prototype.FloatingIcon(false, icon_type, this.row_height, color), true, relative_index);
        }
    };

    this.create_icon_left = function(icon_type, color, relative_index=0) {
        return this._create_icon(icon_type, color, relative_index, true);
    };

    this.create_icon_right = function(icon_type, color, relative_index=0) {
        return this._create_icon(icon_type, color, relative_index, false);
    };

    this.create_text3d_center = function(text, color, interactive) {
        return this.add_element_center(new $_QE.prototype.Text3D(false, this.row_height, text, interactive), true, true);
    };

    this.add_element_center = function(element, create, update_normal) {
        this.element_center = element;
        this._add_element(element, create, update_normal);
        element.set_flag(EFLAG_FORMAT_X_CENTER, true);
        // Set x position.
        element.set_offset_horizontal_percentage(0.5, -.5);
        return element;
    };

    this.add_element_left = function(element, create, position) {
        this._add_element(element, create);
        element.set_flag(EFLAG_FORMAT_X_START, true);
        this.elements_left.insert(element, position);
        return element;
    };

    this.add_element_right = function(element, create, position) {
        this._add_element(element, create);
        element.set_flag(EFLAG_FORMAT_X_END, true);
        this.elements_right.insert(element, position);
        return element;
    };

    this._add_element = function(element, create, update_normal=false) {
        this.parent_wall.add_attachment(element, create, update_normal);
        // Set y position.
        element.set_offset_vertical_percentage(this.row_y_start, 0.5);

        element.set_flag(EFLAG_IS_ROW_ELEMENT, true);
        element._parent_row = this;

        element.set_event(ELEMENT_EVENT_ON_NODE_UPDATE, function(node) {
            if (element.get_flag(EFLAG_FORMAT_X_END)) {
                if (node._node_prev != null) {
                    element.set_offset_horizontal_percentage(1, -0.5, node._node_prev._object.horizontal_offsets[2] - node._node_prev._object.width);
                } else {
                    element.set_offset_horizontal_percentage(1, -0.5);
                }
            } else if (element.get_flag(EFLAG_FORMAT_X_START)) {
                if (node._node_prev != null) {
                    element.set_offset_horizontal_percentage(0, 0.5, node._node_prev._object.horizontal_offsets[2] + node._node_prev._object.width);
                } else {
                    element.set_offset_horizontal_percentage(0, 0.5);
                }
            }
        });

        let self = this;
        element.set_event(ELEMENT_EVENT_ON_SET_TO_INTERACTIVE, function() {
            l('YOOO AN ROW ELEMENT WAS SET TO INTERACTIVE!');
            self._set_tab_target(element);
        });

    };

    this.get_next_tab_target_from_current = function(element) {
        let node = this.elements_tab_target.get_node(element);
        return node._node_next._object;
    };

    this._set_tab_target = function(element) {
        if (element.get_flag(EFLAG_FORMAT_X_END)) {
            l(this.elements_right.get_node(element));

            let n = this.elements_right.get_node(element);
            if (this.elements_right._length == 1) {
                this.elements_tab_target.set_tail(element);
            } else {


                //let nn = this.elements_tab_target.get_node(element);
                //l('@@@@');
                //l(n._node_prev._object);
                //l(this.elements_tab_target.get_node(n._node_prev._object));
                //l(this.elements_right.get_node(n._node_prev._object));
                //l(this.elements_tab_target.get_node(
                //    this.elements_right.get_node(n._node_prev._object)._object
                //));
                /*
                this.elements_tab_target.insert_before_node(
                    n,
                    this.elements_right.get_node(n._node_prev._object)._object
                    //this.elements_tab_target.get_node(n._node_prev._object),
                    //element
                );
                l('@@@@@@@@');
                */

                /*
                if (n._position == 0) {
                    this.elements_tab_target.set_tail(element);
                } else {
                    this.elements_tab_target.insert_before_node(
                        this.elements_tab_target.get_node(n._node_prev._object),
                        element
                    );
                }
                */
            }
        }


        //l(element.get_flag(EFLAG_FORMAT_X_END));
        //l(element.get_flag(EFLAG_FORMAT_X_START));
        //l(element.get_flag(EFLAG_FORMAT_X_CENTER));

        //if (this.parent_wall._tab_target_first == null) {
        //
        //}
    };

    this.add_tab_target = function() {

    };

    this.get_tab_target_first = function() {
        if (this.elements_tab_target._length > 0) {
            return this.elements_tab_target._node_head;
        }
        return null;
    };

    this.get_tab_target_last = function() {

    };

};
