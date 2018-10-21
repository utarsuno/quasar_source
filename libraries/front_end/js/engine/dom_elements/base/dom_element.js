'use strict';

$_QE.prototype.DomElement = function() {};

Object.assign($_QE.prototype.DomElement.prototype, {

    // Default.
    _display_style: 'block',
    _element      : null,
    _id_name      : null,
    _dom_type     : '',

    set_from_canvas: function(canvas_element) {
        return this._create_dom_element(canvas_element, DOM_ELEMENT_INSTANCE_PROVIDED, DOM_ELEMENT_CANVAS);
    },

    create_div_from_existing: function(element_id) {
        return this._create_dom_element(element_id, DOM_ELEMENT_INSTANCE_EXISTS, DOM_ELEMENT_DIV);
    },

    create_h1_from_existing: function(element_id) {
        return this._create_dom_element(element_id, DOM_ELEMENT_INSTANCE_EXISTS, DOM_ELEMENT_H1);
    },

    create_h5_from_existing: function(element_id) {
        return this._create_dom_element(element_id, DOM_ELEMENT_INSTANCE_EXISTS, DOM_ELEMENT_H5);
    },

    _create_dom_element: function(data, instance_type, dom_element_type) {
        this._dom_type = dom_element_type;
        switch (instance_type) {
        case DOM_ELEMENT_INSTANCE_EXISTS:
            this._id_name = data;
            this._element = document.getElementById(data);
            if (!(this._element != null)) {
                l('Element with ID {' + this._id_name + '} not found!');
            }
            break;
        case DOM_ELEMENT_INSTANCE_DNE:
            this._id_name = data;
            this._element = null;
            break;
        case DOM_ELEMENT_INSTANCE_PROVIDED:
            this._element = data;
            this._id_name = this._element.id;
            break;
        }
        if (this._element == null) {
            this._element = document.createElement(this._dom_type);
            if (this._id_name != null) {
                this._element.id = this._id_name;
            }
        }
        return this;
    },

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

    append_to_document_body: function() {
        document.body.appendChild(this._element);
    },

    add_class: function(class_name) {
        this._element.classList.add(class_name);
    },

    is_visible: function() {
        return this.visible;
    },

    set_id: function(_id) {
        if (this._id_name !== _id) {
            this._id_name = _id;
            this._element.id = _id;
        }
    },

    //set_color: function(color) {
    //    this._element.style.color = color;
    //},

    set_display_style: function(style) {
        this._display_style = style;
    },
});