'use strict';

function DomElement(id_name, use_inner_html) {
    this.__init__(id_name, use_inner_html);
}

DomElement.prototype = {

    __init__: function(id_name, use_inner_html) {
        this.element = document.getElementById(id_name);
        this.use_inner_html = true;
    },

    set_color: function(color) {
        this.element.style.color = color;
    },

    get_element: function() {
        return this.element;
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
        //this.element.innerHTML = text;
        if (this.use_inner_html) {
            this.element.innerHTML = text;
        } else {
            this.element.nodeValue = text;
        }
    },

    get_text: function() {
        //return this.element.innerHTML;
        // TODO : Optimization, store the text value isn't of referencing it from the element
        if (this.use_inner_html) {
            return this.element.innerHTML;
        }
        return this.element.nodeValue;
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