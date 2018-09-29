'use strict';

$_QE.prototype.RelativeLinkedList = function() {

    this.head = null;
    this.tail = null;

    this.insert = function(element) {
        if (this.head == null) {
            this.head = element;
        } else if (element.relative_index <= this.head.relative_index) {
            element.next       = this.head;
            this.head.previous = element;
            this.head          = element;
            if (this.tail == null) {
                this.tail = element.next;
            }
        } else if (this.tail == null) {
            this.head.next   = element;
            element.previous = this.head;
            this.tail        = element;
        } else if (element.relative_index > this.tail.relative_index) {
            this.tail.next   = element;
            element.previous = this.tail;
            this.tail        = element;
        } else {
            let current_element = this.head.next;
            let TEMP_DEBUGGING  = false;
            while (current_element != null) {
                if (element.relative_index <= current_element.relative_index) {
                    current_element.previous.next = element;
                    element.previous              = current_element.previous;
                    element.next                  = current_element;
                    current_element.previous      = element;
                    TEMP_DEBUGGING = true;
                    break;
                }
                current_element = current_element.next;
            }
            if (!TEMP_DEBUGGING) {
                l('ERROR. ELEMENT NOT INSERTED!');
            }
        }
        this.update_positions_starting_at(element);
    };

    this._update_position_head = function() {
        if (this.head.horizontal_go_right) {
            this.head.set_offset_horizontal_percentage(0, 0.5);
        } else {
            this.head.set_offset_horizontal_percentage(1, -0.5);
        }
    };

    this.update_positions_starting_at = function(element) {
        let current_element = element;
        while (current_element != null) {
            if (current_element == this.head) {
                this._update_position_head();
            } else {
                current_element.update_horizontal_position();
            }
            current_element = current_element.next;
        }
    };
};
