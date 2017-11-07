'use strict'

function DomElement(id_name) {
    this.__init__(id_name)
}

DomElement.prototype = {


    __init__: function(id_name) {
        this.element = document.getElementById(id_name)
    },

    set_color: function(color) {
        this.element.style.color = color
    },

    get_element: function() {
        return this.element
    },

    hide: function() {
        this.element.style.display = DISPLAY_NONE
        this.hidden = true
    },

    show: function() {
        this.element.style.display = DISPLAY_SHOW
        this.hidden = false
    },

    is_hidden: function() {
        return this.hidden
    },

    set_text: function(text) {
        this.element.innerHTML = text
    },

    get_text: function() {
        return this.element.innerHTML
    },

    clear: function() {
        this.element.innerHTML = ''
    },

    make_invisible: function() {
        this.element.style.visibility = NOT_VISIBLE
        this.visible = false
    },

    make_visible: function() {
        this.element.style.visibility = VISIBLE
        this.visible = true
    },

    is_visible: function() {
        return this.visible
    }
}