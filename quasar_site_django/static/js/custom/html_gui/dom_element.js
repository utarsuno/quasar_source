'use strict';

function DomElement(id_name) {
    this.__init__(id_name);
}

DomElement.prototype = {

    __init__: function(id_name) {
        this.element = document.getElementById(id_name);
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

    set_color: function(color) {
        this.element.style.color = color;
    },

    get_element: function() {
        return this.element;
    },

    set_top_height: function(h) {
        this.element.style.top = h + 'px';
    },

    hide: function() {
        this.element.style.display = DISPLAY_NONE;
        this.hidden = true;
    },

    show: function() {
        this.element.style.display = DISPLAY_SHOW;
        this.hidden = false;
    },

    is_hidden: function() {
        return this.hidden;
    },

    set_text: function(text) {
        this.element.innerHTML = text;
    },

    get_text: function() {
        return this.element.innerHTML;
    },

    clear: function() {
        this.set_text('');
    },

    make_invisible: function() {
        this.element.style.visibility = NOT_VISIBLE;
        this.visible = false;
    },

    make_visible: function() {
        this.element.style.visibility = VISIBLE;
        this.visible = true;
    },

    is_visible: function() {
        return this.visible;
    }
};