'use strict';

$_QE.prototype.DomElement = function() {};

Object.assign($_QE.prototype.DomElement.prototype, {

    hide: function() {
        this._element.style.display = 'none';
        this.hidden = true;
    },

    show: function() {
        this._element.style.display = this._display_style;
        this.hidden = false;
    },

    make_invisible: function() {
        this._element.style.visibility = 'hidden';
        this.visible = false;
    },

    make_visible: function() {
        this._element.style.visibility = 'visible';
        this.visible = true;
    },

    is_visible: function() {
        return this.visible;
    },

    dom_element_set_background_color: function(color) {
        if (this._element_background_color != color) {
            this._element_background_color      = color;
            this._element.style.backgroundColor = color;
        }
    },

    dom_element_set_foreground_color: function(color) {
        if (this._element_foreground_color != color) {
            this._element_foreground_color = color;
            this._element.style.color      = color;
        }
    },

    dom_element_set_border_color: function(color) {
        if (this._element_border_color != color) {
            this._element_border_color      = color;
            this._element.style.borderColor = color;
        }
    },

    _initialize_display_style: function(style) {
        if (style != null) {
            this._display_style = style;
        } else {
            this._display_style = 'block';
        }
    },
});

/*
Useful but currently un-used:

    append_to_document_body: function() {
        document.body.appendChild(this._element);
    },

    add_class: function(class_name) {
        this._element.classList.add(class_name);
    },

    set_id: function(_id) {
        if (this._id_name != _id) {
            this._id_name    = _id;
            this._element.id = _id;
        }
    },

    //set_color: function(color) {
    //    this._element.style.color = color;
    //},

 */
