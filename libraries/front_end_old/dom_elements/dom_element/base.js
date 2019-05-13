$_QE.prototype.DomElement = function() {};

Object.assign($_QE.prototype.DomElement.prototype, {

    __init__dom_element: function(display_style) {
        this._initialize_display_style(display_style);
        this._element_is_transformed = false;
    },

    __init__external: function(_id, display_style) {
        this._element = document.getElementById(_id);
        if (this._element === null) {
            QE.warning('Dom element ID not found!', _id);
        }
        this._id = _id;
        this._initialize_display_style(display_style);
        return this;
    },

    __init__internal: function(dom_type, _id=null, display_style) {
        this._id      = _id;
        this._element = document.createElement(dom_type);
        if (this._id != null) {
            this._element.id = _id;
        }
        this._initialize_display_style(display_style);
        return this;
    },

    __init__internal_link: function(_id, display_style) {
        return this.__init__internal('a', _id, display_style);
    },

    hide: function() {
        this._element.style.display = 'none';
        this.hidden                 = true;
    },

    show: function() {
        this._element.style.display = this._display_style;
        this.hidden                 = false;
    },

    make_invisible: function() {
        this._element.style.visibility = 'hidden';
        this.visible                   = false;
    },

    make_visible: function() {
        this._element.style.visibility = 'visible';
        this.visible                   = true;
    },

    is_visible: function() {
        return this.visible;
    },

    set_background_color: function(color) {
        if (this._element_background_color !== color) {
            this._element_background_color      = color;
            this._element.style.backgroundColor = color;
        }
    },

    dom_element_set_foreground_color: function(color) {
        if (this._element_foreground_color !== color) {
            this._element_foreground_color = color;
            this._element.style.color      = color;
        }
    },

    dom_element_set_border_color: function(color) {
        if (this._element_border_color !== color) {
            this._element_border_color      = color;
            this._element.style.borderColor = color;
        }
    },

    _initialize_display_style: function(style) {
        this._display_style = style ? style : 'block';
    },

    dom_element_set_offset_y: function(offset_y) {
        this._element_is_transformed  = offset_y !== 0;
        this._element.style.transform = 'translateY(' + offset_y.toString() + 'px)';
    },

    dom_element_set_offset_x: function(offset_x) {
        this._element_is_transformed  = offset_x !== 0;
        this._element.style.transform = 'translateX(' + offset_x.toString() + 'px)';
    },

    dom_element_set_offset_xy: function(offset_x, offset_y) {
        this._element_is_transformed  = (offset_x !== 0) || (offset_y !== 0);
        this._element.style.transform = 'translate(' + offset_x.toString() + 'px,' + offset_y.toString() + 'px)';
    },

    dom_element_reset_transformation_if_needed: function() {
        if (this._element_is_transformed) {
            this.dom_element_set_offset_xy(0, 0);
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
