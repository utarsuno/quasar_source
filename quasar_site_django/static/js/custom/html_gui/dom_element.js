'use strict';

function DomElement(id_name, element) {
    this.__init__(id_name, element);
}

DomElement.prototype = {

    __init__: function(id_name, element) {
        if (id_name === null) {
            this.element = element;
        } else {
            this.element = document.getElementById(id_name);
        }
        // Default.
        this.display_style = 'block';
    },

    prepend_child_element: function(element_id) {
        return this._add_child_element(true, element_id);
    },

    append_child_element: function(element_id) {
        return this._add_child_element(false, element_id);
    },

    add_class: function(class_name) {
        this.element.classList.add(class_name);
    },

    prepend_break: function() {
        let node = document.createElement('br');
        this.element.prepend(node);
    },

    add_break_element: function() {
        let node = document.createElement('br');
        this.element.appendChild(node);
    },

    _add_child_element: function(prepend, element_id) {
        let node = document.createElement('div');
        node.id = element_id;
        if (prepend) {
            this.element.prepend(node);
        } else {
            this.element.appendChild(node);
        }
        return new DomElement(element_id);
    },

    get_element: function() {
        return this.element;
    },

    get_text: function() {
        return this.element.innerHTML;
    },

    clear: function() {
        this.set_text('');
    },

    _get_offset: function(o) {
        if (o === 0) {
            return 0;
        }
        return o + 'px';
    },

    /*__   ___ ___ ___  ___  __   __  
     /__` |__   |   |  |__  |__) /__` 
     .__/ |___  |   |  |___ |  \ .__/ */
    set_id: function(_id) {
        this.element.id = _id;
    },

    set_text: function(text) {
        this.element.innerHTML = text;
    },

    set_position_to_absolute: function() {
        this.element.style.position = 'absolute';
    },

    set_left_offset: function(o) {
        this.element.style.left = this._get_offset(o);
    },

    set_top_offset: function(o) {
        this.element.style.top = this._get_offset(o);
    },

    set_color: function(color) {
        this.element.style.color = color;
    },

    set_display_style: function(style) {
        this.display_style = style;
    },

    /*__     __   __                    __  ___           ___ 
     |  \ | /__` |__) |     /\  \ /    /__`  |  \ / |    |__  
     |__/ | .__/ |    |___ /~~\  |     .__/  |   |  |___ |___ */
    hide: function() {
        this.element.style.display = 'none';
        this.hidden = true;
    },

    show: function() {
        this.element.style.display = this.display_style;
        this.hidden = false;
    },

    is_hidden: function() {
        return this.hidden;
    },

    /*       __     __           ___     
     \  / | /__` | |__) | |    |  |  \ / 
      \/  | .__/ | |__) | |___ |  |   |  */

    make_invisible: function() {
        this.element.style.visibility = 'hidden';
        this.visible = false;
    },

    make_visible: function() {
        this.element.style.visibility = 'visible';
        this.visible = true;
    },

    is_visible: function() {
        return this.visible;
    }
};