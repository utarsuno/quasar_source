'use strict'

function DomElement(id_name) {
    this.__init__(id_name)
}

DomElement.prototype = {


    __init__: function(id_name) {
        this.element = document.getElementById(id_name)
    },

    get_element: function() {
        return this.element
    },

    hide: function() {
        this.element.style.display = DISPLAY_NONE
    },

    show: function() {
        this.element.style.display = DISPLAY_SHOW
    },

    set_text: function(text) {
        this.element.innerHTML = text
    },

    get_text: function() {
        return this.element.innerHTML
    },

}